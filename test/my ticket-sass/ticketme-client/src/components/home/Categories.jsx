import {
  Music2,
  Trophy,
  Drama,
  Mic2,
  Sparkles,
  Briefcase,
  Users,
  PartyPopper,
} from 'lucide-react';

const categories = [
  {
    name: 'Concerts',
    icon: Music2,
    total: '120 Events',
  },
  {
    name: 'Sports',
    icon: Trophy,
    total: '84 Events',
  },
  {
    name: 'Theatre',
    icon: Drama,
    total: '45 Events',
  },
  {
    name: 'Comedy',
    icon: Mic2,
    total: '60 Events',
  },
  {
    name: 'Festival',
    icon: PartyPopper,
    total: '52 Events',
  },
  {
    name: 'Conference',
    icon: Briefcase,
    total: '38 Events',
  },
  {
    name: 'Networking',
    icon: Users,
    total: '29 Events',
  },
  {
    name: 'Special',
    icon: Sparkles,
    total: '18 Events',
  },
];

function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-20 pb-12">
      <div className="mb-10">
        <h2 className="text-4xl font-black">Browse Categories</h2>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Find events that match your interests.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <div
              key={category.name}
              className="group cursor-pointer rounded-3xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-900/30">
                <Icon size={28} />
              </div>

              <h3 className="text-lg font-bold">{category.name}</h3>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {category.total}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Categories;
