import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, Copy } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
  amount: string;
  token: string;
  isWaiting: boolean;
  isCompleted: boolean;
  walletAddress?: string;
  onBack: () => void;
}

// Função para gerar payload PIX simples
interface PixPayload {
  chave: string;
  valor: string | number;
  nome: string;
  cidade: string;
  txid: string;
}
function gerarPayloadPix({ chave, valor, nome, cidade, txid }: PixPayload): string {
  // Para produção, use uma lib de EMV/PIX! Aqui é um exemplo simplificado.
  const valorStr = Number(valor).toFixed(2).replace('.', '');
  return `00020126580014br.gov.bcb.pix0136${chave}520400005303986540${valorStr}5802BR5913${nome}6009${cidade}62070503${txid}6304`;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  amount,
  token,
  isWaiting,
  isCompleted,
  walletAddress,
  onBack
}) => {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [copied, setCopied] = useState(false);

  // Dados da Transfero
  const pixKey = 'stellar-pay@transfero.com.br';
  const nome = 'Transfero';
  const cidade = 'Rio deJaneiro';
  const txid = 'TONGW' + (walletAddress ? walletAddress.slice(-6) : '000000');
  const payloadPix = gerarPayloadPix({ chave: pixKey, valor: amount || '0.01', nome, cidade, txid });

  useEffect(() => {
    if (isWaiting && !isCompleted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isWaiting, isCompleted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex flex-col justify-center items-center p-6">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-800">¡Pago Confirmado!</h1>
              <p className="text-gray-600">
                Tus tokens {token} fueron enviados a tu billetera
              </p>
            </div>

            {walletAddress && (
              <div className="bg-white rounded-2xl p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Billetera de destino:</p>
                <p className="text-sm font-mono text-gray-800 break-all">
                  {walletAddress}
                </p>
              </div>
            )}

            <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
              <p className="text-sm text-green-800">
                <span className="font-medium">Valor:</span> R$ {amount}
              </p>
              <p className="text-sm text-green-800">
                <span className="font-medium">Token:</span> {token}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="p-6 pt-12">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Código QR PIX</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="space-y-6">
          {/* Payment Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-800">R$ {amount}</h2>
                <p className="text-gray-600">Para comprar {token}</p>
              </div>
              {/* Timer */}
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <span className="text-lg font-semibold text-orange-600">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Tempo restante para el pago
              </p>
            </div>
          </div>

          {/* QR Code real */}
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Escanea el Código QR</h3>
            <div className="flex justify-center">
              <div className="w-64 h-64 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
                <QRCodeSVG
                  value={payloadPix}
                  size={220}
                  imageSettings={{
                    src: '/assets/application.png', // caminho do seu logo
                    height: 40,
                    width: 40,
                    excavate: true
                  }}
                />
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Usa la app de tu banco para escanear el Código QR
            </p>
            <div className="mt-2">
              <p className="text-xs text-gray-500">O copia el código PIX:</p>
              <div className="bg-gray-50 rounded-xl p-2 text-xs font-mono break-all select-all border border-gray-200">
                {payloadPix}
              </div>
            </div>
          </div>

          {/* PIX Key */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Chave PIX</h3>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">E-mail</p>
                    <p className="font-mono text-gray-800 break-all">{pixKey}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(pixKey)}
                    className="ml-4 p-2 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors"
                  >
                    <Copy className={`w-4 h-4 ${copied ? 'text-green-600' : 'text-orange-600'}`} />
                  </button>
                </div>
              </div>

              {copied && (
                <p className="text-sm text-green-600 text-center">
                  Chave PIX copiada!
                </p>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-orange-50 rounded-2xl p-4 border border-orange-200">
            <div className="space-y-3">
              <h3 className="font-semibold text-orange-800">Cómo pagar:</h3>
              <div className="space-y-2 text-sm text-orange-700">
                <p>1. Abre la app de tu banco</p>
                <p>2. Elige "PIX" o "Pagar"</p>
                <p>3. Escanea el Código QR o pega la clave PIX</p>
                <p>4. Confirma el pago de R$ {amount}</p>
                <p>5. Espera la confirmación automática</p>
              </div>
            </div>
          </div>

          {/* Wallet Info */}
          {walletAddress && (
            <div className="bg-gray-100 rounded-2xl p-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-800">Los tokens serán enviados a:</p>
                <p className="text-sm font-mono text-gray-600 break-all">
                  {walletAddress}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};