import api from '../../services/api';
import { useMemo, useState } from 'react';

function TicketSelector({ event }) {
  const [quantities, setQuantities] = useState({});

  if (!event?.ticketTypes?.length) {
    return (
      <div className="rounded-3xl border bg-white p-6 shadow-sm dark:bg-slate-900">
        <p className="text-center text-slate-500">No tickets available.</p>
      </div>
    );
  }

  const increase = (ticket) => {
    const current = quantities[ticket._id] || 0;

    if (current >= ticket.quantity - ticket.sold) return;

    setQuantities({
      ...quantities,
      [ticket._id]: current + 1,
    });
  };

  const decrease = (ticket) => {
    const current = quantities[ticket._id] || 0;

    if (current === 0) return;

    setQuantities({
      ...quantities,
      [ticket._id]: current - 1,
    });
  };

  const handleCheckout = async () => {
    try {
      const selectedTickets = event.ticketTypes
        .filter((ticket) => (quantities[ticket._id] || 0) > 0)
        .map((ticket) => ({
          ticketTypeId: ticket._id,
          quantity: quantities[ticket._id],
        }));

      // Reserve tickets
      const reserveRes = await api.post('/tickets/reserve', {
        eventId: event._id,
        tickets: selectedTickets,
      });

      const ticketIds = reserveRes.data.data.tickets.map(
        (ticket) => ticket._id,
      );

      // Initialize payment
      const paymentRes = await api.post('/payments/initialize', {
        ticketIds,
      });

      // Redirect to Paystack
      window.location.href = paymentRes.data.data.authorization_url;
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || 'Something went wrong.');
    }
  };

  const totalPrice = useMemo(() => {
    return event.ticketTypes.reduce((total, ticket) => {
      return total + ticket.price * (quantities[ticket._id] || 0);
    }, 0);
  }, [event, quantities]);

  const totalTickets = useMemo(() => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  }, [quantities]);

  return (
    <div className="sticky top-28 rounded-3xl border bg-white p-6 shadow-xl dark:bg-slate-900">
      <h2 className="mb-6 text-2xl font-bold">Select Tickets</h2>

      <div className="space-y-5">
        {event.ticketTypes.map((ticket) => {
          const qty = quantities[ticket._id] || 0;

          return (
            <div key={ticket._id} className="rounded-2xl border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold">{ticket.name}</h3>

                  <p className="text-sm text-slate-500">
                    ₦{ticket.price.toLocaleString()}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    {ticket.quantity - ticket.sold} available
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => decrease(ticket)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl hover:bg-slate-200"
                  >
                    -
                  </button>

                  <span className="w-8 text-center font-bold">{qty}</span>

                  <button
                    onClick={() => increase(ticket)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-xl text-white hover:bg-blue-700"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 border-t pt-6">
        <div className="mb-3 flex justify-between">
          <span>Total Tickets</span>

          <span className="font-bold">{totalTickets}</span>
        </div>

        <div className="mb-6 flex justify-between text-xl font-bold">
          <span>Total</span>

          <span className="text-blue-600">₦{totalPrice.toLocaleString()}</span>
        </div>

        <button
          disabled={totalTickets === 0}
          onClick={handleCheckout}
          className="w-full rounded-2xl bg-blue-600 py-4 font-bold text-white hover:bg-blue-700 disabled:bg-slate-400"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default TicketSelector;
