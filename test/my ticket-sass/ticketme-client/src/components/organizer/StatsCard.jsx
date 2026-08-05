function StatsCard({ title, value }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900">
      <p className="text-slate-500">{title}</p>

      <h2 className="mt-3 text-4xl font-black text-blue-600">{value}</h2>
    </div>
  );
}

export default StatsCard;
