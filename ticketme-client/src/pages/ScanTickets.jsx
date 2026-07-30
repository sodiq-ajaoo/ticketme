import OrganizerLayout from '../components/organizer/OrganizerLayout';
import { ScanLine } from 'lucide-react';

function ScanTickets() {
  return (
    <OrganizerLayout>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-black">Scan Tickets</h1>

        <p className="mt-2 text-slate-500">
          Scan attendee QR codes to validate tickets.
        </p>

        <div className="mt-10 rounded-3xl bg-white p-10 shadow-sm dark:bg-slate-900">
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 p-20">
            <ScanLine size={80} className="text-blue-600" />

            <h2 className="mt-6 text-2xl font-bold">Camera Scanner</h2>

            <p className="mt-2 text-center text-slate-500">
              Your camera will appear here after we connect the QR scanner.
            </p>

            <button className="mt-8 rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white hover:bg-blue-700">
              Start Scanner
            </button>
          </div>
        </div>
      </div>
    </OrganizerLayout>
  );
}

export default ScanTickets;
