'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  FREIGHTER_ID,
  ISupportedWallet
} from '@creit.tech/stellar-wallets-kit';

interface WalletContextType {
  kit: StellarWalletsKit | null;
  isConnected: boolean;
  publicKey: string | null;
  selectedWallet: string | null;
  network: WalletNetwork;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  openWalletModal: () => Promise<void>;
  getAddress: () => Promise<string | null>;
  signTransaction: (transactionXdr: string) => Promise<string | null>;
  isLoading: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [kit, setKit] = useState<StellarWalletsKit | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [network] = useState<WalletNetwork>(WalletNetwork.TESTNET);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize the wallet kit
  useEffect(() => {
    const initializeKit = () => {
      try {
        const walletKit = new StellarWalletsKit({
          network: WalletNetwork.TESTNET, // Change to PUBLIC for mainnet
          selectedWalletId: FREIGHTER_ID,
          modules: allowAllModules(),
        });
        setKit(walletKit);
        
        // Check if wallet is already connected
        checkConnectionStatus(walletKit);
      } catch (err) {
        console.error('Error initializing wallet kit:', err);
        setError('Failed to initialize wallet');
      }
    };

    initializeKit();
  }, []);

  const checkConnectionStatus = async (walletKit: StellarWalletsKit) => {
    try {
      const { address } = await walletKit.getAddress();
      if (address) {
        setPublicKey(address);
        setIsConnected(true);
        // Don't set selected wallet here - let it be set when user actually connects
      }
    } catch (err) {
      // Wallet not connected, which is normal
      setIsConnected(false);
      setPublicKey(null);
      setSelectedWallet(null);
    }
  };

  const connect = async () => {
    if (!kit) {
      setError('Wallet kit not initialized');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await openWalletModal();
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    if (!kit) return;

    setIsLoading(true);
    setError(null);

    try {
      // Clear wallet state locally
      setIsConnected(false);
      setPublicKey(null);
      setSelectedWallet(null);
      
      // Note: The kit doesn't have a direct disconnect method
      // The wallet connection state is managed by the wallet itself
      // We just clear our local state
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      setError('Failed to disconnect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const openWalletModal = async () => {
    if (!kit) {
      setError('Wallet kit not initialized');
      return;
    }

    try {
      await kit.openModal({
        onWalletSelected: async (option: ISupportedWallet) => {
          try {
            await kit.setWallet(option.id);
            setSelectedWallet(option.id);
            
            // Get the wallet address
            const { address } = await kit.getAddress();
            setPublicKey(address);
            setIsConnected(true);
            setError(null);
          } catch (err) {
            console.error('Error setting wallet:', err);
            setError('Failed to connect to selected wallet');
            setIsConnected(false);
            setPublicKey(null);
          }
        },
        onClosed: (err: Error) => {
          if (err) {
            console.error('Modal closed with error:', err);
            setError('Wallet connection was cancelled');
          }
        },
        modalTitle: 'Conectar billetera Stellar',
        notAvailableText: 'Nenhuma billetera disponível'
      });
    } catch (error) {
      console.error('Error opening wallet modal:', error);
      setError('Failed to open wallet selection modal');
    }
  };

  const getAddress = async (): Promise<string | null> => {
    if (!kit || !isConnected) {
      return null;
    }

    try {
      const { address } = await kit.getAddress();
      return address;
    } catch (err) {
      console.error('Error getting address:', err);
      setError('Failed to get wallet address');
      return null;
    }
  };

  const signTransaction = async (transactionXdr: string): Promise<string | null> => {
    if (!kit || !isConnected) {
      setError('Wallet not connected');
      return null;
    }

    try {
      const { address } = await kit.getAddress();
      const { signedTxXdr } = await kit.signTransaction(transactionXdr, {
        address,
        networkPassphrase: WalletNetwork.TESTNET
      });
      return signedTxXdr;
    } catch (err) {
      console.error('Error signing transaction:', err);
      setError('Failed to sign transaction');
      return null;
    }
  };

  const value: WalletContextType = {
    kit,
    isConnected,
    publicKey,
    selectedWallet,
    network,
    connect,
    disconnect,
    openWalletModal,
    getAddress,
    signTransaction,
    isLoading,
    error,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}; 