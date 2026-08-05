// import { CheckCircle2 } from 'lucide-react';
// import TicketCard from '../components/tickets/TicketCard';
// import QRCodeCard from '../components/tickets/QRCodeCard';
// import { Link } from 'react-router-dom';

// function PaymentSuccess() {
//   return (
//     <section className="bg-slate-50 py-16 dark:bg-slate-950">
//       <div className="mx-auto max-w-4xl px-6">
//         <div className="rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900">
//           <div className="text-center">
//             <CheckCircle2 size={80} className="mx-auto text-green-500" />

//             <h1 className="mt-6 text-4xl font-black">Payment Successful</h1>

//             <p className="mt-3 text-slate-500">
//               Your ticket has been booked successfully.
//             </p>
//           </div>

//           <div className="mt-10 grid gap-8 lg:grid-cols-2">
//             <TicketCard />

//             <QRCodeCard />
//           </div>

//           <div className="mt-10 flex flex-col gap-4 md:flex-row">
//             <button className="flex-1 rounded-2xl bg-blue-600 py-4 font-bold text-white hover:bg-blue-700">
//               Download Ticket
//             </button>

//             <Link
//               to="/my-tickets"
//               className="flex-1 rounded-2xl border border-slate-300 py-4 text-center font-bold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
//             >
//               My Tickets
//             </Link>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default PaymentSuccess;

// import { useEffect } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import api from '../services/api';

// function PaymentSuccess() {
//   const [searchParams] = useSearchParams();

//   useEffect(() => {
//     const verify = async () => {
//       try {
//         const reference = searchParams.get('reference');

//         const res = await api.get(`/payments/verify/${reference}`);

//         console.log(res.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     verify();
//   }, []);

//   return (
//     <div className="flex h-screen items-center justify-center">
//       <h1 className="text-3xl font-bold">Verifying Payment...</h1>
//     </div>
//   );
// }

// export default PaymentSuccess;

import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';

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
        console.log(res.data);

        setPayment(res.data.data.payment);
        setTickets(res.data.data.tickets);
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
        <h2 className="text-2xl font-bold">Verifying payment...</h2>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="rounded-3xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-green-600">
            Payment Successful 🎉
          </h1>

          <p className="mt-3 text-slate-500">Your tickets are ready.</p>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Payment</h2>

          <p>
            <strong>Reference:</strong> {payment.reference}
          </p>

          <p>
            <strong>Amount:</strong> ₦{payment.amount.toLocaleString()}
          </p>
        </div>

        <div className="space-y-6">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="rounded-2xl border p-6">
              <h3 className="text-xl font-bold">{ticket.ticketTypeName}</h3>

              <p>Event: {ticket.event.name}</p>

              <p>Quantity: {ticket.quantity}</p>

              <p>
                Ticket Code:
                <br />
                <span className="font-mono text-sm">{ticket.ticketCode}</span>
              </p>

              <img
                src={ticket.qrCode}
                alt="QR Code"
                className="mt-5 h-52 w-52"
              />
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/my-tickets"
            className="rounded-xl bg-blue-600 px-8 py-4 font-bold text-white"
          >
            View My Tickets
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
