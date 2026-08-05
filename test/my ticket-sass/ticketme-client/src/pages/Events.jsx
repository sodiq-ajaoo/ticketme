import { useEffect, useState } from 'react';
import api from '../services/api';
import EventCard from '../components/home/EventCard';
import Spinner from '../components/ui/Spinner';

function Events() {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [sort, setSort] = useState('-startDate');

  useEffect(() => {
    fetchEvents();
  }, [page, search, category, stateFilter, sort]);

  async function fetchEvents() {
    try {
      setLoading(true);

      const res = await api.get(
        `/events?page=${page}&limit=12&keyword=${search}&category=${category}&state=${stateFilter}&sort=${sort}`,
      );

      console.log(res.data);

      setEvents(res.data.data.events);
      setTotalPages(res.data.totalPages);

      // setEvents(res.data.data.events);

      // Backend will provide this after we update it
      // setTotalPages(res.data.totalPages || 1);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  console.log(events);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      {/* Heading */}

      <div className="mb-10">
        <h1 className="text-5xl font-black">Browse Events</h1>

        <p className="mt-2 text-slate-500">
          Discover concerts, sports, festivals and more.
        </p>
      </div>

      {/* Search & Filters */}

      <div className="mb-10 grid gap-4 md:grid-cols-4">
        {/* Search */}

        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-300 p-3 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
        />

        {/* Category */}

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

        {/* State */}

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

        {/* Sort */}

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
          <option value="ticketTypes.price">Lowest Price</option>
          <option value="-ticketTypes.price">Highest Price</option>
        </select>
      </div>

      {/* Loading */}

      {loading ? (
        <Spinner text="Loading events..." />
      ) : events.length === 0 ? (
        <div className="py-24 text-center">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
            No events found
          </h2>

          <p className="mt-3 text-slate-500">
            Try changing your search, category or state.
          </p>

          <button
            onClick={() => {
              setSearch('');
              setCategory('');
              setStateFilter('');
              setSort('-startDate');
              setPage(1);
            }}
            className="mt-8 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>

          {/* Pagination */}

          <div className="mt-12 flex items-center justify-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-xl border px-5 py-3 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-800"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`h-12 w-12 rounded-xl font-bold transition ${
                  page === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'border hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-xl border px-5 py-3 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-800"
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
