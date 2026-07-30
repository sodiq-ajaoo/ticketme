import { Link } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import EventTable from '../components/admin/manage-events/EventTable';

function ManageEvents() {
  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-black">Manage Events</h1>

          <p className="mt-2 text-slate-500">
            View, edit and manage all events.
          </p>
        </div>

        <Link
          to="/admin/create-event"
          className="rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-700"
        >
          + Create Event
        </Link>
      </div>

      <EventTable />
    </AdminLayout>
  );
}

export default ManageEvents;
