// import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';

import EventHero from '../components/event/EventHero';
import EventInfo from '../components/event/EventInfo';
import Spinner from '../components/ui/Spinner';
import TicketSelector from '../components/event/TicketSelector';
import EventMap from '../components/event/EventMap';

function EventDetails() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvent();
  }, []);

  async function fetchEvent() {
    try {
      const res = await api.get(`/events/${id}`);

      setEvent(res.data.data.event);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Spinner text="Loading event..." />;
  }

  if (!event) {
    return (
      <div className="py-32 text-center text-2xl font-bold">
        Event not found.
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-xl border border-slate-300 px-4  mb-2 py-2 font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          ← Back
        </button>
        <EventHero event={event} />
      </div>

      {/* <EventHero event={event} /> */}

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* <div className="lg:col-span-2">
            <EventInfo event={event} />
          </div> */}

          <div className="lg:col-span-2">
            <EventInfo event={event} />

            <EventMap event={event} />
          </div>

          {/* <div>
            <TicketSelector event={event} />
          </div> */}
          <aside className="h-fit lg:sticky lg:top-24">
            <TicketSelector event={event} />
          </aside>
        </div>
      </section>
    </>
  );
}

export default EventDetails;
