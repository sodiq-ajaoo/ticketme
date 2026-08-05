import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#ca8a04', '#7c3aed'];

function RevenuePieChart({ ticketRevenue }) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="mb-6 text-2xl font-bold">Revenue by Ticket Type</h2>

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={ticketRevenue}
            dataKey="revenue"
            nameKey="name"
            outerRadius={120}
            label
          >
            {ticketRevenue.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) => `₦${Number(value).toLocaleString()}`}
          />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenuePieChart;
