import { useCallback } from 'react';
import { useWallet } from '@/context/wallet-context';
import { WalletNetwork } from '@creit.tech/stellar-wallets-kit';
import { formatBalance, getAllBalances, getXlmBalance } from '@/utils/wallet-utils';

export const useWalletActions = () => {
  const { 
    kit, 
    isConnected, 
    publicKey, 
    selectedWallet, 
    network,
    connect, 
    disconnect, 
    signTransaction,
    isLoading, 
    error 
  } = useWallet();

  const safeConnect = useCallback(async () => {
    try {
      await connect();
    } catch (err) {
      console.error('Connection failed:', err);
      throw new Error('Failed to connect wallet. Please try again.');
    }
  }, [connect]);

  const safeDisconnect = useCallback(async () => {
    try {
      await disconnect();
    } catch (err) {
      console.error('Disconnection failed:', err);
      throw new Error('Failed to disconnect wallet. Please try again.');
    }
  }, [disconnect]);

  const safeSignTransaction = useCallback(async (
    transactionXdr: string,
    _network: WalletNetwork = WalletNetwork.TESTNET
  ) => {
    if (!isConnected) {
      throw new Error('Wallet not connected. Please connect your wallet first.');
    }

    if (!kit) {
      throw new Error('Wallet kit not initialized.');
    }

    try {
      const signedTx = await signTransaction(transactionXdr);
      if (!signedTx) {
        throw new Error('Transaction signing failed.');
      }
      return signedTx;
    } catch (err) {
      console.error('Transaction signing failed:', err);
      throw new Error('Failed to sign transaction. Please try again.');
    }
  }, [isConnected, kit, signTransaction]);

  const getBalance = useCallback(async (
    network: WalletNetwork = WalletNetwork.TESTNET
  ) => {
    if (!isConnected || !publicKey) {
      throw new Error('Wallet not connected. Please connect your wallet first.');
    }

    try {
      const balance = await getXlmBalance(publicKey, network);
      return balance;
    } catch (err) {
      console.error('Error getting balance:', err);
      throw new Error('Failed to get wallet balance. Please try again.');
    }
  }, [isConnected, publicKey]);

  const getAllAccountBalances = useCallback(async (
    network: WalletNetwork = WalletNetwork.TESTNET
  ) => {
    if (!isConnected || !publicKey) {
      throw new Error('Wallet not connected. Please connect your wallet first.');
    }

    try {
      const balances = await getAllBalances(publicKey, network);
      return balances;
    } catch (err) {
      console.error('Error getting all balances:', err);
      throw new Error('Failed to get wallet balances. Please try again.');
    }
  }, [isConnected, publicKey]);

  const getFormattedBalance = useCallback(async (
    network: WalletNetwork = WalletNetwork.TESTNET
  ) => {
    if (!isConnected || !publicKey) {
      return '0 XLM';
    }

    try {
      const balance = await getXlmBalance(publicKey, network);
      return formatBalance(balance, 'XLM');
    } catch (err) {
      console.error('Error getting formatted balance:', err);
      return '0 XLM';
    }
  }, [isConnected, publicKey]);

  const getWalletInfo = useCallback(() => {
    return {
      isConnected,
      publicKey,
      selectedWallet,
      isLoading,
      error
    };
  }, [isConnected, publicKey, selectedWallet, isLoading, error]);

  return {
    // Actions
    connect: safeConnect,
    disconnect: safeDisconnect,
    signTransaction: safeSignTransaction,
    
    // Balance functions
    getBalance,
    getAllAccountBalances,
    getFormattedBalance,
    
    // State
    getWalletInfo,
    isConnected,
    publicKey,
    selectedWallet,
    network,
    isLoading,
    error,
    
    // Raw kit for advanced usage
    kit
  };
}; 