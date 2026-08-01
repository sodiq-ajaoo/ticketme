import { Search, MapPin, CalendarDays, Ticket } from 'lucide-react';

function SearchBar({
  search,
  setSearch,
  location,
  setLocation,
  date,
  setDate,
  category,
  setCategory,
  onSearch,
}) {
  return (
    <section className="relative z-20 -mt-14 px-6">
      <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-700">
            <Search className="text-blue-600" size={20} />

            <input
              type="text"
              placeholder="Search event..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          {/* Location */}
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-700">
            <MapPin className="text-blue-600" size={20} />

            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          {/* Date */}
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-700">
            <CalendarDays className="text-blue-600" size={20} />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          {/* Category */}
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-700">
            <Ticket className="text-blue-600" size={20} />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
            >
              <option value="">All Categories</option>
              <option value="concert">Concert</option>
              <option value="sports">Sports</option>
              <option value="comedy">Comedy</option>
              <option value="festival">Festival</option>
              <option value="conference">Conference</option>
              <option value="theatre">Theatre</option>
            </select>
          </div>

          {/* Search Button */}
          <button
            onClick={onSearch}
            className="rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg"
          >
            Search Events
          </button>
        </div>
      </div>
    </section>
  );
}

export default SearchBar;
