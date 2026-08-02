import { useParams } from 'react-router-dom';

import AdminLayout from '../components/admin/AdminLayout';
import EventForm from '../components/admin/create-event/EventForm';

function EditEvent() {
  const { id } = useParams();

  return (
    <AdminLayout>
      <h1 className="mb-8 text-4xl font-black">Edit Event</h1>

      <EventForm editMode={true} eventId={id} />
    </AdminLayout>
  );
}

export default EditEvent;
