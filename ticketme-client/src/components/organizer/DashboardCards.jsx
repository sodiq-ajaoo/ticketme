import StatsCard from './StatsCard';

function DashboardCards() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard title="Revenue" value="$12,450" />

      <StatsCard title="Tickets Sold" value="520" />

      <StatsCard title="Events" value="8" />

      <StatsCard title="Customers" value="384" />
    </div>
  );
}

export default DashboardCards;
