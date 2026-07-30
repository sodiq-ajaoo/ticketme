function TicketCard() {
  return (
    <div className="rounded-3xl border border-slate-200 p-6 dark:border-slate-700">
      <h2 className="text-2xl font-bold">Summer Music Festival</h2>

      <p className="mt-4 text-slate-500">VIP Ticket</p>

      <div className="mt-8 space-y-3">
        <div className="flex justify-between">
          <span>Date</span>
          <span>July 28, 2026</span>
        </div>

        <div className="flex justify-between">
          <span>Venue</span>
          <span>Lagos</span>
        </div>

        <div className="flex justify-between">
          <span>Order</span>
          <span>#TKM-2026001</span>
        </div>
      </div>
    </div>
  );
}

export default TicketCard;
