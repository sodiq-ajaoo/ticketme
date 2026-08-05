import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import SummaryCards from '../components/dashboard/SummaryCards';
import SalesTrendChart from '../components/dashboard/SalesTrendChart';
import RevenuePieChart from '../components/dashboard/RevenuePieChart';
import AttendeeStatusChart from '../components/dashboard/AttendeeStatusChart';
import RecentSalesTable from '../components/dashboard/RecentSalesTable';
import TopBuyersTable from '../components/dashboard/TopBuyersTable';
import TicketBreakdown from '../components/dashboard/TicketBreakdown';
// import { getEventAnalytics } from '../api/eventApi';
import {
  getEventAnalytics,
  getSalesTrend,
  getAttendeeStatus,
  getTopBuyers,
  getRevenueByTicketType,
} from '../api/eventApi';
// import { getAttendeeStatus } from '../api/eventApi';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
// } from 'recharts';

// import {
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
// } from 'recharts';

// import { getSalesTrend } from '../api/eventApi';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from 'recharts';

function EventAnalytics() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [stats, setStats] = useState(null);
  const [ticketBreakdown, setTicketBreakdown] = useState([]);
  const [salesTrend, setSalesTrend] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [attendeeStatus, setAttendeeStatus] = useState([]);
  const [topBuyers, setTopBuyers] = useState([]);
  const [ticketRevenue, setTicketRevenue] = useState([]);

  useEffect(() => {
    loadEvent();
  }, []);

  const loadEvent = async () => {
    const res = await getEventAnalytics(id);
    const trend = await getSalesTrend(id);
    const status = await getAttendeeStatus(id);
    const buyers = await getTopBuyers(id);
    const revenue = await getRevenueByTicketType(id);

    console.log('Sales Trend:', trend.sales);

    setEvent(res.event);
    setStats(res.stats);
    setTicketBreakdown(res.ticketBreakdown);
    setSalesTrend(trend.sales);
    setRecentSales(res.recentSales || []);
    setAttendeeStatus(status.status);
    setTopBuyers(buyers.buyers);
    setTicketRevenue(revenue.revenue);

    // setAttendeeStatus(status.status);
    // const trend = await getSalesTrend(id);
  };

  // if (!event) return <p>Loading...</p>;
  if (!event || !stats) return <p>Loading...</p>;

  return (
    <AdminLayout>
      <h1 className="mb-8 text-3xl font-bold">{event.name}</h1>

      {/* Summary Cards */}
      <SummaryCards stats={stats} />

      {/* Charts */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <SalesTrendChart salesTrend={salesTrend} />

        <AttendeeStatusChart attendeeStatus={attendeeStatus} />
      </div>

      {/* Revenue & Ticket Breakdown */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <RevenuePieChart ticketRevenue={ticketRevenue} />

        <TicketBreakdown ticketBreakdown={ticketBreakdown} />
      </div>

      {/* Recent Sales */}
      <RecentSalesTable recentSales={recentSales} />

      {/* Top Buyers */}
      <TopBuyersTable topBuyers={topBuyers} />
    </AdminLayout>
  );
}

export default EventAnalytics;
