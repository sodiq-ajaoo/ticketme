import { useEffect, useState } from 'react';
import api from '../services/api';
import EventCard from '../components/home/EventCard';
import Spinner from '../components/ui/Spinner';

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const [category, setCategory] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [sort, setSort] = useState('-createdAt');

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchEvents();
  }, [page, search, category, stateFilter, sort]);

  async function fetchEvents() {
    try {
      setLoading(true);

      // const res = await api.get('/events', {
      //   params: {
      //     page,
      //     limit: 12,
      //     search,
      //     category,
      //     state: stateFilter,
      //     sort,
      //   },
      // });

      const res = await api.get('/events', {
        params: {
          page,
          limit: 12,
          keyword: search,
          category,
          state: stateFilter,
          sort,
        },
      });

      console.log(res.data);

      setEvents(res.data.data.events || []);

      setTotalPages(
        res.data.pagination?.totalPages || res.data.totalPages || 1,
      );

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10">
        <h1 className="text-5xl font-black">Browse Events</h1>

        <p className="mt-2 text-slate-500">
          Discover concerts, sports, festivals and more.
        </p>
      </div>

      {/* Filters */}

      <div className="mb-10 grid gap-4 md:grid-cols-4">
        <input
          type="text"
          placeholder="Search events..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="rounded-xl border border-slate-300 p-3 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
        />

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-300 p-3 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="">All Categories</option>
          <option value="concert">Concert</option>
          <option value="festival">Festival</option>
          <option value="conference">Conference</option>
          <option value="sports">Sports</option>
          <option value="comedy">Comedy</option>
          <option value="theatre">Theatre</option>
        </select>

        <input
          type="text"
          placeholder="State"
          value={stateFilter}
          onChange={(e) => {
            setStateFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-300 p-3 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
        />

        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-300 p-3 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="-createdAt">Newest</option>
          <option value="startDate">Event Date</option>
          <option value="price">Lowest Price</option>
          <option value="-price">Highest Price</option>
        </select>
      </div>

      {loading ? (
        <Spinner text="Loading events..." />
      ) : events.length === 0 ? (
        <div className="py-24 text-center">
          <h2 className="text-3xl font-bold">No matching events</h2>

          <p className="mt-3 text-slate-500">
            Try changing your search or filters.
          </p>

          <button
            onClick={() => {
              setSearchInput('');
              setSearch('');
              setCategory('');
              setStateFilter('');
              setSort('-createdAt');
              setPage(1);
            }}
            className="mt-8 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-slate-500">
              {events.length} event
              {events.length !== 1 && 's'} found
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>

          <div className="mt-12 flex items-center justify-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-xl border px-5 py-3 disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`h-12 w-12 rounded-xl ${
                  page === i + 1 ? 'bg-blue-600 text-white' : 'border'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-xl border px-5 py-3 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default Events;
