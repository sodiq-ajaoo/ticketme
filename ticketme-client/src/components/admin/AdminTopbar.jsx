import { Bell, Search } from 'lucide-react';

function AdminTopbar() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8 dark:border-slate-800 dark:bg-slate-900">
      <div className="relative">
        <Search size={18} className="absolute left-4 top-4 text-slate-400" />

        <input
          type="text"
          placeholder="Search..."
          className="rounded-xl border bg-slate-100 py-3 pl-12 pr-5 outline-none dark:bg-slate-800"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative">
          <Bell size={24} />

          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
            A
          </div>

          <div>
            <h3 className="font-bold">Admin</h3>

            <p className="text-sm text-slate-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminTopbar;
