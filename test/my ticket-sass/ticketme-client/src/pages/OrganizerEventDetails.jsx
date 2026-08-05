import OrganizerLayout from '../components/organizer/OrganizerLayout';
import { CalendarDays, MapPin, Ticket, DollarSign, Users } from 'lucide-react';

function OrganizerEventDetails() {
  return (
    <OrganizerLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black">Summer Music Festival</h1>

          <p className="mt-2 text-slate-500">Everything about this event.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <Ticket className="mb-4 text-blue-600" />
            <h2 className="text-3xl font-black">580</h2>
            <p>Tickets Sold</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <DollarSign className="mb-4 text-green-600" />
            <h2 className="text-3xl font-black">$15,400</h2>
            <p>Revenue</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <Users className="mb-4 text-purple-600" />
            <h2 className="text-3xl font-black">580</h2>
            <p>Attendees</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <CalendarDays className="mb-4 text-orange-600" />
            <h2 className="text-3xl font-black">Live</h2>
            <p>Status</p>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold">Event Information</h2>

          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <CalendarDays size={20} />
              July 28, 2026
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={20} />
              Lagos
            </div>
          </div>
        </div>
      </div>
    </OrganizerLayout>
  );
}

export default OrganizerEventDetails;
