import { useState, useEffect, useCallback } from 'react';
import { Plus, MoreHorizontal, Pencil, UserX, UserCheck } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EventAdminModal } from '@/components/superadmin/EventAdminModal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  getEventAdmins,
  createEventAdmin,
  updateEventAdmin,
  toggleEventAdminStatus,
} from '@/services/superadminApi';
import type { EventAdmin, EventAdminFormData } from '@/types';
import { format } from 'date-fns';

export default function EventAdmins() {
  const [eventAdmins, setEventAdmins] = useState<EventAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<EventAdmin | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [adminToToggle, setAdminToToggle] = useState<EventAdmin | null>(null);

  const { toast } = useToast();

  const fetchEventAdmins = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getEventAdmins(currentPage, 10, searchQuery);
      setEventAdmins(response.data);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to fetch event admins:', error);
      toast({
        title: 'Error',
        description: 'Failed to load event admins',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, toast]);

  useEffect(() => {
    fetchEventAdmins();
  }, [fetchEventAdmins]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleOpenModal = (admin?: EventAdmin) => {
    setSelectedAdmin(admin ?? null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAdmin(null);
  };

  const handleSubmit = async (data: EventAdminFormData) => {
    setIsSubmitting(true);
    try {
      if (selectedAdmin) {
        await updateEventAdmin(selectedAdmin.id, data);
        toast({
          title: 'Success',
          description: 'Event admin updated successfully',
        });
      } else {
        await createEventAdmin(data);
        toast({
          title: 'Success',
          description: 'Event admin created successfully',
        });
      }
      handleCloseModal();
      fetchEventAdmins();
    } catch (error) {
      console.error('Failed to save event admin:', error);
      toast({
        title: 'Error',
        description: 'Failed to save event admin',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!adminToToggle) return;
    
    try {
      await toggleEventAdminStatus(adminToToggle.id);
      toast({
        title: 'Success',
        description: `Event admin ${adminToToggle.status === 'active' ? 'deactivated' : 'activated'} successfully`,
      });
      fetchEventAdmins();
    } catch (error) {
      console.error('Failed to toggle status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    } finally {
      setStatusDialogOpen(false);
      setAdminToToggle(null);
    }
  };

  const columns = [
    {
      key: 'fullName',
      header: 'Name',
      render: (admin: EventAdmin) => (
        <div>
          <div className="font-medium">{admin.fullName}</div>
          <div className="text-sm text-muted-foreground">{admin.email}</div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (admin: EventAdmin) => admin.phone || '-',
    },
    {
      key: 'totalEvents',
      header: 'Events',
      render: (admin: EventAdmin) => (
        <span className="inline-flex items-center justify-center rounded-full bg-secondary px-2.5 py-0.5 text-sm font-medium">
          {admin.totalEvents ?? 0}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (admin: EventAdmin) => <StatusBadge status={admin.status} />,
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (admin: EventAdmin) => format(new Date(admin.createdAt), 'MMM d, yyyy'),
    },
    {
      key: 'actions',
      header: '',
      render: (admin: EventAdmin) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleOpenModal(admin)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setAdminToToggle(admin);
                setStatusDialogOpen(true);
              }}
            >
              {admin.status === 'active' ? (
                <>
                  <UserX className="mr-2 h-4 w-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Activate
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Event Admins"
        description="Manage event administrators on your platform"
        action={
          <Button onClick={() => handleOpenModal()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Event Admin
          </Button>
        }
      />

      <DataTable
        data={eventAdmins}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Search by name or email..."
        onSearch={handleSearch}
        serverSidePagination
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalItems={totalItems}
        totalPages={totalPages}
        emptyMessage="No event admins found"
      />

      <EventAdminModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        eventAdmin={selectedAdmin}
        isLoading={isSubmitting}
      />

      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {adminToToggle?.status === 'active' ? 'Deactivate' : 'Activate'} Event Admin
            </AlertDialogTitle>
            <AlertDialogDescription>
              {adminToToggle?.status === 'active'
                ? `Are you sure you want to deactivate ${adminToToggle?.fullName}? They will no longer be able to access the platform.`
                : `Are you sure you want to activate ${adminToToggle?.fullName}? They will regain access to the platform.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleStatus}>
              {adminToToggle?.status === 'active' ? 'Deactivate' : 'Activate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
