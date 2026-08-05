import { useEffect, useState } from 'react';
import {
  Users,
  CalendarDays,
  Ticket,
  DollarSign,
  Clock3,
  CheckCircle2,
} from 'lucide-react';

import { Link } from 'react-router-dom';

import AdminLayout from '../components/admin/AdminLayout';
import Spinner from '../components/ui/Spinner';
import api from '../services/api';
import SummaryCards from '../components/dashboardMainAdmin/SummaryCards';
import RevenueChart from '../components/dashboardMainAdmin/RevenueChart';
import TicketStatusChart from '../components/dashboardMainAdmin/TicketStatusChart';
import TopSellingEvents from '../components/dashboardMainAdmin/TopSellingEvents';
import RecentEvents from '../components/dashboardMainAdmin/RecentEvents';
import LatestUsers from '../components/dashboardMainAdmin/LatestUsers';

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  // const [stats, setStats] = useState({});
  const [stats, setStats] = useState({
    recentEvents: [],
    latestUsers: [],
    topSellingEvents: [],
    monthlyRevenue: [],
    ticketStatus: [],
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      const res = await api.get('/dashboard/admin');

      setStats(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const cards = [
    {
      title: 'Total Users',
      value: stats.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-600',
    },
    {
      title: 'Total Events',
      value: stats.totalEvents || 0,
      icon: CalendarDays,
      color: 'bg-purple-600',
    },
    {
      title: 'Tickets Sold',
      value: stats.ticketsSold || 0,
      icon: Ticket,
      color: 'bg-green-600',
    },
    {
      title: 'Revenue',
      value: `₦${Number(stats.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-orange-600',
    },
    {
      title: 'Upcoming Events',
      value: stats.upcomingEvents || 0,
      icon: Clock3,
      color: 'bg-pink-600',
    },
    {
      title: 'Checked In',
      value: stats.checkedIn || 0,
      icon: CheckCircle2,
      color: 'bg-emerald-600',
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <Spinner text="Loading dashboard..." />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="mb-8 text-4xl font-black dark:text-white">
        Admin Dashboard
      </h1>

      {/* Summary Cards */}
      <SummaryCards stats={stats} />

      {/* Revenue + Ticket Status */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-8 shadow">
          <RevenueChart data={stats.monthlyRevenue} />
        </div>

        <div className="rounded-3xl bg-white p-8 shadow">
          <TicketStatusChart data={stats.ticketStatus} />
        </div>
      </div>

      {/* Top Selling Events + Recent Events */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-8 shadow">
          <TopSellingEvents events={stats.topSellingEvents} />
        </div>

        <div className="rounded-3xl bg-white p-8 shadow">
          <RecentEvents events={stats.recentEvents} />
        </div>
      </div>

      {/* Latest Users */}
      <div className="mt-10 rounded-3xl bg-white p-8 shadow">
        <LatestUsers users={stats.latestUsers} />
      </div>

      {/* Quick Actions */}
      <div className="mt-10 rounded-3xl bg-white p-8 shadow">
        <h2 className="mb-6 text-2xl font-bold">Quick Actions</h2>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <Link
            to="/admin/create-event"
            className="rounded-2xl bg-blue-600 py-4 text-center font-bold text-white hover:bg-blue-700"
          >
            Create Event
          </Link>

          <Link
            to="/admin/events"
            className="rounded-2xl bg-purple-600 py-4 text-center font-bold text-white hover:bg-purple-700"
          >
            Manage Events
          </Link>

          <Link
            to="/admin/users"
            className="rounded-2xl bg-green-600 py-4 text-center font-bold text-white hover:bg-green-700"
          >
            Manage Users
          </Link>

          <Link
            to="/organizer/scanner"
            className="rounded-2xl bg-orange-600 py-4 text-center font-bold text-white hover:bg-orange-700"
          >
            Ticket Scanner
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
