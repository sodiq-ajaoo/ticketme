import { Pencil, Trash2, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

function EventRow({ event, onAssign, onDelete }) {
  return (
    <tr className="border-t border-slate-200 dark:border-slate-800">
      <td className="p-5 font-semibold">{event.title}</td>

      <td className="p-5">{event.venue}</td>

      <td className="p-5">{event.date}</td>

      <td className="p-5">{event.organizer}</td>

      <td className="p-5">
        <span
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            event.status === 'Published'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {event.status}
        </span>
      </td>

      <td className="p-5">
        <div className="flex justify-end gap-3">
          <Link
            to={`/admin/events/${event.id}/edit`}
            className="rounded-xl bg-blue-100 p-3 text-blue-600 hover:bg-blue-200"
          >
            <Pencil size={18} />
          </Link>

          <button
            onClick={onAssign}
            className="rounded-xl bg-purple-100 p-3 text-purple-600 hover:bg-purple-200"
          >
            <UserPlus size={18} />
          </button>

          <button
            onClick={onDelete}
            className="rounded-xl bg-red-100 p-3 text-red-600 hover:bg-red-200"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default EventRow;
