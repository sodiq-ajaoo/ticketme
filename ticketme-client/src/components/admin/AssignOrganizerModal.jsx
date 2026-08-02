import { useState } from 'react';
import { X } from 'lucide-react';

const organizers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@ticketme.com',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah@ticketme.com',
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'michael@ticketme.com',
  },
];

function AssignOrganizerModal({ open, onClose, event }) {
  const [selectedOrganizer, setSelectedOrganizer] = useState('');

  if (!open) return null;

  const handleAssign = () => {
    console.log({
      event,
      organizer: selectedOrganizer,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Assign Organizer</h2>

          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <p className="mb-6 text-slate-500">{event?.title}</p>

        <select
          value={selectedOrganizer}
          onChange={(e) => setSelectedOrganizer(e.target.value)}
          className="w-full rounded-xl border p-4"
        >
          <option value="">Select Organizer</option>

          {organizers.map((organizer) => (
            <option key={organizer.id} value={organizer.id}>
              {organizer.name}
            </option>
          ))}
        </select>

        <div className="mt-8 flex justify-end gap-4">
          <button onClick={onClose} className="rounded-xl border px-6 py-3">
            Cancel
          </button>

          <button
            onClick={handleAssign}
            className="rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssignOrganizerModal;
