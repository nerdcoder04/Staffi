import React, { createContext, useContext, useState, useEffect } from 'react';
import { MetaMaskSDK } from '@metamask/sdk';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface MetaMaskContextType {
  isConnected: boolean;
  account: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  balance: string;
  openModal: () => void;
  closeModal: () => void;
  isModalOpen: boolean;
}

const MetaMaskContext = createContext<MetaMaskContextType | undefined>(undefined);

export const MetaMaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [sdk, setSdk] = useState<MetaMaskSDK | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const initializeSDK = async () => {
      const MMSDK = new MetaMaskSDK({
        dappMetadata: {
          name: "STAFFI",
          url: window.location.href,
        },
        injectProvider: true,
      });
      setSdk(MMSDK);
      
      // Check if wallet was previously connected
      const storedAccount = localStorage.getItem('staffi_connected_account');
      if (storedAccount) {
        setAccount(storedAccount);
        setIsConnected(true);
        fetchBalance(storedAccount);
      }
    };

    initializeSDK();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const fetchBalance = async (walletAddress: string) => {
    try {
      if (!sdk) return;
      const ethereum = sdk.getProvider();
      if (!ethereum) return;

      const balanceHex = await ethereum.request({
        method: 'eth_getBalance',
        params: [walletAddress, 'latest'],
      }) as string;
      
      // Convert hex balance to ETH
      const balanceInWei = parseInt(balanceHex, 16);
      const balanceInEth = balanceInWei / Math.pow(10, 18);
      setBalance(balanceInEth.toFixed(4));
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance("0");
    }
  };

  const connect = async () => {
    try {
      if (!sdk) {
        throw new Error('MetaMask SDK not initialized');
      }

      const ethereum = sdk.getProvider();
      if (!ethereum) {
        throw new Error('MetaMask not found');
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' }) as string[];
      if (accounts && Array.isArray(accounts) && accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        localStorage.setItem('staffi_connected_account', accounts[0]);
        await fetchBalance(accounts[0]);
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      throw error;
    } finally {
      closeModal();
    }
  };

  const disconnect = () => {
    setAccount(null);
    setIsConnected(false);
    setBalance("0");
    localStorage.removeItem('staffi_connected_account');
  };

  return (
    <MetaMaskContext.Provider value={{ 
      isConnected, 
      account, 
      connect, 
      disconnect, 
      balance, 
      openModal, 
      closeModal, 
      isModalOpen 
    }}>
      {children}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Connect Your Wallet</DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <Button 
              className="w-full flex gap-3 items-center justify-center py-6"
              onClick={connect}
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                className="h-8 w-8" 
                alt="MetaMask" 
              />
              <span className="text-lg">MetaMask</span>
            </Button>
            <p className="text-xs text-gray-500 text-center mt-4">
              By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </MetaMaskContext.Provider>
  );
};

export const useMetaMask = () => {
  const context = useContext(MetaMaskContext);
  if (context === undefined) {
    throw new Error('useMetaMask must be used within a MetaMaskProvider');
  }
  return context;
};