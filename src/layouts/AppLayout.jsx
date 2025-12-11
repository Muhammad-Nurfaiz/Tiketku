import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCog,
  Settings,
  Menu,
  X,
  ChevronRight,
  Ticket,
  Bell,
  Search,
  LogOut,
  ShoppingCart,
  User,
  Image,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { getMenuByRole } from '@/config/roleBasedMenu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const pageNames = {
  '/superadmin/dashboard': 'Dashboard',
  '/superadmin/events': 'Events',
  '/superadmin/event-admins': 'Event Admins',
  '/superadmin/users': 'Users',
  '/superadmin/settings': 'Settings',
};

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // Get menu based on user role
  const menu = user ? getMenuByRole(user.role) : [];
  
  // Determine current page name
  const currentPageName = menu.find(item => location.pathname.startsWith(item.href))?.name || 'Dashboard';

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 lg:relative lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-800">
            <Ticket className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold text-white">Tiket.ku</span>
          </div>

          {/* Navigation */}
          {/* Navigation - role-based single-level menu */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menu.map((item) => {
                const isActive = location.pathname.startsWith(item.href);
                return (
                  <li key={item.name}>
                    <Link to={item.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      )}
                    >
                      <span className="h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-slate-800 p-4">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <div>
                <p className="font-semibold text-slate-100">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-400">{user?.role === 'SUPERADMIN' ? 'Super Admin' : 'Event Admin'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Close button for mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 lg:hidden"
        >
          <X className="h-6 w-6" />
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold">{currentPageName}</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="h-9 w-64"
                  prefix={<Search className="h-4 w-4" />}
                />
              </div>
              <button className="relative">
                <Bell className="h-6 w-6 text-muted-foreground hover:text-foreground" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-destructive"></span>
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button>
                    <Avatar className="h-9 w-9 cursor-pointer">
                      <AvatarFallback className="bg-blue-600 text-white font-bold">
                        {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{user?.name || 'User'}</DropdownMenuLabel>
                    <div className="px-2 py-1 text-xs text-slate-400">
                      {user?.role === 'SUPERADMIN' ? 'Super Admin' : 'Event Admin'}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate(user?.role === 'SUPERADMIN' ? '/superadmin/users' : '/eventadmin/settings')}>Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(user?.role === 'SUPERADMIN' ? '/superadmin/settings' : '/eventadmin/settings')}>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="gap-2"
                      onClick={() => {
                        logout();
                        navigate('/login');
                      }}
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
