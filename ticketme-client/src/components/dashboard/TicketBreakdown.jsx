function TicketBreakdown({ ticketBreakdown }) {
  return (
    <div className="mt-10 rounded-2xl bg-white p-8 shadow">
      <h2 className="mb-6 text-2xl font-bold">Ticket Breakdown</h2>

      <div className="space-y-6">
        {ticketBreakdown.map((ticket) => (
          <div key={ticket.id}>
            <div className="mb-2 flex justify-between">
              <span className="font-semibold">{ticket.name}</span>

              <span>
                {ticket.sold} / {ticket.quantity}
              </span>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{
                  width: `${ticket.percentage}%`,
                }}
              />
            </div>

            <div className="mt-2 flex justify-between text-sm text-slate-500">
              <span>Remaining: {ticket.remaining}</span>

              <span>{ticket.percentage}% Sold</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TicketBreakdown;
