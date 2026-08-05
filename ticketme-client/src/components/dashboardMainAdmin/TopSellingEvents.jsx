function TopSellingEvents({ events }) {
  return (
    <>
      <h2 className="mb-6 text-2xl font-bold">Top Selling Events</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Event</th>
              <th className="px-4 py-3 text-center">Tickets</th>
              <th className="px-4 py-3 text-right">Revenue</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-3">{event.name}</td>

                <td className="px-4 py-3 text-center">{event.ticketsSold}</td>

                <td className="px-4 py-3 text-right">
                  ₦{event.revenue.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default TopSellingEvents;
