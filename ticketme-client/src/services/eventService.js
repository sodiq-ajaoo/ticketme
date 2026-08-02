import api from './api';
import { getToken } from './authService';

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

export const createEvent = async (
  formData,
  ticketTypes,
  coverImage,
  galleryImages,
  selectedOrganizer
) 
=> {
  const data = new FormData();

  // Basic fields
  Object.entries(formData).forEach(([key, value]) => {
    if (key !== 'latitude' && key !== 'longitude' && key !== 'address') {
      data.append(key, value);
    }
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

  // Cover Image
  if (coverImage) {
    data.append('imageCover', coverImage);
  }

  // Gallery Images
  galleryImages.forEach((image) => {
    data.append('images', image);
  });

  const token = getToken();

  const res = await api.post('/events', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
