import { CalendarDays, MapPin, Ticket, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

function EventCard({ event }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <img
        src={event.image}
        alt={event.title}
        className="h-48 w-full object-cover"
      />

      <div className="p-6">
        <h2 className="text-2xl font-bold">{event.title}</h2>

        <div className="mt-5 space-y-3 text-slate-500">
          <div className="flex items-center gap-3">
            <CalendarDays size={18} />
            {event.date}
          </div>

          <div className="flex items-center gap-3">
            <MapPin size={18} />
            {event.venue}
          </div>

          <div className="flex items-center gap-3">
            <Ticket size={18} />
            {event.sold} Tickets Sold
          </div>

          <div className="flex items-center gap-3">
            <DollarSign size={18} />${event.revenue}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              event.status === 'Live'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {event.status}
          </span>

          <Link
            to={`/organizer/events/${event.id}`}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Manage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
