// import { NavLink, Outlet } from 'react-router-dom';

// function Dashboard() {
//   return (
//     <section className="min-h-screen bg-slate-100 py-10 dark:bg-slate-950">
//       <div className="mx-auto flex max-w-7xl gap-8 px-6">
//         {/* Sidebar */}
//         <aside className="w-72 rounded-3xl bg-white p-6 shadow dark:bg-slate-900">
//           <h2 className="mb-8 text-2xl font-black dark:text-white">
//             Dashboard
//           </h2>

//           <nav className="space-y-3">
//             <NavLink
//               to="profile"
//               className={({ isActive }) =>
//                 `block rounded-xl px-4 py-3 font-semibold ${
//                   isActive
//                     ? 'bg-blue-600 text-white'
//                     : 'hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800'
//                 }`
//               }
//             >
//               Profile
//             </NavLink>

//             <NavLink
//               to="security"
//               className={({ isActive }) =>
//                 `block rounded-xl px-4 py-3 font-semibold ${
//                   isActive
//                     ? 'bg-blue-600 text-white'
//                     : 'hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800'
//                 }`
//               }
//             >
//               Security
//             </NavLink>

//             <NavLink
//               to="tickets"
//               className={({ isActive }) =>
//                 `block rounded-xl px-4 py-3 font-semibold ${
//                   isActive
//                     ? 'bg-blue-600 text-white'
//                     : 'hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800'
//                 }`
//               }
//             >
//               My Tickets
//             </NavLink>

//             <NavLink
//               to="delete"
//               className={({ isActive }) =>
//                 `block rounded-xl px-4 py-3 font-semibold ${
//                   isActive
//                     ? 'bg-red-600 text-white'
//                     : 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
//                 }`
//               }
//             >
//               Delete Account
//             </NavLink>
//           </nav>
//         </aside>

//         {/* Content */}
//         <main className="flex-1 rounded-3xl bg-white p-8 shadow dark:bg-slate-900">
//           <Outlet />
//         </main>
//       </div>
//     </section>
//   );
// }

// export default Dashboard;

import { Link } from 'react-router-dom';
import { User, Lock, Ticket, Trash2, ChevronRight } from 'lucide-react';

function UserDashboard() {
  const cards = [
    {
      title: 'Profile',
      description: 'Update your name and phone number',
      icon: User,
      link: '/dashboard/profile',
    },
    {
      title: 'Change Password',
      description: 'Update your account password',
      icon: Lock,
      link: '/dashboard/password',
    },
    {
      title: 'My Tickets',
      description: 'View all purchased tickets',
      icon: Ticket,
      link: '/my-tickets',
    },
    {
      title: 'Delete Account',
      description: 'Deactivate your account',
      icon: Trash2,
      link: '/dashboard/delete-account',
      danger: true,
    },
  ];

  return (
    <section className="min-h-screen bg-slate-100 py-16 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="mb-2 text-4xl font-black dark:text-white">
          My Dashboard
        </h1>

        <p className="mb-10 text-slate-500 dark:text-slate-400">
          Manage your TicketMe account.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                to={card.link}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <Icon
                    className={card.danger ? 'text-red-500' : 'text-blue-600'}
                    size={34}
                  />

                  <ChevronRight className="text-slate-400" />
                </div>

                <h2
                  className={`mt-6 text-2xl font-bold ${
                    card.danger ? 'text-red-600' : 'dark:text-white'
                  }`}
                >
                  {card.title}
                </h2>

                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  {card.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default UserDashboard;
