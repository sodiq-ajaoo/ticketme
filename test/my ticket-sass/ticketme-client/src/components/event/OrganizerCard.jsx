import { BadgeCheck } from 'lucide-react';

function OrganizerCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-5 text-2xl font-bold">Organizer</h2>

      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-blue-600" />

        <div>
          <h3 className="text-xl font-bold">Afrobeats Entertainment</h3>

          <div className="mt-2 flex items-center gap-2 text-green-600">
            <BadgeCheck size={18} />
            Verified Organizer
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizerCard;
