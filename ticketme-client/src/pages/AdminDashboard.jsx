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

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

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

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-3xl bg-white p-6 shadow dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500">{card.title}</p>

                <h2 className="mt-2 text-3xl font-black dark:text-white">
                  {card.value}
                </h2>
              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.color}`}
              >
                <card.icon className="text-white" size={28} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-3xl bg-white p-8 shadow dark:bg-slate-900">
        <h2 className="mb-6 text-2xl font-bold dark:text-white">
          Quick Actions
        </h2>

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
