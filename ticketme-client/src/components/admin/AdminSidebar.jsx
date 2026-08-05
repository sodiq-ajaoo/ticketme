import {
  LayoutDashboard,
  CalendarDays,
  PlusCircle,
  Users,
  UserCog,
  ShoppingBag,
  DollarSign,
  BarChart3,
  Settings,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const menu = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard',
    path: '/admin',
  },
  {
    icon: CalendarDays,
    title: 'Manage Events',
    path: '/admin/events',
  },
  {
    icon: PlusCircle,
    title: 'Create Event',
    path: '/admin/create-event',
  },
  {
    icon: UserCog,
    title: 'Organizers',
    path: '/admin/organizers',
  },
  {
    icon: Users,
    title: 'Users',
    path: '/admin/users',
  },
  {
    icon: ShoppingBag,
    title: 'Orders',
    path: '/admin/orders',
  },
  {
    icon: DollarSign,
    title: 'Revenue',
    path: '/admin/revenue',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    path: '/admin/analytics',
  },

  {
    icon: Settings,
    title: 'Settings',
    path: '/admin/settings',
  },
];

function AdminSidebar() {
  return (
    <aside className="hidden w-72 bg-slate-900 text-white lg:flex lg:flex-col">
      {/* Logo */}
      <div className="border-b border-slate-800 p-8">
        <h1 className="text-3xl font-black">
          <span className="text-blue-500">Ticket</span>Me
        </h1>

        <p className="mt-2 text-sm text-slate-400">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-5">
        {menu.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-xl px-5 py-4 font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon size={22} />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-5">
        <p className="text-center text-xs text-slate-500">
          TicketMe Admin v1.0
        </p>
      </div>
    </aside>
  );
}

export default AdminSidebar;
