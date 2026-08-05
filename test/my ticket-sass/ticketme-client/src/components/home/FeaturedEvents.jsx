import { useEffect, useState } from 'react';
import api from '../../services/api';
import EventCard from './EventCard';

function FeaturedEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // const res = await api.get("/events");

  useEffect(() => {
    async function fetchEvents() {
      try {
        // const res = await api.get('/events');
        // const res = await api.get('/events');
        const res = await api.get('/events?limit=100');

        setEvents(res.data.data.events || []);
        console.log(res.data);

        // Your backend most likely returns { status, results, data: { events } }
        // setEvents(res.data.data.events);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-4xl font-black">Trending Events</h2>

        <p className="mt-8">Loading events...</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black">Trending Events</h2>

          <p className="mt-2 text-slate-500">
            Discover the hottest events happening near you.
          </p>
        </div>

        <button className="hidden rounded-xl border px-5 py-3 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 md:block">
          View All →
        </button>
      </div>

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <div className="text-red-500">Total events: {events.length}</div>
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </section>
  );
}

export default FeaturedEvents;
