/**
 * Certificate Service
 * Handles NFT certificate operations and blockchain integration with NFTCert.sol
 */

const logger = require('../utils/logger');
const supabase = require('./supabaseService');
const ethers = require('ethers');
const fs = require('fs');
const path = require('path');

// Initialize blockchain components
let provider, wallet;
let nftCertContract, nftCertABI;

/**
 * Initialize the NFT certificate contract connection
 */
const initNFTCertContract = () => {
  if (process.env.NODE_ENV === 'test') {
    logger.info('Test mode - blockchain operations will be skipped');
    return false;
  }

  try {
    // Load contract ABI
    try {
      nftCertABI = JSON.parse(
        fs.readFileSync(
          path.join(__dirname, '../../contracts/artifacts/contracts/NFTCert.sol/NFTCert.json')
        )
      ).abi;
    } catch (error) {
      logger.error('Error loading NFTCert ABI:', error.message);
      return false;
    }

    // Provider setup for blockchain interaction
    const infuraApiKey = process.env.INFURA_API_KEY;
    const ethereumRpcUrl = process.env.ETHEREUM_RPC_URL || 
                         (infuraApiKey ? `https://sepolia.infura.io/v3/${infuraApiKey}` : 
                         "http://localhost:8545");
    
    logger.info(`Connecting to Ethereum network for NFTCert contract at: ${ethereumRpcUrl.replace(infuraApiKey || '', 'REDACTED')}`);
    provider = new ethers.JsonRpcProvider(ethereumRpcUrl);
    
    // Initialize wallet with private key
    if (!process.env.PRIVATE_KEY) {
      logger.error('PRIVATE_KEY not set in environment');
      return false;
    }

    wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    // Initialize contract with address
    const contractAddress = process.env.NFTCERT_CONTRACT_ADDRESS;
    if (contractAddress && contractAddress.trim() !== "") {
      nftCertContract = new ethers.Contract(
        contractAddress,
        nftCertABI,
        wallet
      );
      logger.info(`NFTCert contract initialized at address: ${contractAddress}`);
      return true;
    } else {
      logger.warn('NFTCert contract not initialized: Missing contract address');
      return false;
    }
  } catch (error) {
    logger.error('Error initializing NFTCert contract:', error.message);
    return false;
  }
};

/**
 * Check if NFT certificate blockchain connection is available
 */
const isNFTCertContractAvailable = async () => {
  if (process.env.NODE_ENV === 'test' || !provider || !nftCertContract) {
    return false;
  }

  try {
    await provider.getBlockNumber();
    return true;
  } catch (error) {
    logger.error('NFTCert blockchain provider connection failed:', error.message);
    return false;
  }
};

/**
 * Create metadata for an NFT certificate
 * @param {string} skillName - Name of the skill/certificate
 * @param {string} employeeName - Name of the employee
 * @param {string} issueDate - Date of issuance
 * @param {string} description - Certificate description
 * @returns {Object} Metadata object
 */
const createCertificateMetadata = (skillName, employeeName, issueDate, description) => {
  return {
    name: `${skillName} Certificate`,
    description: description || `${skillName} certification issued to ${employeeName}`,
    image: `https://placekitten.com/400/400`, // Placeholder, will be replaced with actual image
    attributes: [
      {
        trait_type: "Skill",
        value: skillName
      },
      {
        trait_type: "Recipient",
        value: employeeName
      },
      {
        trait_type: "Issue Date",
        value: issueDate
      }
    ]
  };
};

/**
 * Upload certificate metadata to IPFS (placeholder)
 * @param {Object} metadata - Certificate metadata
 * @returns {string} IPFS URI
 */
const uploadMetadataToIPFS = async (metadata) => {
  // TODO: Replace with actual IPFS integration
  // This is just a placeholder that returns a fake IPFS URI
  logger.info('Placeholder for IPFS metadata upload:', metadata);
  
  // Generate a pseudo-random hash for demonstration
  const pseudoHash = Math.random().toString(36).substring(2, 15);
  return `ipfs://QmHash${pseudoHash}`;
};

/**
 * Mint an NFT certificate on the blockchain
 * @param {string} employeeId - Database UUID of the employee
 * @param {string} employeeWallet - Employee's wallet address
 * @param {string} skillName - Name of the skill/certificate
 * @param {string} metadataURI - IPFS URI for the certificate metadata
 * @returns {Object} Minting result
 */
const mintCertificate = async (employeeId, employeeWallet, skillName, metadataURI) => {
  if (process.env.NODE_ENV === 'test' || !nftCertContract) {
    logger.warn('Skipping blockchain operation in test mode or contract not initialized');
    return { success: false, reason: 'Test mode or contract not initialized' };
  }

  try {
    // Check connection first
    if (!await isNFTCertContractAvailable()) {
      return { success: false, reason: 'Blockchain connection not available' };
    }
    
    // Call the smart contract function to mint the certificate
    const tx = await nftCertContract.mintCertificate(
      employeeWallet,
      employeeId,
      metadataURI
    );
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    
    // Find token ID from the event
    const mintEvent = receipt.logs
      .map(log => nftCertContract.interface.parseLog(log))
      .find(event => event?.name === 'CertificateMinted');
    
    const tokenId = mintEvent ? mintEvent.args[1] : null;
    
    logger.info(`Certificate minted for employee ID: ${employeeId}, token ID: ${tokenId}, tx: ${tx.hash}`);
    
    return {
      success: true,
      txHash: tx.hash,
      tokenId
    };
  } catch (error) {
    logger.error(`Error minting certificate on blockchain: ${error.message}`);
    return {
      success: false,
      reason: error.message
    };
  }
};

/**
 * Save certificate record to database
 * @param {string} tokenId - NFT token ID
 * @param {string} employeeId - Database UUID of the employee
 * @param {string} skillName - Name of the skill/certificate
 * @param {string} tokenURI - IPFS URI for the certificate metadata
 * @returns {Object} Database insert result
 */
const saveCertificateRecord = async (tokenId, employeeId, skillName, tokenURI) => {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .insert({
        token_id: tokenId,
        emp_id: employeeId,
        skill_name: skillName,
        token_uri: tokenURI
      });

    if (error) {
      logger.error('Error saving certificate record to database:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    logger.error('Exception saving certificate record to database:', error);
    return { success: false, error };
  }
};

/**
 * Get employee certificates
 * @param {string} employeeId - Database UUID of the employee
 * @returns {Array} Certificate records for the employee
 */
const getEmployeeCertificates = async (employeeId) => {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('emp_id', employeeId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching employee certificates:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    logger.error('Exception fetching employee certificates:', error);
    return { success: false, error };
  }
};

/**
 * Get all certificates with pagination
 * @param {number} page - Page number
 * @param {number} limit - Records per page
 * @returns {Array} Certificate records
 */
const getAllCertificates = async (page = 1, limit = 10) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  try {
    const { data, error, count } = await supabase
      .from('certificates')
      .select('*, employees!inner(name, email)', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching all certificates:', error);
      return { success: false, error };
    }

    return { 
      success: true, 
      data,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit)
      }
    };
  } catch (error) {
    logger.error('Exception fetching all certificates:', error);
    return { success: false, error };
  }
};

// Initialize contract on module load
const initialized = initNFTCertContract();

module.exports = {
  isNFTCertContractAvailable,
  createCertificateMetadata,
  uploadMetadataToIPFS,
  mintCertificate,
  saveCertificateRecord,
  getEmployeeCertificates,
  getAllCertificates
}; 