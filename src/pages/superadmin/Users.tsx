import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getUsers } from '@/services/superadminApi';
import type { User, UserRole } from '@/types';
import { format } from 'date-fns';

const roleLabels: Record<UserRole, string> = {
  SUPERADMIN: 'Superadmin',
  EVENT_ADMIN: 'Event Admin',
  SCAN_STAFF: 'Scan Staff',
  CUSTOMER: 'Customer',
};

const roleColors: Record<UserRole, string> = {
  SUPERADMIN: 'bg-primary/10 text-primary',
  EVENT_ADMIN: 'bg-stat-admins/10 text-stat-admins',
  SCAN_STAFF: 'bg-stat-orders/10 text-stat-orders',
  CUSTOMER: 'bg-stat-events/10 text-stat-events',
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');

  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getUsers(
        currentPage,
        10,
        roleFilter === 'all' ? undefined : roleFilter
      );
      setUsers(response.data);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, roleFilter, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value as UserRole | 'all');
    setCurrentPage(1);
  };

  const columns = [
    {
      key: 'fullName',
      header: 'Name',
      render: (user: User) => (
        <div>
          <div className="font-medium">{user.fullName}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (user: User) => user.phone || '-',
    },
    {
      key: 'role',
      header: 'Role',
      render: (user: User) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleColors[user.role]}`}
        >
          {roleLabels[user.role]}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (user: User) => <StatusBadge status={user.status} />,
    },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (user: User) => format(new Date(user.createdAt), 'MMM d, yyyy'),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Users"
        description="View all users registered on the platform"
      />

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter by role:</span>
          <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="SUPERADMIN">Superadmin</SelectItem>
              <SelectItem value="EVENT_ADMIN">Event Admin</SelectItem>
              <SelectItem value="SCAN_STAFF">Scan Staff</SelectItem>
              <SelectItem value="CUSTOMER">Customer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        data={users}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Search users..."
        serverSidePagination
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalItems={totalItems}
        totalPages={totalPages}
        emptyMessage="No users found"
      />
    </div>
  );
}
