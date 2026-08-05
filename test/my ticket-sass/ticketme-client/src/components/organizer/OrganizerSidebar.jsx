import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Ticket,
  Users,
  QrCode,
  BarChart3,
} from 'lucide-react';

const menu = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
    path: '/organizer',
  },
  {
    name: 'My Events',
    icon: CalendarDays,
    path: '/organizer/events',
  },
  {
    name: 'Orders',
    icon: Ticket,
    path: '/organizer/orders',
  },
  {
    name: 'Attendees',
    icon: Users,
    path: '/organizer/attendees',
  },
  {
    name: 'Scan Tickets',
    icon: QrCode,
    path: '/organizer/scanner',
  },
  {
    name: 'Reports',
    icon: BarChart3,
    path: '/organizer/reports',
  },
];

function OrganizerSidebar() {
  return (
    <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 lg:flex">
      <h1 className="mb-10 text-3xl font-black text-blue-600">TicketMe</h1>

      <nav className="space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-2xl px-4 py-3 font-semibold transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon size={20} />

              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default OrganizerSidebar;
