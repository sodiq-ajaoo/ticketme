import { useEffect, useState } from 'react';
import api from '../services/api';

import Spinner from '../components/ui/Spinner';
import TicketItem from '../components/tickets/TicketItem';

function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    try {
      const res = await api.get('/tickets/my-tickets');

      setTickets(res.data.data.tickets || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner text="Loading your tickets..." />
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50 py-16 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="mb-10 text-4xl font-black dark:text-white">
          My Tickets
        </h1>

        {tickets.length === 0 ? (
          <div className="rounded-3xl bg-white p-16 text-center shadow dark:bg-slate-900">
            <h2 className="text-2xl font-bold dark:text-white">
              No Tickets Yet
            </h2>

            <p className="mt-3 text-slate-500">
              You haven't purchased any tickets.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {tickets.map((ticket) => (
              <TicketItem key={ticket._id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default MyTickets;
