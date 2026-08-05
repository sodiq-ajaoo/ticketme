import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const MONTHS = [
  '',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function RevenueChart({ data }) {
  const chartData = data.map((item) => ({
    month: MONTHS[item._id.month],
    revenue: item.revenue,
  }));

  return (
    <>
      <h2 className="mb-6 text-2xl font-bold">Revenue Trend</h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip formatter={(v) => `₦${v.toLocaleString()}`} />

          <Line dataKey="revenue" stroke="#2563eb" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

export default RevenueChart;
