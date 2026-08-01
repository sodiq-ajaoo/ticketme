import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/ui/Spinner';
// import jsPDF from 'jspdf';

function PaymentSuccess() {
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState(null);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const reference = searchParams.get('reference');

        if (!reference) return;

        const res = await api.get(`/payments/verify/${reference}`);

        setPayment(res.data.data.payment);
        console.log(res.data.data.payment);
        setTickets(res.data.data.tickets || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner text="Verifying your payment..." />
      </div>
    );
  }

  // const downloadTicket = (ticket) => {
  //   const doc = new jsPDF();

  //   doc.setFontSize(22);
  //   doc.text('TicketMe', 20, 20);

  //   doc.setFontSize(18);
  //   doc.text(ticket.event.name, 20, 40);

  //   doc.setFontSize(12);

  //   doc.text(`Ticket Type: ${ticket.ticketTypeName}`, 20, 60);
  //   doc.text(`Quantity: ${ticket.quantity}`, 20, 70);
  //   doc.text(`Ticket Code: ${ticket.ticketCode}`, 20, 80);

  //   doc.text(
  //     `Date: ${new Date(ticket.event.startDate).toLocaleDateString()}`,
  //     20,
  //     90,
  //   );

  //   doc.text(`Venue: ${ticket.event.venue}`, 20, 100);

  //   doc.text(`${ticket.event.city}, ${ticket.event.state}`, 20, 110);

  //   if (ticket.qrCode) {
  //     doc.addImage(ticket.qrCode, 'PNG', 130, 40, 50, 50);
  //   }

  //   doc.setDrawColor(0);
  //   doc.line(20, 125, 190, 125);

  //   doc.setTextColor(100);

  //   doc.text('Present this QR code at the entrance for verification.', 20, 140);

  //   doc.save(`${ticket.event.name}.pdf`);
  // };

  const downloadTicket = async (ticketId) => {
    try {
      const res = await api.get(`/tickets/${ticketId}/download`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement('a');
      link.href = url;

      const disposition = res.headers['content-disposition'];

      let filename = `ticket-${ticketId}.pdf`;

      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match) filename = match[1];
      }

      link.download = filename;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Unable to download ticket.');
    }
  };
  return (
    <section className="min-h-screen bg-slate-100 py-14 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl px-6">
        <div className="rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900">
          {/* Success Header */}

          <div className="mb-10 text-center">
            <h1 className="text-4xl font-black text-green-600">
              Payment Successful 🎉
            </h1>

            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Your payment has been confirmed and your tickets are now active.
            </p>
          </div>

          {/* Payment Info */}

          <div className="mb-10 rounded-2xl bg-slate-100 p-6 dark:bg-slate-800">
            <h2 className="mb-5 text-2xl font-bold dark:text-white">
              Payment Details
            </h2>

            <div className="space-y-2 text-slate-700 dark:text-slate-300">
              <p>
                <strong>Reference:</strong> {payment?.reference}
              </p>

              {/* <p>
                <strong>Amount:</strong> ₦{payment?.amount?.toLocaleString()}
              </p> */}

              <p>
                <strong>Amount:</strong> ₦
                {Number(payment?.amount || 0).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                <span className="font-bold text-green-600">
                  {payment?.status}
                </span>
              </p>
            </div>
          </div>

          {/* Tickets */}

          {/* Tickets */}

          <h2 className="mb-6 text-3xl font-bold dark:text-white">
            Your Tickets
          </h2>

          <div className="space-y-8">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="grid gap-8 md:grid-cols-2">
                  {/* Left */}

                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {ticket.ticketTypeName}
                    </h3>

                    <div className="mt-5 space-y-3 text-slate-600 dark:text-slate-300">
                      <p>
                        <strong>Event:</strong> {ticket.event?.name}
                      </p>

                      <p>
                        <strong>Quantity:</strong> {ticket.quantity}
                      </p>

                      <p>
                        <strong>Ticket Code:</strong>
                        <br />
                        <span className="font-mono text-blue-600 dark:text-blue-400">
                          {ticket.ticketCode}
                        </span>
                      </p>
                    </div>

                    <button
                      onClick={() => downloadTicket(ticket._id)}
                      className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700"
                    >
                      Download Ticket
                    </button>
                  </div>

                  {/* Right */}

                  <div className="flex justify-center md:justify-end">
                    <div className="rounded-2xl bg-white p-4 shadow dark:bg-slate-900">
                      <img
                        src={ticket.qrCode}
                        alt="QR Code"
                        className="h-56 w-56"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              to="/my-tickets"
              className="rounded-2xl border border-slate-300 px-10 py-4 text-center font-bold transition hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
            >
              View My Tickets
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PaymentSuccess;
