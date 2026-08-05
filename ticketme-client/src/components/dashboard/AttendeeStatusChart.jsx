import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = [
  '#2563eb', // paid
  '#16a34a', // checked-in
  '#dc2626', // cancelled
  '#ca8a04', // reserved
];

function AttendeeStatusChart({ attendeeStatus }) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <h2 className="mb-6 text-2xl font-bold">Attendee Status</h2>

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={attendeeStatus}
            dataKey="value"
            nameKey="_id"
            outerRadius={120}
            label
          >
            {attendeeStatus.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AttendeeStatusChart;
