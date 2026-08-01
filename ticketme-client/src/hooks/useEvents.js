import { useEffect, useState } from 'react';
import { getEvents } from '../services/eventService';

export default function useEvents(options = {}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);

        const data = await getEvents(options);

        setEvents(data.data.events || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load events.');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [JSON.stringify(options)]);

  return {
    events,
    loading,
    error,
  };
}
