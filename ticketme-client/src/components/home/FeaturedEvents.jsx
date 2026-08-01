import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import EventCard from './EventCard';
import Spinner from '../ui/Spinner';

function FeaturedEvents({ search, location, date, category, featuredRef }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch events whenever filters change
  useEffect(() => {
    fetchFeaturedEvents();
  }, [search, location, date, category]);

  // Automatically scroll to this section when searching/filtering
  useEffect(() => {
    if (search || location || date || category) {
      featuredRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [search, location, date, category, featuredRef]);

  async function fetchFeaturedEvents() {
    try {
      setLoading(true);

      const res = await api.get('/events', {
        params: {
          limit: 8,
          keyword: `${search} ${location}`.trim(),
          date,
          category,
          sort: 'startDate',
        },
        // params: {
        //   limit: 8,
        //   keyword: search,
        //   state: location,
        //   date,
        //   category,
        //   sort: 'startDate',
        // },
      });

      setEvents(res.data.data.events || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black">Featured Events</h2>

          <p className="mt-2 text-slate-500">
            Discover the hottest events happening near you.
          </p>
        </div>

        <Link
          to="/events"
          className="hidden rounded-xl border px-5 py-3 font-semibold transition hover:bg-slate-100 dark:hover:bg-slate-800 md:block"
        >
          View All →
        </Link>
      </div>

      {loading ? (
        <Spinner text="Loading featured events..." />
      ) : events.length === 0 ? (
        <div className="py-16 text-center">
          <h3 className="text-2xl font-bold">No events found</h3>

          <p className="mt-3 text-slate-500">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}

export default FeaturedEvents;
