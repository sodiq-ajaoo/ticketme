// import { CalendarDays, MapPin, Ticket, Download } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import api from '../../services/api';

// function TicketItem({ ticket }) {
//   const downloadTicket = async () => {
//     try {
//       const res = await api.get(`/tickets/${ticket._id}/download`, {
//         responseType: 'blob',
//       });

//       const url = window.URL.createObjectURL(new Blob([res.data]));

//       const link = document.createElement('a');

//       const disposition = res.headers['content-disposition'];

//       let filename = `${ticket.event?.name || 'ticket'}.pdf`;

//       if (disposition) {
//         const match = disposition.match(/filename="?([^"]+)"?/);

//         if (match) filename = match[1];
//       }

//       link.href = url;
//       link.download = filename;

//       document.body.appendChild(link);
//       link.click();
//       link.remove();

//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.log(err);
//       alert('Unable to download ticket.');
//     }
//   };

//   return (
//     <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl dark:border-slate-700 dark:bg-slate-900">
//       <div className="flex flex-col md:flex-row">
//         <img
//           src={ticket.event?.imageCover}
//           alt={ticket.event?.name}
//           className="h-60 w-full object-cover md:h-auto md:w-72"
//         />

//         <div className="flex flex-1 flex-col justify-between p-6">
//           <div>
//             <h2 className="text-3xl font-bold dark:text-white">
//               {ticket.event?.name}
//             </h2>

//             <div className="mt-6 space-y-4 text-slate-600 dark:text-slate-300">
//               <div className="flex items-center gap-3">
//                 <CalendarDays size={18} />

//                 {new Date(ticket.event?.startDate).toLocaleDateString()}
//               </div>

//               <div className="flex items-center gap-3">
//                 <MapPin size={18} />
//                 {ticket.event?.venue}, {ticket.event?.city},{' '}
//                 {ticket.event?.state}
//               </div>

//               <div className="flex items-center gap-3">
//                 <Ticket size={18} />

//                 {ticket.ticketTypeName}
//               </div>

//               <div>
//                 <span className="font-semibold">Ticket Code</span>

//                 <p className="font-mono text-blue-600 dark:text-blue-400">
//                   {ticket.ticketCode}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//             <span
//               className={`inline-flex w-fit rounded-full px-4 py-2 font-semibold ${
//                 ticket.status === 'paid'
//                   ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
//                   : ticket.status === 'used'
//                     ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
//                     : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
//               }`}
//             >
//               {ticket.status}
//             </span>

//             <div className="flex flex-col gap-3 sm:flex-row">
//               <button
//                 onClick={downloadTicket}
//                 className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
//               >
//                 <Download size={18} />
//                 Download
//               </button>

//               <Link
//                 to={`/my-tickets/${ticket._id}`}
//                 className="rounded-xl border border-slate-300 px-6 py-3 text-center font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
//               >
//                 View Ticket
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TicketItem;

import { CalendarDays, MapPin, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';

function TicketItem({ ticket }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-col md:flex-row">
        <img
          src={ticket.event?.imageCover}
          alt={ticket.event?.name}
          className="h-52 w-full object-cover md:h-auto md:w-72"
        />

        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <h2 className="text-2xl font-bold dark:text-white">
              {ticket.event?.name}
            </h2>

            <div className="mt-5 space-y-3 text-slate-500 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CalendarDays size={18} />
                {new Date(ticket.event?.startDate).toLocaleDateString()}
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={18} />
                {ticket.event?.venue}, {ticket.event?.city}
              </div>

              <div className="flex items-center gap-2">
                <Ticket size={18} />
                {ticket.ticketTypeName}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <span
              className={`inline-flex w-fit rounded-full px-4 py-2 font-semibold ${
                ticket.status === 'paid'
                  ? 'bg-green-100 text-green-700'
                  : ticket.status === 'checked-in'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-red-100 text-red-700'
              }`}
            >
              {ticket.status}
            </span>

            <Link
              to={`/my-tickets/${ticket._id}`}
              className="rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
            >
              View Ticket
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketItem;
