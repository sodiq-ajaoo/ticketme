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

const menu = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard',
  },
  {
    icon: CalendarDays,
    title: 'Events',
  },
  {
    icon: PlusCircle,
    title: 'Create Event',
  },
  {
    icon: UserCog,
    title: 'Organizers',
  },
  {
    icon: Users,
    title: 'Users',
  },
  {
    icon: ShoppingBag,
    title: 'Orders',
  },
  {
    icon: DollarSign,
    title: 'Revenue',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
  },
  {
    icon: Settings,
    title: 'Settings',
  },
];

function AdminSidebar() {
  return (
    <aside className="hidden w-72 bg-slate-900 text-white lg:block">
      <div className="border-b border-slate-800 p-8">
        <h1 className="text-3xl font-black">
          <span className="text-blue-500">Ticket</span>
          Me
        </h1>

        <p className="mt-2 text-slate-400">Admin Panel</p>
      </div>

      <div className="space-y-2 p-5">
        {menu.map((item) => (
          <button
            key={item.title}
            className="flex w-full items-center gap-4 rounded-xl px-5 py-4 transition hover:bg-slate-800"
          >
            <item.icon size={22} />

            {item.title}
          </button>
        ))}
      </div>
    </aside>
  );
}

export default AdminSidebar;
