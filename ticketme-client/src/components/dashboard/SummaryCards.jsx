function SummaryCards({ stats }) {
  return (
    <div className="grid gap-6 md:grid-cols-5">
      <div className="rounded-xl bg-white p-6 shadow">
        <h3>Total Tickets</h3>
        <p className="text-3xl font-bold">{stats.totalTickets}</p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <h3>Sold</h3>
        <p className="text-3xl font-bold">{stats.ticketsSold}</p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <h3>Remaining</h3>
        <p className="text-3xl font-bold">{stats.ticketsRemaining}</p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <h3>Checked In</h3>
        <p className="text-3xl font-bold">{stats.checkedIn}</p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <h3>Revenue</h3>
        <p className="text-3xl font-bold">
          ₦{stats.totalRevenue.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default SummaryCards;
