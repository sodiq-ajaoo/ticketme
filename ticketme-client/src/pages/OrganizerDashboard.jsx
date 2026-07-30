import OrganizerSidebar from '../components/organizer/OrganizerSidebar';
import DashboardCards from '../components/organizer/DashboardCards';
import RecentOrders from '../components/organizer/RecentOrders';

function OrganizerDashboard() {
  return (
    <section className="bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl">
        <OrganizerSidebar />

        <main className="flex-1 p-8">
          <h1 className="mb-8 text-4xl font-black">Organizer Dashboard</h1>

          <DashboardCards />

          <RecentOrders />
        </main>
      </div>
    </section>
  );
}

export default OrganizerDashboard;
