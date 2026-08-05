import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950">
      <AdminSidebar />

      <div className="flex flex-1 flex-col">
        <AdminTopbar />

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
