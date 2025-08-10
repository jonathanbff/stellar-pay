import React, { useState, useEffect } from 'react';
import { Wallet, Shield, Zap, DollarSign, User } from 'lucide-react';
import { BuyToken } from './components/BuyToken';
import { MyTokens } from './components/MyTokens';
import { Profile } from './components/Profile';
import { BottomNavigation } from './components/BottomNavigation';
import { useWalletActions } from '../../hooks/use-wallet-actions';
import { WalletProvider } from '../../context/wallet-context';

type Screen = 'onboarding' | 'home' | 'buy' | 'tokens' | 'profile';

interface Token {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  date: string;
  price: number;
}

// Stellar wallet interface
interface StellarWallet {
  account: {
    address: string;
  };
  isConnected: boolean;
}

const GatewayPageContent: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [tokens, setTokens] = useState<Token[]>([]);
  const { isConnected, publicKey, connect, disconnect, isLoading, error } = useWalletActions();
  
  // Auto-redirect to Stellar Pay Gateway
  useEffect(() => {
    const redirectToGateway = () => {
      window.location.href = 'https://stellarpay-gateway.vercel.app/';
    };
    
    // Redirect immediately when component mounts
    redirectToGateway();
  }, []);
  
  // Create Stellar wallet object from wallet context
  const stellarWallet: StellarWallet | null = isConnected && publicKey ? {
    account: {
      address: publicKey
    },
    isConnected: true
  } : null;

  const handleLogin = async () => {
    try {
      await connect();
      setCurrentScreen('home');
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await disconnect();
      setCurrentScreen('onboarding');
      setTokens([]);
    } catch (err) {
      console.error('Failed to disconnect wallet:', err);
    }
  };

  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const addToken = (token: Omit<Token, 'id' | 'date'>) => {
    const newToken: Token = {
      ...token,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0]
    };
    setTokens(prev => [newToken, ...prev]);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <Onboarding onLogin={handleLogin} isLoading={isLoading} error={error} />;
      case 'home':
        return <Home onNavigate={navigateToScreen} tokens={tokens} wallet={stellarWallet} />;
      case 'buy':
        return (
          <BuyToken
            onTokenPurchased={addToken}
            onNavigate={navigateToScreen}
            wallet={stellarWallet}
          />
        );
      case 'tokens':
        return <MyTokens tokens={tokens} walletAddress={stellarWallet?.account.address || null} />;
      case 'profile':
        return <Profile wallet={stellarWallet} onLogout={handleLogout} />;
      default:
        return <Onboarding onLogin={handleLogin} isLoading={isLoading} error={error} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 pb-20">
        {renderCurrentScreen()}
      </div>
      {isConnected && currentScreen !== 'onboarding' && (
        <BottomNavigation 
          currentScreen={currentScreen} 
          onNavigate={navigateToScreen} 
        />
      )}
    </div>
  );
};

export const GatewayPage: React.FC = () => {
  return (
    <WalletProvider>
      <GatewayPageContent />
    </WalletProvider>
  );
};

// Onboarding Component
interface OnboardingProps {
  onLogin: () => void;
  isLoading: boolean;
  error: string | null;
}

const Onboarding: React.FC<OnboardingProps> = ({ onLogin, isLoading, error }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-white">
      {/* Header */}
      <div className="flex-1 flex flex-col justify-center p-6">
        <div className="text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-xl" style={{backgroundColor: '#fa9820'}}>
              <Wallet className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-800">
              Stellar Pay
            </h1>
            <p className="text-lg font-medium" style={{color: '#fa9820'}}>
              Compra tokens Stellar con PIX
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 max-w-sm mx-auto">
            <div className="flex items-center space-x-3 text-left">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: '#fef3e2'}}>
                <Zap className="w-5 h-5" style={{color: '#fa9820'}} />
              </div>
              <div>
                <p className="font-medium text-gray-800">Rápido y Fácil</p>
                <p className="text-sm text-gray-600">Compra en segundos vía PIX</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-left">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">100% Seguro</p>
                <p className="text-sm text-gray-600">Powered by Transfero</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-left">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Límite Diario</p>
                <p className="text-sm text-gray-600">Hasta R$ 2.500 (500 USD)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-6 space-y-4">
        <div className="p-4 rounded-2xl border" style={{backgroundColor: '#fef3e2', borderColor: '#fed7aa'}}>
          <p className="text-sm text-center" style={{color: '#c2410c'}}>
            <span className="font-medium">Gateway PIX</span> para comprar qualquer token na rede Stellar usando Transfero como provider.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl border border-red-200 bg-red-50">
            <p className="text-sm text-center text-red-600">
              {error}
            </p>
          </div>
        )}

        <div className="w-full">
          <button
            onClick={onLogin}
            disabled={isLoading}
            className="w-full text-white font-semibold py-4 px-6 rounded-2xl shadow-lg transition-all duration-200 transform active:scale-95 flex items-center justify-center space-x-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{backgroundColor: '#fa9820'}}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Conectando...</span>
              </>
            ) : (
              <>
                <User className="w-5 h-5" />
                <span>Conectar Billetera Stellar</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Clique para conectar sua carteira Stellar e começar a usar o Gateway
        </p>
      </div>
    </div>
  );
};

// Home Component
interface HomeProps {
  onNavigate: (screen: Screen) => void;
  tokens: Token[];
  wallet: StellarWallet | null;
}

const Home: React.FC<HomeProps> = ({ onNavigate, tokens, wallet }) => {
  const recentTokens = tokens.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="p-6 pt-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Stellar Gateway</h1>
              <p className="text-sm text-gray-600">¡Bienvenido de vuelta!</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor: '#fef3e2'}}>
              <Wallet className="w-6 h-6" style={{color: '#fa9820'}} />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Wallet Info */}
        {wallet && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Sua Carteira Stellar</h2>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Endereço</p>
              <p className="text-sm font-mono text-gray-800 break-all">
                {wallet.account.address}
              </p>
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-sm text-gray-600">Status:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Conectado
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate('buy')}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-left hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{backgroundColor: '#fef3e2'}}>
              <Zap className="w-6 h-6" style={{color: '#fa9820'}} />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Comprar Token</h3>
            <p className="text-sm text-gray-600">Vía PIX</p>
          </button>

          <button
            onClick={() => onNavigate('tokens')}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-left hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <Wallet className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Mis Tokens</h3>
            <p className="text-sm text-gray-600">Ver historial</p>
          </button>
        </div>

        {/* Recent Transactions */}
        {recentTokens.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Transacciones Recientes</h2>
              <button
                onClick={() => onNavigate('tokens')}
                className="text-sm font-medium"
                style={{color: '#fa9820'}}
              >
                Ver todas
              </button>
            </div>
            <div className="space-y-3">
              {recentTokens.map((token) => (
                <div key={token.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-800">{token.name}</p>
                    <p className="text-sm text-gray-600">{token.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{token.amount.toFixed(2)} {token.symbol}</p>
                    <p className="text-sm text-gray-600">R$ {token.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};