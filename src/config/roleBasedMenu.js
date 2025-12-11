// Role-based menu configuration

export const superadminMenu = [
  { name: 'Dashboard', href: '/superadmin/dashboard', icon: 'LayoutDashboard' },
  { name: 'Event Admins', href: '/superadmin/event-admins', icon: 'UserCog' },
  { name: 'Users', href: '/superadmin/users', icon: 'Users' },
  { name: 'Banner', href: '/superadmin/banner', icon: 'Image' },
  { name: 'Settings', href: '/superadmin/settings', icon: 'Settings' },
];

export const eventAdminMenu = [
  { name: 'Dashboard', href: '/eventadmin/dashboard', icon: 'LayoutDashboard' },
  { name: 'Events', href: '/eventadmin/events', icon: 'Ticket' },
  { name: 'Orders', href: '/eventadmin/orders', icon: 'ShoppingCart' },
  { name: 'Tickets', href: '/eventadmin/tickets', icon: 'Ticket' },
  { name: 'Scan Staff', href: '/eventadmin/scan-staff', icon: 'Users' },
  { name: 'Settings', href: '/eventadmin/settings', icon: 'Settings' },
];

export function getMenuByRole(role) {
  if (role === 'SUPERADMIN') return superadminMenu;
  if (role === 'EVENT_ADMIN') return eventAdminMenu;
  return [];
}
