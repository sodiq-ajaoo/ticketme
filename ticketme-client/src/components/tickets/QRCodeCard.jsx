function QRCodeCard() {
  return (
    <div className="rounded-3xl border border-slate-200 p-6 text-center dark:border-slate-700">
      <h2 className="mb-6 text-2xl font-bold">Entry QR Code</h2>

      <img
        src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=TicketMe-Order-2026001"
        alt="QR Code"
        className="mx-auto rounded-xl"
      />

      <p className="mt-5 text-sm text-slate-500">
        Present this QR code at the entrance.
      </p>
    </div>
  );
}

export default QRCodeCard;
