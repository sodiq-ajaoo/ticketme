import api from './api';

/* =========================
   CREATE EVENT
========================= */
export const createEvent = async (
  formData,
  ticketTypes,
  coverImage,
  galleryImages,
  selectedOrganizer,
) => {
  const data = new FormData();

  data.append('name', formData.name);
  data.append('summary', formData.summary);
  data.append('description', formData.description);
  data.append('category', formData.category);

  data.append('venue', formData.venue);
  data.append('city', formData.city);
  data.append('state', formData.state);

  data.append('startDate', formData.startDate);
  data.append('endDate', formData.endDate);

  data.append('status', formData.status);

  data.append(
    'location',
    JSON.stringify({
      type: 'Point',
      coordinates: [Number(formData.longitude), Number(formData.latitude)],
      address: formData.address,
      description: formData.venue,
    }),
  );

  data.append('ticketTypes', JSON.stringify(ticketTypes));

  if (selectedOrganizer) {
    data.append('organizers', JSON.stringify([selectedOrganizer]));
  }

  if (coverImage) {
    data.append('imageCover', coverImage);
  }

  galleryImages.forEach((image) => {
    data.append('images', image);
  });

  const res = await api.post('/events', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};

/* =========================
   UPDATING EVENTS
========================= */
export const updateEvent = async (
  id,
  formData,
  ticketTypes,
  coverImage,
  galleryImages,
  organizerId,
) => {
  const data = new FormData();

  // Basic fields
  Object.keys(formData).forEach((key) => {
    data.append(key, formData[key]);
  });

  // Location
  data.append(
    'location',
    JSON.stringify({
      type: 'Point',
      coordinates: [Number(formData.longitude), Number(formData.latitude)],
      address: formData.address,
      description: formData.venue,
    }),
  );

  // Ticket Types
  data.append('ticketTypes', JSON.stringify(ticketTypes));

  // Organizer
  if (organizerId) {
    data.append('organizer', organizerId);
  }

  // Cover Image
  if (coverImage) {
    data.append('imageCover', coverImage);
  }

  // Gallery Images
  galleryImages.forEach((image) => {
    data.append('images', image);
  });

  const res = await api.patch(`/events/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};

/* =========================
   PUBLIC EVENTS
========================= */

export const getEvents = async (page = 1) => {
  const res = await api.get(`/events?page=${page}&limit=12`);

  return res.data;
};

/* =========================
   ADMIN EVENTS
========================= */

export const getAdminEvents = async () => {
  const res = await api.get('/events?limit=1000');

  return res.data;
};

// export const getAdminEvents = async () => {
//   const res = await api.get('/events?limit=1000');

//   return res.data.data.events;
// };

/* =========================
   DELETE EVENT
========================= */

export const deleteEvent = async (id) => {
  const res = await api.delete(`/events/${id}`);

  return res.data;
};

/* =========================
   ASSIGN ORGANIZER
========================= */

export const assignOrganizer = async (eventId, organizerId) => {
  const res = await api.patch(`/events/${eventId}/assign-organizer`, {
    organizerId,
  });

  return res.data;
};

export const getEvent = async (id) => {
  const res = await api.get(`/events/${id}`);

  return res.data.data.event;
};

// export const updateEvent = async (id, formData) => {
//   const res = await api.patch(`/events/${id}`, formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });

//   return res.data;
// };

export const getSingleEvent = async (id) => {
  const res = await api.get(`/events/${id}`);
  return res.data;
};
