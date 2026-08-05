import TicketItem from '../components/tickets/TicketItem';

const tickets = [
  {
    id: 1,
    title: 'Summer Music Festival',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800',
    date: 'July 28, 2026',
    location: 'Lagos',
    type: 'VIP',
    status: 'Paid',
  },
  {
    id: 2,
    title: 'Comedy Night',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
    date: 'August 10, 2026',
    location: 'Abuja',
    type: 'Regular',
    status: 'Paid',
  },
];

function MyTickets() {
  return (
    <section className="bg-slate-50 py-16 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="mb-10 text-4xl font-black">My Tickets</h1>

        <div className="space-y-6">
          {tickets.map((ticket) => (
            <TicketItem key={ticket.id} ticket={ticket} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default MyTickets;
