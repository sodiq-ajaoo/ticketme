function RecentOrders() {
  const orders = [
    {
      name: 'John Doe',
      ticket: 'VIP',
      status: 'Paid',
    },
    {
      name: 'Sarah',
      ticket: 'Regular',
      status: 'Paid',
    },
    {
      name: 'David',
      ticket: 'Student',
      status: 'Paid',
    },
  ];

  return (
    <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900">
      <h2 className="mb-6 text-2xl font-bold">Recent Orders</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.name}
            className="flex items-center justify-between rounded-xl bg-slate-100 p-4 dark:bg-slate-800"
          >
            <div>
              <h3 className="font-bold">{order.name}</h3>

              <p className="text-slate-500">{order.ticket}</p>
            </div>

            <span className="rounded-full bg-green-100 px-4 py-2 text-green-700">
              {order.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentOrders;
