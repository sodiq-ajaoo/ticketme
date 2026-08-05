import OrganizerSidebar from './OrganizerSidebar';
import OrganizerNavbar from './OrganizerNavbar';

function OrganizerLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <OrganizerSidebar />

      <div className="flex flex-1 flex-col">
        <OrganizerNavbar />

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default OrganizerLayout;
