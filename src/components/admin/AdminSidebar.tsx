import React from 'react';
import { 
  LayoutDashboard, 
  LayoutGrid, 
  UtensilsCrossed, 
  Store, 
  LogOut,
  ExternalLink
} from 'lucide-react';
import { CrownIcon } from '../common/MenuIcons';
import { resolveLogoUrl } from '../../utils/imageResolver';

export type AdminTab = 'dashboard' | 'categories' | 'food-items' | 'profile';

interface AdminSidebarProps {
  activeTab: AdminTab;
  logoUrl?: string;
  onSelectTab: (tab: AdminTab) => void;
  onLogout: () => void;
  onViewCustomerMenu: () => void;
}

export function AdminSidebar({
  activeTab,
  logoUrl,
  onSelectTab,
  onLogout,
  onViewCustomerMenu,
}: AdminSidebarProps) {
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
    <aside className="w-64 bg-[#111115] text-white flex flex-col justify-between h-screen sticky top-0 border-r border-[#1F1F26] shrink-0 z-30 select-none">
      {/* Top Branding */}
      <div>
        <div className="p-5 border-b border-[#1C1C22]">
          <div className="flex items-center justify-between">
            <div className="h-11 flex items-center">
              <img
                src={resolveLogoUrl(logoUrl)}
                alt="King's Platter"
                className="h-10 w-auto max-h-10 object-contain rounded-lg drop-shadow-sm"
              />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#1C1C26] text-[#F5B800] border border-[#2D2D3A]">
              Admin
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5" aria-label="Admin Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
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
      <div className="p-4 border-t border-[#1C1C22] space-y-2">
        {/* Switch to Customer Menu */}
        <button
          type="button"
          onClick={onViewCustomerMenu}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium text-[#A0A0B0] hover:text-[#F5B800] hover:bg-[#1A1A22] transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            <span>Customer Menu</span>
          </span>
          <span className="text-[10px] bg-[#22222D] px-1.5 py-0.5 rounded text-gray-300">Live</span>
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-[#9CA3AF] hover:text-red-400 hover:bg-[#1C1717] transition-all cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
