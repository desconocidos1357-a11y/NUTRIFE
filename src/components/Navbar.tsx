import React, { useState } from 'react';
import { 
  Home, 
  Clock, 
  BookOpen, 
  Video, 
  Search, 
  Heart, 
  Info, 
  Lock, 
  Menu, 
  X, 
  Sparkles 
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
  adminEmail?: string;
  onLogout: () => void;
}

export default function Navbar({ activeTab, setActiveTab, isAdmin, adminEmail, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'recipes_by_age', label: 'Recetas por Edad', icon: Clock },
    { id: 'recommendations', label: 'Recomendaciones', icon: BookOpen },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'search', label: 'Buscar Recetas', icon: Search },
    { id: 'favorites', label: 'Mis Favoritos', icon: Heart },
    { id: 'about', label: 'Sobre NutriFe', icon: Info },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  return (
    <nav id="nutrife-main-nav" className="bg-white border-b-4 border-[#ffedd5] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <button 
              id="nav-logo-btn"
              onClick={() => handleNavClick('home')} 
              className="flex items-center space-x-2 focus:outline-none group text-left"
            >
              <div className="bg-emerald-500 p-2.5 rounded-2xl shadow-md group-hover:scale-105 transition-transform duration-200 flex items-center justify-center">
                <span className="text-white font-black text-xl tracking-tight flex items-center gap-1">
                  Nutri<span className="text-amber-300">Fe</span>
                </span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xs text-emerald-600 font-bold block leading-none">Prevención de Anemia</span>
                <span className="text-xxs text-gray-400 font-medium">Alimentación de 6m a 5 años</span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-emerald-500 text-white shadow-sm' 
                      : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'scale-110' : ''}`} />
                  {item.label}
                </button>
              );
            })}

            <div className="h-6 w-px bg-gray-200 mx-2"></div>

            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  id="nav-tab-admin-active"
                  onClick={() => handleNavClick('admin')}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  Admin
                </button>
                <button
                  id="nav-logout-btn"
                  onClick={onLogout}
                  className="px-3 py-1.5 border border-red-200 text-red-500 hover:bg-red-50 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button
                id="nav-tab-admin-login"
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-amber-500 text-white'
                    : 'text-amber-600 hover:bg-amber-50'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                Acceso Admin
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            {isAdmin && (
              <span className="mr-2 bg-amber-100 text-amber-800 text-xxs font-black px-2 py-1 rounded-full">
                ADMIN
              </span>
            )}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-emerald-500 hover:bg-gray-100 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div id="mobile-nav-panel" className="lg:hidden bg-white border-t-2 border-emerald-50 px-2 pt-2 pb-4 space-y-1 shadow-lg animate-fadeIn">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-tab-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-base transition-all duration-150 text-left cursor-pointer ${
                  isActive 
                    ? 'bg-emerald-500 text-white' 
                    : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}

          <div className="h-px bg-gray-100 my-2 mx-4"></div>

          {isAdmin ? (
            <div className="px-4 py-2 space-y-2">
              <div className="text-xs text-gray-500 truncate font-semibold">
                Sesión: {adminEmail}
              </div>
              <div className="flex gap-2">
                <button
                  id="mobile-nav-admin"
                  onClick={() => handleNavClick('admin')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm ${
                    activeTab === 'admin'
                      ? 'bg-amber-500 text-white'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Panel Admin
                </button>
                <button
                  id="mobile-logout-btn"
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="px-4 py-2.5 bg-red-50 text-red-600 font-bold text-sm rounded-xl hover:bg-red-100"
                >
                  Salir
                </button>
              </div>
            </div>
          ) : (
            <div className="px-2">
              <button
                id="mobile-nav-admin-login"
                onClick={() => handleNavClick('admin')}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-base transition-all duration-150 ${
                  activeTab === 'admin'
                    ? 'bg-amber-500 text-white'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
              >
                <Lock className="w-4 h-4" />
                Acceso Administrador
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
