import {
  Users,
  CalendarDays,
  Ticket,
  DollarSign,
  Clock3,
  CheckCircle2,
} from 'lucide-react';

function SummaryCards({ stats }) {
  const cards = [
    {
      title: 'Total Users',
      value: stats.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-600',
    },
    {
      title: 'Total Events',
      value: stats.totalEvents || 0,
      icon: CalendarDays,
      color: 'bg-purple-600',
    },
    {
      title: 'Tickets Sold',
      value: stats.ticketsSold || 0,
      icon: Ticket,
      color: 'bg-green-600',
    },
    {
      title: 'Revenue',
      value: `₦${Number(stats.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-orange-600',
    },
    {
      title: 'Upcoming Events',
      value: stats.upcomingEvents || 0,
      icon: Clock3,
      color: 'bg-pink-600',
    },
    {
      title: 'Checked In',
      value: stats.checkedIn || 0,
      icon: CheckCircle2,
      color: 'bg-emerald-600',
    },
  ];

  return (
    <>
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-3xl bg-white p-6 shadow dark:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500">{card.title}</p>

              <h2 className="mt-2 text-3xl font-black dark:text-white">
                {card.value}
              </h2>
            </div>

            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.color}`}
            >
              <card.icon className="text-white" size={28} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default SummaryCards;
