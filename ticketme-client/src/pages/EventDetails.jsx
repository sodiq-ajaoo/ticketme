import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';

import EventHero from '../components/event/EventHero';
import EventInfo from '../components/event/EventInfo';
import Spinner from '../components/ui/Spinner';
import TicketSelector from '../components/event/TicketSelector';

function EventDetails() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <EventHero event={event} />

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <EventInfo event={event} />
          </div>

          <div>
            <TicketSelector event={event} />
          </div>
        </div>
      </section>
    </>
  );
}

export default EventDetails;
