import { Bell, Search } from 'lucide-react';

function OrganizerNavbar() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-900">
      {/* Search */}

      <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 md:flex dark:border-slate-700 dark:bg-slate-800">
        <Search size={18} className="text-slate-400" />

        <input
          type="text"
          placeholder="Search events..."
          className="w-64 bg-transparent outline-none"
        />
      </div>

      {/* Right Side */}

      <div className="ml-auto flex items-center gap-5">
        <button className="relative rounded-2xl bg-slate-100 p-3 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700">
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500"></span>
        </button>

        <div className="flex items-center gap-3">
          <img
            src="https://ui-avatars.com/api/?name=John+Doe"
            alt="Organizer"
            className="h-11 w-11 rounded-full"
          />

          <div className="hidden sm:block">
            <p className="font-bold">John Doe</p>

            <p className="text-sm text-slate-500">Organizer</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default OrganizerNavbar;
