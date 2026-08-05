import { CalendarDays, MapPin, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';

function TicketItem({ ticket }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col md:flex-row">
        <img
          src={ticket.image}
          alt={ticket.title}
          className="h-52 w-full object-cover md:h-auto md:w-72"
        />

        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <h2 className="text-2xl font-bold">{ticket.title}</h2>

            <div className="mt-5 space-y-3 text-slate-500">
              <div className="flex items-center gap-2">
                <CalendarDays size={18} />
                {ticket.date}
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={18} />
                {ticket.location}
              </div>

              <div className="flex items-center gap-2">
                <Ticket size={18} />
                {ticket.type}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <span className="inline-flex w-fit rounded-full bg-green-100 px-4 py-2 font-semibold text-green-700">
              {ticket.status}
            </span>

            <Link
              to="/payment-success"
              className="rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
            >
              View Ticket
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketItem;
