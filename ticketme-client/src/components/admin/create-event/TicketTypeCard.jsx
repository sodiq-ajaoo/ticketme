function TicketTypeCard() {
  return (
    <div className="grid gap-4 rounded-2xl border p-5 md:grid-cols-3">
      <input placeholder="Ticket Name" className="rounded-xl border p-3" />

      <input
        placeholder="Price"
        type="number"
        className="rounded-xl border p-3"
      />

      <input
        placeholder="Quantity"
        type="number"
        className="rounded-xl border p-3"
      />
    </div>
  );
}

export default TicketTypeCard;
