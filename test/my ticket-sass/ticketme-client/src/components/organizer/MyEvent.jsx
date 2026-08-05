import EventCard from './EventCard';

const events = [
  {
    id: 1,
    title: 'Summer Music Festival',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200',
    venue: 'Lagos',
    date: 'July 28, 2026',
    sold: 580,
    revenue: '15,400',
    status: 'Live',
  },
  {
    id: 2,
    title: 'Comedy Night',
    image:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200',
    venue: 'Abuja',
    date: 'August 15, 2026',
    sold: 220,
    revenue: '4,800',
    status: 'Live',
  },
];

function MyEvents() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-black">My Events</h1>

        <p className="mt-2 text-slate-500">
          Events assigned to you by the administrator.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

export default MyEvents;
