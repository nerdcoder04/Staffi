// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Employee.sol";

contract NFTCert is ERC721, Ownable {
    uint256 private _nextTokenId;
    Employee public employeeContract;
    
    // Map token IDs to employee IDs
    mapping(uint256 => string) private _tokenEmployeeIds;
    
    // Map token IDs to URIs
    mapping(uint256 => string) private _tokenURIs;

    event CertificateMinted(address indexed to, uint256 tokenId, string tokenURI, string employeeId);

    constructor(address _employeeContract) 
        ERC721("STAFFI Certificates", "CERT")
        Ownable(msg.sender)
    {
        employeeContract = Employee(_employeeContract);
    }

    function mintCertificate(address to, string memory employeeId, string memory uri) 
        external 
        onlyOwner 
        returns (uint256) 
    {
        require(employeeContract.isEmployee(employeeId), "Not a valid employee");
        
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = uri;
        _tokenEmployeeIds[tokenId] = employeeId;
        
        emit CertificateMinted(to, tokenId, uri, employeeId);
        return tokenId;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireOwned(tokenId);
        return _tokenURIs[tokenId];
    }
    
    function getEmployeeIdForToken(uint256 tokenId) public view returns (string memory) {
        _requireOwned(tokenId);
        return _tokenEmployeeIds[tokenId];
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
} 