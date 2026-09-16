import React from 'react';
import { 
  X, 
  LayoutDashboard, 
  LayoutGrid, 
  UtensilsCrossed, 
  Store, 
  LogOut,
  ExternalLink
} from 'lucide-react';
import { CrownIcon } from '../common/MenuIcons';
import { AdminTab } from './AdminSidebar';

interface AdminMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onLogout: () => void;
  onViewCustomerMenu: () => void;
}

export function AdminMobileDrawer({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  onLogout,
  onViewCustomerMenu,
}: AdminMobileDrawerProps) {
  if (!isOpen) return null;

  const navItems = [
    {
      id: 'dashboard' as AdminTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'categories' as AdminTab,
      label: 'Menu Categories',
      icon: LayoutGrid,
    },
    {
      id: 'food-items' as AdminTab,
      label: 'Food Items',
      icon: UtensilsCrossed,
    },
    {
      id: 'profile' as AdminTab,
      label: 'Business Profile',
      icon: Store,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="relative w-72 max-w-[85vw] bg-[#111115] text-white flex flex-col justify-between h-full z-10 shadow-2xl animate-in slide-in-from-left duration-200">
        
        {/* Header */}
        <div>
          <div className="p-5 border-b border-[#1F1F26] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-10 flex items-center">
                <img
                  src="/kings_platter_logo.jpg"
                  alt="King's Platter"
                  className="h-9 w-auto max-h-9 object-contain rounded-lg drop-shadow-sm"
                />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#1C1C26] text-[#F5B800] border border-[#2D2D3A]">
                Admin
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#F5B800] text-black shadow-md shadow-[#F5B800]/15'
                      : 'text-[#9CA3AF] hover:text-white hover:bg-[#1A1A22]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-black' : 'text-[#9CA3AF]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#1F1F26] space-y-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onViewCustomerMenu();
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium text-[#A0A0B0] hover:text-[#F5B800] hover:bg-[#1A1A22] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              <span>Customer Menu</span>
            </span>
            <span className="text-[10px] bg-[#22222D] px-1.5 py-0.5 rounded text-gray-300">Live</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-[#9CA3AF] hover:text-red-400 hover:bg-[#1C1717] transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

      </div>
    </div>
  );
}
