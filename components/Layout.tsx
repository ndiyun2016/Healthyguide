import React, { ReactNode } from 'react';
import { Menu, X, Home, Settings, FileText, User, LayoutDashboard, ChevronLeft } from 'lucide-react';
import { AppSettings, ViewState } from '../types';

interface LayoutProps {
  children: ReactNode;
  settings: AppSettings;
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, settings, currentView, setView }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Dynamic style for primary color
  const navStyle = {
    color: settings.primaryColor,
  };
  const btnStyle = {
    backgroundColor: settings.primaryColor,
  };

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState; icon: any; label: string }) => (
    <button
      onClick={() => {
        setView(view);
        setIsMenuOpen(false);
      }}
      className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
        currentView === view 
          ? 'bg-gray-100 font-semibold text-gray-900' 
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <Icon size={20} style={currentView === view ? { color: settings.primaryColor } : {}} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className={`min-h-screen ${settings.darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setView('welcome')}>
               <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-2 text-white font-bold" style={btnStyle}>
                 H
               </div>
               <span className="font-bold text-xl tracking-tight font-[Poppins]">{settings.appName}</span>
            </div>
            
            <div className="hidden md:flex space-x-8">
               <button onClick={() => setView('welcome')} className={`text-sm font-medium hover:text-gray-900 ${currentView === 'welcome' ? 'text-gray-900' : 'text-gray-500'}`}>Home</button>
               <button onClick={() => setView('articles')} className={`text-sm font-medium hover:text-gray-900 ${currentView === 'articles' ? 'text-gray-900' : 'text-gray-500'}`}>Tips Library</button>
               <button onClick={() => setView('admin')} className={`text-sm font-medium hover:text-gray-900 ${currentView === 'admin' ? 'text-gray-900' : 'text-gray-500'}`}>Admin</button>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md hover:bg-gray-100 text-gray-600">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 flex">
           <div className="fixed inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)}></div>
           <div className="relative bg-white w-64 max-w-xs h-full shadow-xl flex flex-col p-4 animate-in slide-in-from-left duration-200 dark:bg-gray-800">
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-xl">{settings.appName}</span>
                <button onClick={() => setIsMenuOpen(false)}><X size={24} /></button>
              </div>
              <div className="space-y-2 flex-1">
                <NavItem view="welcome" icon={Home} label="Home" />
                <NavItem view="articles" icon={FileText} label="Health Library" />
                <NavItem view="history" icon={User} label="My History" />
                <NavItem view="settings" icon={Settings} label="Settings" />
                <div className="border-t border-gray-100 my-2 pt-2">
                   <NavItem view="admin" icon={LayoutDashboard} label="Admin Dashboard" />
                </div>
              </div>
           </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-[calc(100vh-80px)] fade-in">
        {children}
      </main>

    </div>
  );
};
