import { ArrowRight, CalendarDays } from 'lucide-react';

function HeroContent() {
  return (
    <div className="max-w-xl">
      <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
        Discover Amazing Events
      </span>

      <h1 className="mt-6 text-5xl font-black leading-tight text-slate-900 dark:text-white lg:text-6xl">
        Discover unforgettable{' '}
        <span className="text-blue-600">live experiences</span>
      </h1>

      <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
        Book concerts, festivals, conferences, sports and exclusive events all
        in one place.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <button className="flex items-center gap-2 rounded-2xl bg-blue-600 px-7 py-4 font-semibold text-white transition hover:bg-blue-700">
          Browse Events
          <ArrowRight size={18} />
        </button>

        <button className="flex items-center gap-2 rounded-2xl border border-slate-300 px-7 py-4 font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
          <CalendarDays size={18} />
          Become Organizer
        </button>
      </div>
    </div>
  );
}

export default HeroContent;
