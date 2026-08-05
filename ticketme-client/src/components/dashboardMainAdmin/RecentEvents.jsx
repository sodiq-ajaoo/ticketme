function RecentEvents({ events }) {
  return (
    <>
      <h2 className="mb-6 text-2xl font-bold">Recent Events</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Event</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Start Date</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <tr key={event._id} className="border-b">
                <td className="px-4 py-3">{event.name}</td>

                <td className="px-4 py-3 capitalize">{event.status}</td>

                <td className="px-4 py-3">
                  {new Date(event.startDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default RecentEvents;
