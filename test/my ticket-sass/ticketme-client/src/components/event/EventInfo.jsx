import { CalendarDays, MapPin, Building2, Ticket, User } from 'lucide-react';

function EventInfo({ event }) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm dark:bg-slate-900">
      <h2 className="mb-6 text-3xl font-black">About this event</h2>

      <p className="leading-8 text-slate-600 dark:text-slate-300">
        {event.description}
      </p>

      <div className="mt-12 space-y-6">
        <div className="flex gap-4">
          <CalendarDays className="text-blue-600" />
          <div>
            <p className="font-bold">Date</p>
            <p>{new Date(event.startDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Building2 className="text-blue-600" />
          <div>
            <p className="font-bold">Venue</p>
            <p>{event.venue}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <MapPin className="text-blue-600" />
          <div>
            <p className="font-bold">Location</p>
            <p>
              {event.city}, {event.state}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <User className="text-blue-600" />
          <div>
            <p className="font-bold">Organizer</p>
            <p>{event.owner?.name}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Ticket className="text-blue-600" />
          <div>
            <p className="font-bold">Available Tickets</p>
            <p>{event.availableTickets}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventInfo;
