import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

function SalesTrendChart({ salesTrend }) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="mb-6 text-2xl font-bold">Ticket Sales Trend</h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={salesTrend}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="_id" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="ticketsSold"
            stroke="#2563eb"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SalesTrendChart;
