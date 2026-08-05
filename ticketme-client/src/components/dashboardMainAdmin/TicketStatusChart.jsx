import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
} from 'recharts';

const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#ca8a04'];

function TicketStatusChart({ data }) {
  return (
    <>
      <h2 className="mb-6 text-2xl font-bold">Ticket Status</h2>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="_id"
            outerRadius={110}
            label
          >
            {data.map((item, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
}

export default TicketStatusChart;
