import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, Menu, ExternalLink, LogOut, Shield } from 'lucide-react';
import { CrownIcon } from '../common/MenuIcons';
import { AdminUser } from '../../services/adminAuth';

interface AdminHeaderProps {
  user: AdminUser | null;
  onOpenMobileDrawer: () => void;
  onViewCustomerMenu: () => void;
  onLogout: () => void;
}

export function AdminHeader({
  user,
  onOpenMobileDrawer,
  onViewCustomerMenu,
  onLogout,
}: AdminHeaderProps) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20 h-16 sm:h-18 px-4 sm:px-8 flex items-center justify-between shadow-xs">
      {/* Mobile Left Menu Trigger */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          type="button"
          onClick={onOpenMobileDrawer}
          className="p-2 -ml-2 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Mobile Center Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#E5A93C]/40 bg-[#0B1E15] shadow-xs shrink-0 p-0.5 flex items-center justify-center">
            <img
              src="/kings_platter_logo.jpg"
              alt="King's Platter"
              className="w-full h-full object-contain rounded-md"
            />
          </div>
          <span className="font-royal font-bold text-sm tracking-wide text-gray-900">
            Digital Menu
          </span>
        </div>
      </div>

      {/* Desktop Left: Breadcrumb / Status */}
      <div className="hidden md:flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Admin Portal
        </span>
        <span className="text-gray-300">•</span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          System Operational
        </span>
      </div>

      {/* Right Side: Notification Bell & Admin Profile */}
      <div className="flex items-center gap-3 sm:gap-4" ref={dropdownRef}>
        
        {/* Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center gap-2.5 p-1 sm:px-2 sm:py-1.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            aria-expanded={isProfileDropdownOpen}
          >
            {/* Burgundy circle with 'A' as in reference screenshot */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#831828] text-white font-bold text-sm sm:text-base flex items-center justify-center shadow-xs">
              {user?.name?.charAt(0) || 'A'}
            </div>
            
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-gray-900 leading-tight">
                {user?.name || 'Admin'}
              </span>
              <span className="text-[10px] text-gray-500 font-medium">
                {user?.role || 'Super Admin'}
              </span>
            </div>

            <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-900">{user?.name || 'Admin'}</p>
                <p className="text-[11px] text-gray-500 truncate">{user?.email || 'admin@kingsplatter.com'}</p>
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  <Shield className="w-2.5 h-2.5" />
                  {user?.role || 'Super Admin'}
                </span>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    onViewCustomerMenu();
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-[#C88A00]" />
                  <span>View Customer Menu</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
