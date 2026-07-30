import { useState } from 'react';
import EventRow from './EventRow';
import AssignOrganizerModal from './AssignOrganizerModal';
import DeleteEventModal from './DeleteEventModal';

const events = [
  {
    id: 1,
    title: 'Summer Music Festival',
    venue: 'Lagos',
    date: 'July 28, 2026',
    status: 'Published',
    organizer: 'Not Assigned',
  },
  {
    id: 2,
    title: 'Comedy Night',
    venue: 'Abuja',
    date: 'August 15, 2026',
    status: 'Published',
    organizer: 'John Doe',
  },
  {
    id: 3,
    title: 'Football Final',
    venue: 'Port Harcourt',
    date: 'September 8, 2026',
    status: 'Draft',
    organizer: 'Not Assigned',
  },
];

function EventTable() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [openAssign, setOpenAssign] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-100 dark:bg-slate-800">
            <tr>
              <th className="p-5 text-left">Event</th>

              <th className="p-5 text-left">Venue</th>

              <th className="p-5 text-left">Date</th>

              <th className="p-5 text-left">Organizer</th>

              <th className="p-5 text-left">Status</th>

              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <EventRow
                key={event.id}
                event={event}
                onAssign={() => {
                  setSelectedEvent(event);
                  setOpenAssign(true);
                }}
                onDelete={() => {
                  setSelectedEvent(event);
                  setOpenDelete(true);
                }}
              />
            ))}
          </tbody>
        </table>
      </div>

      <AssignOrganizerModal
        open={openAssign}
        event={selectedEvent}
        onClose={() => setOpenAssign(false)}
      />

      <DeleteEventModal
        open={openDelete}
        event={selectedEvent}
        onClose={() => setOpenDelete(false)}
        onDelete={() => {
          console.log('Delete', selectedEvent);

          setOpenDelete(false);
        }}
      />
    </div>
  );
}

export default EventTable;
