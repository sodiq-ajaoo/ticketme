import api from './api';

export const getEvents = async (params = {}) => {
  const res = await api.get('/events', {
    params,
  });

  return res.data;
};

export const getEvent = async (id) => {
  const res = await api.get(`/events/${id}`);

  return res.data;
};
