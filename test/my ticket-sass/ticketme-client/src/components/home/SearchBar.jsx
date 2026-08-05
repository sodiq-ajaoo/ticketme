import { Search, MapPin, CalendarDays, Ticket } from 'lucide-react';

function SearchBar() {
  return (
    <section className="relative z-20 -mt-14 px-6">
      <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* Search by Event Name */}

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-4 transition focus-within:border-blue-500 dark:border-slate-700">
            <Search className="text-blue-600" size={20} />

            <input
              type="text"
              placeholder="Search event name..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Location */}

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-4 transition focus-within:border-blue-500 dark:border-slate-700">
            <MapPin className="text-blue-600" size={20} />

            <input
              type="text"
              placeholder="Location"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Date */}

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-4 transition focus-within:border-blue-500 dark:border-slate-700">
            <CalendarDays className="text-blue-600" size={20} />

            <input
              type="date"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          {/* Category */}

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-4 transition focus-within:border-blue-500 dark:border-slate-700">
            <Ticket className="text-blue-600" size={20} />

            <select className="w-full bg-transparent text-sm outline-none">
              <option>All Categories</option>

              <option>Concert</option>

              <option>Sports</option>

              <option>Comedy</option>

              <option>Festival</option>

              <option>Conference</option>

              <option>Theatre</option>
            </select>
          </div>

          {/* Search Button */}

          <button className="rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white transition duration-300 hover:bg-blue-700 hover:shadow-xl">
            Search Events
          </button>
        </div>
      </div>
    </section>
  );
}

export default SearchBar;
