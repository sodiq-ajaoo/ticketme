import { useState } from 'react';
import TicketTypeCard from './TicketTypeCard';

function EventForm({ editMode = false }) {
  const [tickets, setTickets] = useState([
    {
      name: '',
      price: '',
      quantity: '',
    },
  ]);

  const addTicket = () => {
    setTickets([
      ...tickets,
      {
        name: '',
        price: '',
        quantity: '',
      },
    ]);
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm dark:bg-slate-900">
      <div className="grid gap-6 md:grid-cols-2">
        <input placeholder="Event Title" className="rounded-xl border p-4" />

        <input placeholder="Venue" className="rounded-xl border p-4" />

        <input type="date" className="rounded-xl border p-4" />

        <input type="time" className="rounded-xl border p-4" />
      </div>

      <textarea
        rows={5}
        placeholder="Event Description"
        className="mt-6 w-full rounded-xl border p-4"
      />

      <input type="file" className="mt-6 w-full rounded-xl border p-4" />

      <h2 className="mt-10 mb-6 text-2xl font-bold">Ticket Types</h2>

      <div className="space-y-5">
        {tickets.map((ticket, index) => (
          <TicketTypeCard key={index} index={index} />
        ))}
      </div>

      <button
        onClick={addTicket}
        className="mt-6 rounded-xl border px-6 py-3 font-semibold"
      >
        + Add Ticket Type
      </button>

      <button className="mt-10 w-full rounded-2xl bg-blue-600 py-4 text-lg font-bold text-white transition hover:bg-blue-700">
        {editMode ? 'Save Changes' : 'Publish Event'}
      </button>
    </div>
  );
}

export default EventForm;
