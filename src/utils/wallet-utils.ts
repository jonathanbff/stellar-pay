import { StellarWalletsKit, WalletNetwork } from '@creit.tech/stellar-wallets-kit';

/**
 * Format a Stellar address for display (shows first 6 and last 4 characters)
 */
export const formatAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Sign a transaction using the wallet kit
 */
export const signTransaction = async (
  kit: StellarWalletsKit,
  transactionXdr: string,
  network: WalletNetwork = WalletNetwork.TESTNET
): Promise<string> => {
  try {
    const { address } = await kit.getAddress();
    const { signedTxXdr } = await kit.signTransaction(transactionXdr, {
      address,
      networkPassphrase: network
    });
    return signedTxXdr;
  } catch (error) {
    console.error('Error signing transaction:', error);
    throw error;
  }
};

/**
 * Get the current wallet address
 */
export const getWalletAddress = async (kit: StellarWalletsKit): Promise<string> => {
  try {
    const { address } = await kit.getAddress();
    return address;
  } catch (error) {
    console.error('Error getting wallet address:', error);
    throw error;
  }
};

/**
 * Check if a wallet is connected
 */
export const isWalletConnected = async (kit: StellarWalletsKit): Promise<boolean> => {
  try {
    await kit.getAddress();
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Validate a Stellar address format
 */
export const isValidStellarAddress = (address: string): boolean => {
  if (!address) return false;
  
  // Stellar addresses are 56 characters long and start with G, M, or S
  const stellarAddressRegex = /^[GMS][A-Z2-7]{55}$/;
  return stellarAddressRegex.test(address);
};

/**
 * Get network display name
 */
export const getNetworkDisplayName = (network: WalletNetwork): string => {
  switch (network) {
    case WalletNetwork.PUBLIC:
      return 'Mainnet';
    case WalletNetwork.TESTNET:
      return 'Testnet';
    case WalletNetwork.FUTURENET:
      return 'Futurenet';
    default:
      return 'Unknown';
  }
};

/**
 * Get wallet display name by ID
 */
export const getWalletDisplayName = (walletId: string): string => {
  switch (walletId) {
    case 'freighter':
      return 'Freighter';
    case 'xbull':
      return 'xBull';
    case 'albedo':
      return 'Albedo';
    case 'walletconnect':
      return 'WalletConnect';
    case 'ledger':
      return 'Ledger';
    case 'trezor':
      return 'Trezor';
    default:
      return 'Unknown Wallet';
  }
};

/**
 * Get XLM balance for a Stellar account
 */
export const getXlmBalance = async (
  address: string,
  network: WalletNetwork = WalletNetwork.TESTNET
): Promise<string> => {
  try {
    const accountInfo = await getAccountInfo(address, network);
    
    // Find XLM balance (native asset)
    const xlmBalance = accountInfo.balances.find((balance: any) => 
      balance.asset_type === 'native'
    );
    
    if (!xlmBalance) {
      return '0';
    }
    
    // Convert from stroops to XLM (1 XLM = 10,000,000 stroops)
    const balanceInXlm = parseFloat(xlmBalance.balance) / 10000000;
    return balanceInXlm.toFixed(7); // 7 decimal places for XLM
  } catch (error) {
    console.error('Error getting XLM balance:', error);
    throw error;
  }
};

/**
 * Get all balances for a Stellar account
 */
export const getAllBalances = async (
  address: string,
  network: WalletNetwork = WalletNetwork.TESTNET
): Promise<Array<{asset: string, balance: string, assetType: string}>> => {
  try {
    const accountInfo = await getAccountInfo(address, network);
    
    return accountInfo.balances.map((balance: any) => {
      let asset = 'XLM';
      let assetType = 'native';
      
      if (balance.asset_type !== 'native') {
        asset = `${balance.asset_code}:${balance.asset_issuer}`;
        assetType = 'token';
      }
      
      // Convert from stroops to XLM for native asset
      let balanceValue = balance.balance;
      if (balance.asset_type === 'native') {
        balanceValue = (parseFloat(balance.balance) / 10000000).toFixed(7);
      }
      
      return {
        asset,
        balance: balanceValue,
        assetType
      };
    });
  } catch (error) {
    console.error('Error getting all balances:', error);
    throw error;
  }
};

/**
 * Format balance for display
 */
export const formatBalance = (balance: string, asset: string = 'XLM'): string => {
  const numBalance = parseFloat(balance);
  
  if (asset === 'XLM') {
    if (numBalance >= 1000) {
      return `${(numBalance / 1000).toFixed(2)}k XLM`;
    } else if (numBalance >= 1) {
      return `${numBalance.toFixed(2)} XLM`;
    } else {
      return `${numBalance.toFixed(4)} XLM`;
    }
  }
  
  return `${balance} ${asset}`;
};

/**
 * Create a simple transaction XDR for testing
 * This is just an example - in real usage you'd create proper Stellar transactions
 */
export const createTestTransactionXdr = (): string => {
  // This is a placeholder - in real implementation you'd use Stellar SDK
  // to create actual transactions
  return 'AAAAAgAAAABiSu3MsK8G+lrAR0IOEgwq8ZJbVjHcOBrnM2yBbuTjAAAAZAA65AMAAAABAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAABAAAAAGJK7cywrwb6WsBHQg4SDCrxkltWMdw4GuczbIFu5OMAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAA';
};

/**
 * Submit a signed transaction to the network
 */
export const submitTransaction = async (
  signedTxXdr: string,
  network: WalletNetwork = WalletNetwork.TESTNET
): Promise<string> => {
  try {
    const serverUrl = network === WalletNetwork.PUBLIC 
      ? 'https://horizon.stellar.org' 
      : 'https://horizon-testnet.stellar.org';
    
    const response = await fetch(`${serverUrl}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tx: signedTxXdr,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Transaction failed: ${errorData.extras?.result_codes?.operations?.join(', ') || 'Unknown error'}`);
    }

    const result = await response.json();
    return result.hash;
  } catch (error) {
    console.error('Error submitting transaction:', error);
    throw error;
  }
};

/**
 * Get account information from the network
 */
export const getAccountInfo = async (
  address: string,
  network: WalletNetwork = WalletNetwork.TESTNET
): Promise<any> => {
  try {
    const serverUrl = network === WalletNetwork.PUBLIC 
      ? 'https://horizon.stellar.org' 
      : 'https://horizon-testnet.stellar.org';
    
    const response = await fetch(`${serverUrl}/accounts/${address}`);
    
    if (!response.ok) {
      throw new Error('Account not found');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting account info:', error);
    throw error;
  }
}; 