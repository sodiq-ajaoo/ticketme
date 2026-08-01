import { CalendarDays, MapPin, Tag, User, Star } from 'lucide-react';

function EventHero({ event }) {
  if (!event) return null;

  return (
    <section className="relative overflow-hidden">
      {/* Cover */}
      <div className="h-[340px] md:h-[480px]">
        <img
          src={event.imageCover}
          alt={event.name}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="mx-auto w-full max-w-7xl px-6 pb-10 text-white">
          {/* Badges */}
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold">
              <Tag size={16} className="mr-2" />
              {event.category}
            </span>

            {event.featured && (
              <span className="inline-flex items-center rounded-full bg-yellow-500 px-4 py-2 text-sm font-semibold text-white">
                <Star size={16} className="mr-2" />
                Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            {event.name}
          </h1>

          {/* Summary */}
          <p className="mt-4 max-w-3xl text-lg text-slate-200">
            {event.summary}
          </p>

          {/* Info */}
          <div className="mt-8 flex flex-wrap gap-6 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <CalendarDays size={18} />
              {new Date(event.startDate).toLocaleDateString()}
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={18} />
              {event.venue}
              {event.city && ` • ${event.city}`}
              {event.state && `, ${event.state}`}
            </div>

            {event.owner?.name && (
              <div className="flex items-center gap-2">
                <User size={18} />
                {event.owner.name}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default EventHero;
