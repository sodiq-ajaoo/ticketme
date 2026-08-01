// import { CalendarDays, MapPin, Building2, Ticket, User } from 'lucide-react';

// function EventInfo({ event }) {
//   return (
//     <div className="rounded-3xl bg-white p-8 shadow-sm dark:bg-slate-900">
//       <h2 className="mb-6 text-3xl font-black">About this event</h2>

//       <p className="leading-8 text-slate-600 dark:text-slate-300">
//         {event.description}
//       </p>

//       <div className="mt-12 space-y-6">
//         <div className="flex gap-4">
//           <CalendarDays className="text-blue-600" />
//           <div>
//             <p className="font-bold">Date</p>
//             <p>{new Date(event.startDate).toLocaleDateString()}</p>
//           </div>
//         </div>

//         <div className="flex gap-4">
//           <Building2 className="text-blue-600" />
//           <div>
//             <p className="font-bold">Venue</p>
//             <p>{event.venue}</p>
//           </div>
//         </div>

//         <div className="flex gap-4">
//           <MapPin className="text-blue-600" />
//           <div>
//             <p className="font-bold">Location</p>
//             <p>
//               {event.city}, {event.state}
//             </p>
//           </div>
//         </div>

//         <div className="flex gap-4">
//           <User className="text-blue-600" />
//           <div>
//             <p className="font-bold">Organizer</p>
//             <p>{event.owner?.name}</p>
//           </div>
//         </div>

//         <div className="flex gap-4">
//           <Ticket className="text-blue-600" />
//           <div>
//             <p className="font-bold">Available Tickets</p>
//             <p>{event.availableTickets}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default EventInfo;

import {
  CalendarDays,
  MapPin,
  Building2,
  Ticket,
  User,
  Tag,
  Clock,
} from 'lucide-react';

function EventInfo({ event }) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm dark:bg-slate-900">
      {/* About */}

      <h2 className="mb-6 text-3xl font-black">About this Event</h2>

      <p className="leading-8 text-slate-600 dark:text-slate-300">
        {event.description}
      </p>

      {/* Details */}

      <div className="mt-12">
        <h3 className="mb-6 text-2xl font-bold">Event Details</h3>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex items-start gap-4 rounded-2xl border p-4">
            <CalendarDays className="text-blue-600" />

            <div>
              <p className="font-semibold">Date</p>

              <p className="text-slate-500">
                {new Date(event.startDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border p-4">
            <Clock className="text-blue-600" />

            <div>
              <p className="font-semibold">Time</p>

              <p className="text-slate-500">
                {new Date(event.startDate).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border p-4">
            <Building2 className="text-blue-600" />

            <div>
              <p className="font-semibold">Venue</p>

              <p className="text-slate-500">{event.venue}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border p-4">
            <MapPin className="text-blue-600" />

            <div>
              <p className="font-semibold">Location</p>

              <p className="text-slate-500">
                {event.city}, {event.state}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border p-4">
            <Tag className="text-blue-600" />

            <div>
              <p className="font-semibold">Category</p>

              <p className="capitalize text-slate-500">{event.category}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border p-4">
            <User className="text-blue-600" />

            <div>
              <p className="font-semibold">Organizer</p>

              <p className="text-slate-500">
                {event.owner?.name || 'TicketMe'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border p-4">
            <Ticket className="text-blue-600" />

            <div>
              <p className="font-semibold">Tickets Remaining</p>

              <p className="font-bold text-green-600">
                {event.availableTickets}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border p-4">
            <Ticket className="text-blue-600" />

            <div>
              <p className="font-semibold">Starting Price</p>

              <p className="font-bold text-blue-600">
                {event.ticketTypes?.length
                  ? `₦${event.ticketTypes[0].price.toLocaleString()}`
                  : 'Free'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}

      {event.tags?.length > 0 && (
        <div className="mt-12">
          <h3 className="mb-4 text-2xl font-bold">Tags</h3>

          <div className="flex flex-wrap gap-3">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EventInfo;
