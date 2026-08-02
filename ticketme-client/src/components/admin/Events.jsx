import { useEffect, useState } from 'react';
// import AdminLayout from '../components/admin/AdminLayout';
// import EventTable from '../components/admin/EventTable';
import AdminLayout from './AdminLayout';
import EventTable from './EventTable';
import { getEvents, deleteEvent, assignOrganizer } from '../api/eventApi';
import api from '../api/api';

function Events() {
  const [events, setEvents] = useState([]);
  const [organizers, setOrganizers] = useState([]);

  useEffect(() => {
    loadEvents();
    loadOrganizers();
  }, []);

  // const loadEvents = async () => {
  //   const res = await getEvents();

  //   console.log(res);
  //   console.log(res.data);

  //   setEvents(res.data.events);
  //   try {
  //     const res = await getEvents();
  //     setEvents(res.data.events);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const loadEvents = async () => {
  //   try {
  //     const res = await getEvents();

  //     console.log('Events Response:', res);

  //     setEvents(res.data.events || []);
  //   } catch (err) {
  //     console.log(err);
  //     setEvents([]);
  //   }
  // };

  const loadEvents = async () => {
    try {
      const res = await getEvents();

      console.log(res);

      setEvents(res.data.events || []);
    } catch (err) {
      console.log(err);
      setEvents([]);
    }
  };
  const loadOrganizers = async () => {
    try {
      const res = await api.get('/users?role=organizer');
      setOrganizers(res.data.data.users);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      loadEvents();
    } catch (err) {
      console.log(err);
    }
  };

  const handleAssignOrganizer = async (eventId, organizerId) => {
    try {
      await assignOrganizer(eventId, organizerId);
      loadEvents();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AdminLayout>
      <h1 className="mb-8 text-4xl font-black dark:text-white">Events</h1>

      <EventTable
        events={events}
        organizers={organizers}
        onDelete={handleDelete}
        onAssignOrganizer={handleAssignOrganizer}
      />
    </AdminLayout>
  );
}

export default Events;
