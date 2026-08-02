// import { useState, useEffect } from 'react';
// import api from '../../../api/api';
// import { createEvent } from '../../../api/eventApi';

import { useState, useEffect } from 'react';
import api from '../../../api/api';

import { createEvent, getEvent, updateEvent } from '../../../api/eventApi';

// function EventForm({ editMode = false }) {
function EventForm({ editMode = false, eventId }) {
  const [formData, setFormData] = useState({
    name: '',
    summary: '',
    description: '',
    category: 'conference',

    startDate: '',
    endDate: '',

    latitude: '',
    longitude: '',

    venue: '',
    address: '',
    city: '',
    state: 'Lagos',

    status: 'draft',
  });

  const [ticketTypes, setTicketTypes] = useState([
    {
      name: '',
      price: '',
      quantity: '',
    },
  ]);

  const [coverImage, setCoverImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  const [organizers, setOrganizers] = useState([]);
  const [selectedOrganizer, setSelectedOrganizer] = useState('');

  useEffect(() => {
    fetchOrganizers();
  }, []);

  useEffect(() => {
    if (editMode && eventId) {
      loadEvent();
    }
  }, [editMode, eventId]);

  // const fetchOrganizers = async () => {
  //   try {
  //     const res = await api.get('/users?role=organizer');

  //     setOrganizers(res.data.data.users);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const fetchOrganizers = async () => {
    try {
      const res = await api.get('/users?role=organizer');
      setOrganizers(res.data.data.users);
    } catch (err) {
      console.log(err);
    }
  };

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const loadEvent = async () => {
    try {
      const event = await getEvent(eventId);

      setFormData({
        name: event.name || '',
        summary: event.summary || '',
        description: event.description || '',
        category: event.category || 'conference',

        startDate: event.startDate
          ? new Date(event.startDate).toISOString().slice(0, 16)
          : '',

        endDate: event.endDate
          ? new Date(event.endDate).toISOString().slice(0, 16)
          : '',

        latitude: event.location?.coordinates?.[1] || '',
        longitude: event.location?.coordinates?.[0] || '',

        venue: event.venue || '',
        address: event.location?.address || '',
        city: event.city || '',
        state: event.state || 'Lagos',

        status: event.status || 'draft',
      });

      if (event.ticketTypes) {
        setTicketTypes(event.ticketTypes);
      }

      if (event.organizers?.length > 0) {
        setSelectedOrganizer(event.organizers[0]._id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  function handleTicketChange(index, field, value) {
    const updated = [...ticketTypes];

    updated[index][field] = value;

    setTicketTypes(updated);
  }

  function addTicketType() {
    setTicketTypes([
      ...ticketTypes,
      {
        name: '',
        price: '',
        quantity: '',
      },
    ]);
  }

  function removeTicketType(index) {
    const updated = [...ticketTypes];

    updated.splice(index, 1);

    setTicketTypes(updated);
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     if (editMode) {
  //       // We'll replace this with updateEvent() later
  //       console.log('Updating event...');
  //     } else {
  //       await createEvent(
  //         formData,
  //         ticketTypes,
  //         coverImage,
  //         galleryImages,
  //         selectedOrganizer,
  //       );

  //       alert('Event created successfully!');
  //     }
  //   } catch (err) {
  //     console.log(err.response?.data);

  //     alert(err.response?.data?.message || 'Something went wrong');
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        await updateEvent(
          eventId,
          formData,
          ticketTypes,
          coverImage,
          galleryImages,
          selectedOrganizer,
        );

        alert('Event updated successfully!');
      } else {
        await createEvent(
          formData,
          ticketTypes,
          coverImage,
          galleryImages,
          selectedOrganizer,
        );

        alert('Event created successfully!');
      }
      // if (editMode) {
      //   console.log('Updating event...');
      // } else {
      //   await createEvent(
      //     formData,
      //     ticketTypes,
      //     coverImage,
      //     galleryImages,
      //     selectedOrganizer,
      //   );

      //   alert('Event created successfully!');
      // }
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Event Information */}
      <div className="rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900">
        <h2 className="mb-6 text-2xl font-bold dark:text-white">
          Event Information
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Event Name */}
          <div>
            <label className="mb-2 block font-semibold dark:text-white">
              Event Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Tech Conference 2026"
              className="w-full rounded-xl border border-slate-300 p-4 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block font-semibold dark:text-white">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-4 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="concert">Concert</option>
              <option value="conference">Conference</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="festival">Festival</option>
              <option value="sports">Sports</option>
              <option value="comedy">Comedy</option>
              <option value="religious">Religious</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6">
          <label className="mb-2 block font-semibold dark:text-white">
            Summary
          </label>

          <input
            type="text"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            placeholder="Short summary of your event"
            className="w-full rounded-xl border border-slate-300 p-4 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Description */}
        <div className="mt-6">
          <label className="mb-2 block font-semibold dark:text-white">
            Description
          </label>

          <textarea
            rows="6"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your event..."
            className="w-full rounded-xl border border-slate-300 p-4 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>
      {/* Schedule & Location */}
      <div className="rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900">
        <h2 className="mb-6 text-2xl font-bold dark:text-white">
          Schedule & Location
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Start Date */}
          <div>
            <label className="mb-2 block font-semibold dark:text-white">
              Start Date
            </label>

            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-4 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="mb-2 block font-semibold dark:text-white">
              End Date
            </label>

            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-4 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Venue */}
          <div>
            <label className="mb-2 block font-semibold dark:text-white">
              Venue
            </label>

            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              placeholder="Eko Convention Centre"
              className="w-full rounded-xl border border-slate-300 p-4 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Address */}
          <div>
            <label className="mb-2 block font-semibold dark:text-white">
              Address
            </label>

            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Victoria Island"
              className="w-full rounded-xl border border-slate-300 p-4 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* City */}
          <div>
            <label className="mb-2 block font-semibold dark:text-white">
              City
            </label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Lagos"
              className="w-full rounded-xl border border-slate-300 p-4 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* State */}
          <div>
            <label className="mb-2 block font-semibold dark:text-white">
              State
            </label>

            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-4 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option>Lagos</option>
              <option>Ogun</option>
              <option>Oyo</option>
              <option>Osun</option>
              <option>Ondo</option>
              <option>Ekiti</option>
              <option>Delta</option>
              <option>Rivers</option>
              <option>Abuja</option>
              <option>Kano</option>
              <option>Kaduna</option>
              <option>Enugu</option>
              <option>Anambra</option>
              <option>Imo</option>
              <option>Cross River</option>
              <option>Akwa Ibom</option>
              <option>Edo</option>
              <option>Kwara</option>
              <option>Others</option>
            </select>
          </div>

          {/* Latitude */}
          <div>
            <label className="mb-2 block font-semibold dark:text-white">
              Latitude
            </label>

            <input
              type="number"
              step="any"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="6.5244"
              className="w-full rounded-xl border border-slate-300 p-4 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Longitude */}
          <div>
            <label className="mb-2 block font-semibold dark:text-white">
              Longitude
            </label>

            <input
              type="number"
              step="any"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="3.3792"
              className="w-full rounded-xl border border-slate-300 p-4 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>
      </div>
      {/* Ticket Types */}
      <div className="rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold dark:text-white">Ticket Types</h2>

          <button
            type="button"
            onClick={addTicketType}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            + Add Ticket
          </button>
        </div>

        <div className="space-y-6">
          {ticketTypes.map((ticket, index) => (
            <div
              key={index}
              className="grid gap-4 rounded-2xl border border-slate-300 p-6 md:grid-cols-4 dark:border-slate-700"
            >
              {/* Ticket Name */}
              <div>
                <label className="mb-2 block font-semibold dark:text-white">
                  Ticket Name
                </label>

                <input
                  type="text"
                  value={ticket.name}
                  onChange={(e) =>
                    handleTicketChange(index, 'name', e.target.value)
                  }
                  placeholder="Regular"
                  className="w-full rounded-xl border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Price */}
              <div>
                <label className="mb-2 block font-semibold dark:text-white">
                  Price
                </label>

                <input
                  type="number"
                  value={ticket.price}
                  onChange={(e) =>
                    handleTicketChange(index, 'price', e.target.value)
                  }
                  placeholder="5000"
                  className="w-full rounded-xl border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="mb-2 block font-semibold dark:text-white">
                  Quantity
                </label>

                <input
                  type="number"
                  value={ticket.quantity}
                  onChange={(e) =>
                    handleTicketChange(index, 'quantity', e.target.value)
                  }
                  placeholder="100"
                  className="w-full rounded-xl border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Remove */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeTicketType(index)}
                  disabled={ticketTypes.length === 1}
                  className="w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Assign Organizer */}
      <div className="rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900">
        <h2 className="mb-6 text-2xl font-bold dark:text-white">
          Assign Organizer
        </h2>

        <label className="mb-2 block font-semibold dark:text-white">
          Organizer
        </label>

        <select
          value={selectedOrganizer}
          onChange={(e) => setSelectedOrganizer(e.target.value)}
          className="w-full rounded-xl border border-slate-300 p-4 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          <option value="">Select Organizer</option>

          {organizers.map((organizer) => (
            <option key={organizer._id} value={organizer._id}>
              {organizer.name} ({organizer.email})
            </option>
          ))}
        </select>
      </div>

      {/* Images */}
      <div className="rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900">
        <h2 className="mb-6 text-2xl font-bold dark:text-white">
          Event Images
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Cover Image */}
          <div>
            <label className="mb-2 block font-semibold dark:text-white">
              Cover Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="w-full rounded-xl border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Gallery Images */}
          <div>
            <label className="mb-2 block font-semibold dark:text-white">
              Gallery Images
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setGalleryImages([...e.target.files])}
              className="w-full rounded-xl border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Publish */}
      <div className="rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900">
        <h2 className="mb-6 text-2xl font-bold dark:text-white">Publish</h2>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 p-4 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="unpublished">Unpublished</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-10 py-4 text-lg font-bold text-white hover:bg-blue-700"
        >
          {editMode ? 'Update Event' : 'Create Event'}
        </button>
      </div>
    </form>
  );
}

export default EventForm;

{
  /* </form> */
}
