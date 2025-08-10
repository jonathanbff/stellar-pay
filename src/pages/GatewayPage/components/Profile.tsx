import React from 'react';
import { ArrowLeft, Wallet, Copy, Shield, Settings, HelpCircle, ExternalLink, LogOut } from 'lucide-react';

interface ProfileProps {
  wallet: any;
  onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ wallet, onLogout }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

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
            <h1 className="text-xl font-bold text-gray-800">Perfil</h1>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Wallet Info */}
        {wallet ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{backgroundColor: '#fef3e2'}}>
                <Wallet className="w-8 h-8" style={{color: '#fa9820'}} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">TON Wallet</h2>
                <p className="text-gray-600">Gateway PIX</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Dirección de la Billetera</label>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-gray-800 break-all text-sm">
                      {wallet.account.address}
                    </p>
                    <button
                      onClick={() => copyToClipboard(wallet.account.address)}
                      className="ml-4 p-2 rounded-lg transition-colors"
                      style={{backgroundColor: '#fef3e2'}}
                    >
                      <Copy className={`w-4 h-4 ${copied ? 'text-green-600' : ''}`} style={!copied ? {color: '#fa9820'} : {}} />
                    </button>
                  </div>
                </div>
                {copied && (
                  <p className="text-sm text-green-600 mt-2">Endereço copiado!</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Red</label>
                  <p className="font-medium text-gray-800">TON</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Estado</label>
                  <p className="font-medium text-green-600">Conectado</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Billetera no conectada</h3>
            <p className="text-gray-600 mb-4">
              Inicia sesión para ver la información del perfil
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Acciones Rápidas</h2>
          </div>
          <div className="divide-y divide-gray-100">
            <button className="w-full p-6 text-left hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: '#fef3e2'}}>
                  <Settings className="w-5 h-5" style={{color: '#fa9820'}} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Configuraciones</p>
                  <p className="text-sm text-gray-600">Preferencias de la cuenta</p>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400 ml-auto" />
              </div>
            </button>

            <button className="w-full p-6 text-left hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Seguridad</p>
                  <p className="text-sm text-gray-600">Configuraciones de seguridad</p>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400 ml-auto" />
              </div>
            </button>

            <button className="w-full p-6 text-left hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Ayuda</p>
                  <p className="text-sm text-gray-600">Centro de ayuda</p>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400 ml-auto" />
              </div>
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Sobre o App</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Versión</span>
              <span className="font-medium text-gray-800">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Desarrollado por</span>
              <span className="font-medium text-gray-800">Stellar Pay</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Proveedor</span>
              <span className="font-medium text-gray-800">Transfero</span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        {wallet && (
          <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-red-800 mb-2">Cerrar Sesión</h3>
                <p className="text-sm text-red-700 mb-4 leading-relaxed">
                  Haz clic en el botón de abajo para salir de tu cuenta
                </p>
                <button
                  onClick={onLogout}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-2xl text-base transition-colors flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Terms and Privacy */}
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500">
            Al usar esta app, aceptas nuestros{' '}
            <a href="#" className="hover:underline" style={{color: '#fa9820'}}>Términos de Uso</a>
            {' '}y{' '}
            <a href="#" className="hover:underline" style={{color: '#fa9820'}}>Política de Privacidad</a>
          </p>
        </div>
      </div>
    </div>
  );
};