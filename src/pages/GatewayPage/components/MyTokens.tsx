import React, { useMemo } from 'react';
import { ArrowLeft, Wallet, Calendar } from 'lucide-react';
import { useTonTokenBalances } from '../../../hooks/useTonTokenBalances';

interface Token {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  date: string;
  price: number;
}

interface MyTokensProps {
  tokens: Token[];
  walletAddress: string | null;
}

export const MyTokens: React.FC<MyTokensProps> = ({ tokens, walletAddress }) => {
  const tokenList = useMemo(() => [
    { symbol: 'TON', address: null },
    { symbol: 'HYPE', address: '0:52312df266a2be2948611954e4b50a80fc2b96b1e11127a33b024b0d61a8dfa8' },
    // Adicione outros tokens se necessário
  ], []);
  const balances = useTonTokenBalances(walletAddress, tokenList);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="p-6 pt-12">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Mis Tokens</h1>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">

        {/* Token Distribution */}
        {tokenList.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Tokens</h2>
            <div className="space-y-3">
              {tokenList.map(token => (
                <div key={token.symbol} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-orange-600">{token.symbol}</span>
                    </div>
                    <span className="font-medium text-gray-800">{token.symbol}</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {balances === null
                      ? '...'
                      : (balances[token.symbol]?.toFixed(4) ?? '0.0000')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transactions List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Historial de Compras</h2>
          </div>

          {tokens.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Ninguna transacción aún</h3>
              <p className="text-gray-600">
                Haz tu primera compra de tokens para ver el historial aquí
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {tokens.map((token) => (
                <div key={token.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-orange-600">{token.symbol}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{token.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(token.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">
                        {token.amount.toFixed(2)} {token.symbol}
                      </p>
                      <p className="text-sm text-gray-600">R$ {token.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-orange-50 rounded-2xl p-4 border border-orange-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <Wallet className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-orange-800">Sobre tus tokens</p>
              <p className="text-xs text-orange-600 mt-1">
                Todos los tokens comprados son enviados automáticamente a tu billetera TON conectada. 
                Puedes visualizar tus tokens directamente en tu billetera.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};