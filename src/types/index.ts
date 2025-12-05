// User roles
export type UserRole = 'SUPERADMIN' | 'EVENT_ADMIN' | 'SCAN_STAFF' | 'CUSTOMER';

// User status
export type UserStatus = 'active' | 'inactive';

// Event status
export type EventStatus = 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';

// Base user interface
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

// Event Admin specific interface
export interface EventAdmin extends User {
  role: 'EVENT_ADMIN';
  totalEvents?: number;
}

// Event interface
export interface Event {
  id: string;
  name: string;
  organizerId: string;
  organizerName: string;
  status: EventStatus;
  startDate: string;
  endDate: string;
  venue: string;
  totalTickets: number;
  soldTickets: number;
  createdAt: string;
}

// Dashboard statistics
export interface DashboardStats {
  totalEvents: number;
  totalEventAdmins: number;
  totalOrders: number;
  totalRevenue: number;
  revenueGrowth: number;
  ordersGrowth: number;
}

// API response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Form types
export interface EventAdminFormData {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  status: UserStatus;
}

// Platform settings
export interface PlatformSettings {
  platformName: string;
  primaryColor: string;
  paymentProvider: string;
  currency: string;
  timezone: string;
}
