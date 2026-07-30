import AdminLayout from '../components/admin/AdminLayout';
import EventForm from '../components/admin/create-event/EventForm';

function CreateEvent() {
  return (
    <AdminLayout>
      <h1 className="mb-8 text-4xl font-black">Create Event</h1>

      <EventForm />
    </AdminLayout>
  );
}

export default CreateEvent;
