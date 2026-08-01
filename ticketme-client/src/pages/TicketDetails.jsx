import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Download,
  Ticket,
} from 'lucide-react';

import api from '../services/api';
import Spinner from '../components/ui/Spinner';

function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTicket();
  }, []);

  async function fetchTicket() {
    try {
      const res = await api.get(`/tickets/my-tickets/${id}`);

      setTicket(res.data.data.ticket);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function downloadTicket() {
    try {
      const res = await api.get(`/tickets/${ticket._id}/download`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement('a');

      const disposition = res.headers['content-disposition'];

      let filename = `${ticket.event.name}.pdf`;

      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);

        if (match) filename = match[1];
      }

      link.href = url;
      link.download = filename;

      document.body.appendChild(link);
      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
      alert('Unable to download ticket.');
    }
  }

  async function cancelTicket() {
    if (!window.confirm('Cancel this ticket?')) return;

    try {
      await api.patch(`/tickets/${ticket._id}/cancel`);

      alert('Ticket cancelled.');

      navigate('/my-tickets');
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to cancel ticket.');
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner text="Loading ticket..." />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Ticket not found.
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-slate-100 py-14 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl px-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 rounded-xl border px-5 py-3 font-semibold hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="overflow-hidden rounded-3xl bg-white shadow-xl dark:bg-slate-900">
          <img
            src={ticket.event.imageCover}
            alt={ticket.event.name}
            className="h-72 w-full object-cover"
          />

          <div className="grid gap-10 p-8 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl font-black dark:text-white">
                {ticket.event.name}
              </h1>

              <div className="mt-8 space-y-5 text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-3">
                  <CalendarDays size={20} />
                  {new Date(ticket.event.startDate).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-3">
                  <MapPin size={20} />
                  {ticket.event.venue}, {ticket.event.city},{' '}
                  {ticket.event.state}
                </div>

                <div className="flex items-center gap-3">
                  <Ticket size={20} />
                  {ticket.ticketTypeName}
                </div>

                <div>
                  <h3 className="font-bold">Ticket Code</h3>

                  <p className="font-mono text-blue-600">{ticket.ticketCode}</p>
                </div>

                <div>
                  <h3 className="font-bold">Quantity</h3>

                  <p>{ticket.quantity}</p>
                </div>

                <div>
                  <h3 className="font-bold">Status</h3>

                  <span
                    className={`inline-block rounded-full px-4 py-2 mt-2 font-semibold ${
                      ticket.status === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : ticket.status === 'checked-in'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="rounded-3xl bg-white p-5 shadow dark:bg-slate-800">
                <img src={ticket.qrCode} alt="QR Code" className="h-72 w-72" />
              </div>

              <button
                onClick={downloadTicket}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white hover:bg-blue-700"
              >
                <Download size={18} />
                Download Ticket
              </button>

              {ticket.status === 'paid' && (
                <button
                  onClick={cancelTicket}
                  className="mt-4 w-full rounded-xl bg-red-600 py-4 font-bold text-white hover:bg-red-700"
                >
                  Cancel Ticket
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TicketDetails;
