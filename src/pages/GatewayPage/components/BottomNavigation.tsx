import React from 'react';
import { Home, ShoppingCart, Wallet, User } from 'lucide-react';

type Screen = 'onboarding' | 'home' | 'buy' | 'tokens' | 'profile';

interface BottomNavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentScreen,
  onNavigate
}) => {
  const navItems = [
    {
      id: 'home' as Screen,
      label: 'Inicio',
      icon: Home,
      active: currentScreen === 'home'
    },
    {
      id: 'buy' as Screen,
      label: 'Comprar',
      icon: ShoppingCart,
      active: currentScreen === 'buy'
    },
    {
      id: 'tokens' as Screen,
      label: 'Tokens',
      icon: Wallet,
      active: currentScreen === 'tokens'
    },
    {
      id: 'profile' as Screen,
      label: 'Perfil',
      icon: User,
      active: currentScreen === 'profile'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb">
      <div className="flex items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors ${
                item.active
                  ? 'text-orange-600 bg-orange-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-6 h-6 ${item.active ? 'text-orange-600' : 'text-gray-600'}`} />
              <span className={`text-xs font-medium ${item.active ? 'text-orange-600' : 'text-gray-600'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};