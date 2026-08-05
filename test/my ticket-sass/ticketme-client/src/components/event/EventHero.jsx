import { CalendarDays, MapPin, Tag, User } from 'lucide-react';

function EventHero({ event }) {
  if (!event) return null;

  return (
    <section className="relative">
      {/* Cover Image */}

      <div className="h-[320px] overflow-hidden md:h-[420px]">
        <img
          src={event.imageCover}
          alt={event.name}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Event Info */}

      <div className="absolute inset-0 flex items-end">
        <div className="mx-auto w-full max-w-7xl px-6 pb-10 text-white">
          <span className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold">
            <Tag size={16} className="mr-2" />
            {event.category}
          </span>

          <h1 className="mt-5 max-w-3xl text-4xl font-black md:text-6xl">
            {event.name}
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-slate-200">
            {event.summary}
          </p>

          <div className="mt-8 flex flex-wrap gap-6 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <CalendarDays size={18} />
              {new Date(event.startDate).toLocaleDateString()}
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={18} />
              {event.venue}, {event.city}, {event.state}
            </div>

            <div className="flex items-center gap-2">
              <User size={18} />
              {event.owner?.name}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EventHero;
