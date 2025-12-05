import { useState, useEffect } from 'react';
import { Calendar, Users, ShoppingCart, DollarSign, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/superadmin/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { getDashboardStats, getLatestEvents } from '@/services/superadminApi';
import type { DashboardStats, Event } from '@/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `Rp ${(value / 1_000).toFixed(1)}K`;
  }
  return `Rp ${value}`;
}

function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return String(value);
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, eventsData] = await Promise.all([
          getDashboardStats(),
          getLatestEvents(5),
        ]);
        setStats(statsData);
        setEvents(eventsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Overview of your e-ticketing platform"
      />

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Events"
          value={stats?.totalEvents ?? 0}
          icon={<Calendar className="h-6 w-6" />}
          variant="events"
        />
        <StatCard
          title="Event Admins"
          value={stats?.totalEventAdmins ?? 0}
          icon={<Users className="h-6 w-6" />}
          variant="admins"
        />
        <StatCard
          title="Total Orders"
          value={formatNumber(stats?.totalOrders ?? 0)}
          icon={<ShoppingCart className="h-6 w-6" />}
          variant="orders"
          growth={stats?.ordersGrowth}
          growthLabel="vs last month"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue ?? 0)}
          icon={<DollarSign className="h-6 w-6" />}
          variant="revenue"
          growth={stats?.revenueGrowth}
          growthLabel="vs last month"
        />
      </div>

      {/* Latest Events */}
      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">Latest Events</h2>
            <p className="text-sm text-muted-foreground">
              Recent events across the platform
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/superadmin/event-admins">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Organizer</th>
                <th>Status</th>
                <th>Start Date</th>
                <th className="text-right">Tickets Sold</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id}>
                  <td>
                    <div className="font-medium">{event.name}</div>
                    <div className="text-sm text-muted-foreground">{event.venue}</div>
                  </td>
                  <td>{event.organizerName}</td>
                  <td>
                    <StatusBadge status={event.status} />
                  </td>
                  <td>{format(new Date(event.startDate), 'MMM d, yyyy')}</td>
                  <td className="text-right">
                    <span className="font-medium">
                      {event.soldTickets.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">
                      {' '}
                      / {event.totalTickets.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
