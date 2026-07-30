import { Heart, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

function EventCard({ event }) {
  const price =
    event.ticketTypes && event.ticketTypes.length > 0
      ? event.ticketTypes[0].price
      : 'Free';

  return (
    <div className="group overflow-hidden rounded-3xl bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-slate-900">
      <div className="relative">
        <img
          src={event.imageCover}
          alt={event.name}
          className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <button className="absolute right-4 top-4 rounded-full bg-white/90 p-2 shadow dark:bg-slate-800">
          <Heart size={18} />
        </button>

        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
            {event.category}
          </span>

          {event.featured && (
            <span className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-semibold text-white">
              Featured
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 text-xl font-bold">{event.name}</h3>

        <div className="flex items-center gap-2 text-slate-500">
          <MapPin size={16} />
          {event.city}, {event.state}
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <Calendar size={16} />
          {new Date(event.startDate).toLocaleDateString()}
        </div>

        <div className="flex items-center justify-between pt-3">
          <p className="text-2xl font-bold text-blue-600">
            {price === 'Free' ? 'Free' : `₦${price.toLocaleString()}`}
          </p>

          <Link
            to={`/events/${event._id}`}
            className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
