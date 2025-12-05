import type {
  EventAdmin,
  User,
  Event,
  DashboardStats,
  PaginatedResponse,
  EventAdminFormData,
  PlatformSettings,
  UserRole,
} from '@/types';

// Simulated delay for realistic API behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockEventAdmins: EventAdmin[] = [
  {
    id: '1',
    fullName: 'Budi Santoso',
    email: 'budi@eventpro.id',
    phone: '+62812345678',
    role: 'EVENT_ADMIN',
    status: 'active',
    totalEvents: 12,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-11-20T10:30:00Z',
  },
  {
    id: '2',
    fullName: 'Siti Rahayu',
    email: 'siti@musicfest.co',
    phone: '+62823456789',
    role: 'EVENT_ADMIN',
    status: 'active',
    totalEvents: 8,
    createdAt: '2024-02-20T09:00:00Z',
    updatedAt: '2024-11-18T14:20:00Z',
  },
  {
    id: '3',
    fullName: 'Ahmad Wijaya',
    email: 'ahmad@concertindo.com',
    phone: '+62834567890',
    role: 'EVENT_ADMIN',
    status: 'inactive',
    totalEvents: 5,
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-10-15T09:00:00Z',
  },
  {
    id: '4',
    fullName: 'Dewi Lestari',
    email: 'dewi@liveshow.id',
    phone: '+62845678901',
    role: 'EVENT_ADMIN',
    status: 'active',
    totalEvents: 15,
    createdAt: '2024-04-05T11:00:00Z',
    updatedAt: '2024-11-22T16:45:00Z',
  },
  {
    id: '5',
    fullName: 'Rudi Hartono',
    email: 'rudi@stagecraft.id',
    phone: '+62856789012',
    role: 'EVENT_ADMIN',
    status: 'active',
    totalEvents: 3,
    createdAt: '2024-05-12T08:30:00Z',
    updatedAt: '2024-11-10T11:15:00Z',
  },
];

const mockUsers: User[] = [
  ...mockEventAdmins,
  {
    id: '100',
    fullName: 'Super Admin',
    email: 'superadmin@tiketku.id',
    role: 'SUPERADMIN',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z',
  },
  {
    id: '101',
    fullName: 'Scan Staff 1',
    email: 'scan1@tiketku.id',
    phone: '+62811111111',
    role: 'SCAN_STAFF',
    status: 'active',
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z',
  },
  {
    id: '102',
    fullName: 'Customer Andi',
    email: 'andi@gmail.com',
    phone: '+62822222222',
    role: 'CUSTOMER',
    status: 'active',
    createdAt: '2024-07-15T00:00:00Z',
    updatedAt: '2024-11-20T00:00:00Z',
  },
  {
    id: '103',
    fullName: 'Customer Bella',
    email: 'bella@yahoo.com',
    phone: '+62833333333',
    role: 'CUSTOMER',
    status: 'active',
    createdAt: '2024-08-20T00:00:00Z',
    updatedAt: '2024-11-19T00:00:00Z',
  },
  {
    id: '104',
    fullName: 'Scan Staff 2',
    email: 'scan2@tiketku.id',
    phone: '+62844444444',
    role: 'SCAN_STAFF',
    status: 'inactive',
    createdAt: '2024-09-01T00:00:00Z',
    updatedAt: '2024-10-15T00:00:00Z',
  },
];

const mockEvents: Event[] = [
  {
    id: 'e1',
    name: 'Java Jazz Festival 2025',
    organizerId: '1',
    organizerName: 'Budi Santoso',
    status: 'published',
    startDate: '2025-03-01T18:00:00Z',
    endDate: '2025-03-03T23:00:00Z',
    venue: 'JIExpo Kemayoran, Jakarta',
    totalTickets: 50000,
    soldTickets: 35420,
    createdAt: '2024-10-01T00:00:00Z',
  },
  {
    id: 'e2',
    name: 'Synchronize Fest',
    organizerId: '2',
    organizerName: 'Siti Rahayu',
    status: 'ongoing',
    startDate: '2024-12-06T14:00:00Z',
    endDate: '2024-12-08T23:00:00Z',
    venue: 'Gambir Expo, Jakarta',
    totalTickets: 30000,
    soldTickets: 28500,
    createdAt: '2024-08-15T00:00:00Z',
  },
  {
    id: 'e3',
    name: 'Dewa 19 Reunion Tour',
    organizerId: '4',
    organizerName: 'Dewi Lestari',
    status: 'published',
    startDate: '2025-01-20T19:00:00Z',
    endDate: '2025-01-20T23:00:00Z',
    venue: 'Istora Senayan, Jakarta',
    totalTickets: 8000,
    soldTickets: 7200,
    createdAt: '2024-09-20T00:00:00Z',
  },
  {
    id: 'e4',
    name: 'Indie Music Showcase',
    organizerId: '5',
    organizerName: 'Rudi Hartono',
    status: 'draft',
    startDate: '2025-02-14T18:00:00Z',
    endDate: '2025-02-14T22:00:00Z',
    venue: 'Rossi Musik, Jakarta',
    totalTickets: 500,
    soldTickets: 0,
    createdAt: '2024-11-01T00:00:00Z',
  },
  {
    id: 'e5',
    name: 'Rock in Solo',
    organizerId: '3',
    organizerName: 'Ahmad Wijaya',
    status: 'completed',
    startDate: '2024-10-15T17:00:00Z',
    endDate: '2024-10-15T23:00:00Z',
    venue: 'Stadion Manahan, Solo',
    totalTickets: 15000,
    soldTickets: 14200,
    createdAt: '2024-07-01T00:00:00Z',
  },
];

const mockSettings: PlatformSettings = {
  platformName: 'TiketKu',
  primaryColor: '#4F46E5',
  paymentProvider: 'QRIS',
  currency: 'IDR',
  timezone: 'Asia/Jakarta',
};

// API Functions

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(500);
  return {
    totalEvents: mockEvents.length,
    totalEventAdmins: mockEventAdmins.length,
    totalOrders: 85120,
    totalRevenue: 12500000000,
    revenueGrowth: 12.5,
    ordersGrowth: 8.3,
  };
}

export async function getLatestEvents(limit: number = 5): Promise<Event[]> {
  await delay(300);
  return mockEvents.slice(0, limit);
}

export async function getEventAdmins(
  page: number = 1,
  pageSize: number = 10,
  search: string = ''
): Promise<PaginatedResponse<EventAdmin>> {
  await delay(400);
  
  let filtered = mockEventAdmins;
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = mockEventAdmins.filter(
      admin =>
        admin.fullName.toLowerCase().includes(searchLower) ||
        admin.email.toLowerCase().includes(searchLower)
    );
  }
  
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);
  
  return {
    data,
    total,
    page,
    pageSize,
    totalPages,
  };
}

export async function getEventAdminById(id: string): Promise<EventAdmin | null> {
  await delay(200);
  return mockEventAdmins.find(admin => admin.id === id) || null;
}

export async function createEventAdmin(data: EventAdminFormData): Promise<EventAdmin> {
  await delay(600);
  const newAdmin: EventAdmin = {
    id: String(Date.now()),
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    role: 'EVENT_ADMIN',
    status: data.status,
    totalEvents: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockEventAdmins.push(newAdmin);
  return newAdmin;
}

export async function updateEventAdmin(
  id: string,
  data: Partial<EventAdminFormData>
): Promise<EventAdmin> {
  await delay(500);
  const index = mockEventAdmins.findIndex(admin => admin.id === id);
  if (index === -1) throw new Error('Event Admin not found');
  
  mockEventAdmins[index] = {
    ...mockEventAdmins[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return mockEventAdmins[index];
}

export async function toggleEventAdminStatus(id: string): Promise<EventAdmin> {
  await delay(400);
  const index = mockEventAdmins.findIndex(admin => admin.id === id);
  if (index === -1) throw new Error('Event Admin not found');
  
  mockEventAdmins[index].status =
    mockEventAdmins[index].status === 'active' ? 'inactive' : 'active';
  mockEventAdmins[index].updatedAt = new Date().toISOString();
  
  return mockEventAdmins[index];
}

export async function getUsers(
  page: number = 1,
  pageSize: number = 10,
  roleFilter?: UserRole
): Promise<PaginatedResponse<User>> {
  await delay(400);
  
  let filtered = mockUsers;
  if (roleFilter) {
    filtered = mockUsers.filter(user => user.role === roleFilter);
  }
  
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);
  
  return {
    data,
    total,
    page,
    pageSize,
    totalPages,
  };
}

export async function getPlatformSettings(): Promise<PlatformSettings> {
  await delay(300);
  return mockSettings;
}

export async function updatePlatformSettings(
  data: Partial<PlatformSettings>
): Promise<PlatformSettings> {
  await delay(500);
  Object.assign(mockSettings, data);
  return mockSettings;
}
