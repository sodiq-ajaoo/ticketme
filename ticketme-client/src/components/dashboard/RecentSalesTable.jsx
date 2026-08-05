function RecentSalesTable({ recentSales }) {
  return (
    <div className="mt-10 rounded-2xl bg-white p-8 shadow">
      <h2 className="mb-6 text-2xl font-bold">Recent Ticket Sales</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left">Buyer</th>
              <th className="px-4 py-3 text-left">Ticket</th>
              <th className="px-4 py-3 text-center">Qty</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Date</th>
            </tr>
          </thead>

          <tbody>
            {recentSales.map((sale) => (
              <tr key={sale._id} className="border-b">
                <td className="px-4 py-3">{sale.buyer?.name}</td>

                <td className="px-4 py-3">{sale.ticketTypeName}</td>

                <td className="px-4 py-3 text-center">{sale.quantity}</td>

                <td className="px-4 py-3 text-right">
                  ₦{sale.totalPrice.toLocaleString()}
                </td>

                <td className="px-4 py-3 text-center">{sale.status}</td>

                <td className="px-4 py-3 text-right">
                  {new Date(sale.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentSalesTable;
