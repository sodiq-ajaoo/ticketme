import { X, Trash2 } from 'lucide-react';

function DeleteEventModal({ open, onClose, event, onDelete }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Delete Event</h2>

          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <p className="text-lg">Are you sure you want to delete</p>

        <h3 className="mt-3 text-xl font-bold text-red-600">{event?.title}</h3>

        <p className="mt-4 text-slate-500">This action cannot be undone.</p>

        <div className="mt-8 flex justify-end gap-4">
          <button onClick={onClose} className="rounded-xl border px-6 py-3">
            Cancel
          </button>

          <button
            onClick={onDelete}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-white hover:bg-red-700"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteEventModal;
