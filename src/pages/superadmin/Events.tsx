import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, MapPin, Ticket, Eye } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getEvents } from '@/services/superadminApi';
import type { Event, EventStatus } from '@/types';

const statusOptions: { value: EventStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    fetchEvents();
  }, [page, search, statusFilter]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await getEvents(
        page,
        pageSize,
        search,
        statusFilter === 'all' ? undefined : statusFilter
      );
      setEvents(response.data);
      setTotalPages(response.totalPages);
      setTotalItems(response.total);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setDetailOpen(true);
  };

  const getTicketPercentage = (sold: number, total: number) => {
    return total > 0 ? Math.round((sold / total) * 100) : 0;
  };

  const columns = [
    {
      key: 'name',
      header: 'Event Name',
      render: (event: Event) => (
        <div>
          <p className="font-medium text-foreground">{event.name}</p>
          <p className="text-xs text-muted-foreground">ID: {event.id}</p>
        </div>
      ),
    },
    {
      key: 'organizerName',
      header: 'Organizer',
      render: (event: Event) => <span className="text-sm">{event.organizerName}</span>,
    },
    {
      key: 'venue',
      header: 'Venue',
      render: (event: Event) => (
        <div className="flex items-center gap-1.5 text-sm">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="max-w-[150px] truncate">{event.venue}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (event: Event) => <StatusBadge status={event.status} />,
    },
    {
      key: 'startDate',
      header: 'Start Date',
      render: (event: Event) => (
        <div className="flex items-center gap-1.5 text-sm">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          {format(new Date(event.startDate), 'dd MMM yyyy')}
        </div>
      ),
    },
    {
      key: 'tickets',
      header: 'Tickets Sold',
      render: (event: Event) => {
        const percentage = getTicketPercentage(event.soldTickets, event.totalTickets);
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-sm">
              <Ticket className="h-3.5 w-3.5 text-muted-foreground" />
              {event.soldTickets.toLocaleString()} / {event.totalTickets.toLocaleString()}
            </div>
            <div className="h-1.5 w-full max-w-[100px] rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (event: Event) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleViewDetails(event)}
          className="gap-1.5"
        >
          <Eye className="h-4 w-4" />
          View
        </Button>
      ),
    },
  ];

  if (loading && events.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        description="View and manage all events across the platform"
      />

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as EventStatus | 'all');
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        data={events}
        columns={columns}
        searchPlaceholder="Search events..."
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        serverSidePagination
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={page}
        onPageChange={setPage}
        isLoading={loading}
      />

      {/* Event Detail Modal */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
            <DialogDescription>
              Complete information about this event
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedEvent.name}</h3>
                <StatusBadge status={selectedEvent.status} />
              </div>

              <div className="grid gap-3 text-sm">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Organizer</span>
                  <span className="font-medium">{selectedEvent.organizerName}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Venue</span>
                  <span className="font-medium text-right max-w-[200px]">
                    {selectedEvent.venue}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Start Date</span>
                  <span className="font-medium">
                    {format(new Date(selectedEvent.startDate), 'dd MMM yyyy, HH:mm')}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">End Date</span>
                  <span className="font-medium">
                    {format(new Date(selectedEvent.endDate), 'dd MMM yyyy, HH:mm')}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Total Tickets</span>
                  <span className="font-medium">
                    {selectedEvent.totalTickets.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Tickets Sold</span>
                  <span className="font-medium">
                    {selectedEvent.soldTickets.toLocaleString()} (
                    {getTicketPercentage(
                      selectedEvent.soldTickets,
                      selectedEvent.totalTickets
                    )}
                    %)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created At</span>
                  <span className="font-medium">
                    {format(new Date(selectedEvent.createdAt), 'dd MMM yyyy')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
