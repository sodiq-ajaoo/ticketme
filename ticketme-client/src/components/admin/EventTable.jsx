import { useState } from 'react';
import EventRow from './EventRow';
import AssignOrganizerModal from './AssignOrganizerModal';
import DeleteEventModal from './DeleteEventModal';

function EventTable({ events, onDelete, organizers, onAssignOrganizer }) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [openAssign, setOpenAssign] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <>
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
              {/* {events.map((event) => ( */}
              {events?.map((event) => (
                <EventRow
                  key={event._id}
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
      </div>

      <AssignOrganizerModal
        open={openAssign}
        event={selectedEvent}
        organizers={organizers}
        onClose={() => setOpenAssign(false)}
        onAssign={async (organizerId) => {
          await onAssignOrganizer(selectedEvent._id, organizerId);
          setOpenAssign(false);
        }}
      />

      <DeleteEventModal
        open={openDelete}
        event={selectedEvent}
        onClose={() => setOpenDelete(false)}
        onDelete={async () => {
          await onDelete(selectedEvent._id);
          setOpenDelete(false);
        }}
      />
    </>
  );
}

export default EventTable;
