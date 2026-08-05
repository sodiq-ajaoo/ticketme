function TopBuyersTable({ topBuyers }) {
  return (
    <div className="mt-10 rounded-2xl bg-white p-8 shadow">
      <h2 className="mb-6 text-2xl font-bold">Top Buyers</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left">Buyer</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-center">Tickets</th>
              <th className="px-4 py-3 text-right">Spent</th>
            </tr>
          </thead>

          <tbody>
            {topBuyers.map((buyer, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-3">{buyer.name}</td>

                <td className="px-4 py-3">{buyer.email}</td>

                <td className="px-4 py-3 text-center">{buyer.tickets}</td>

                <td className="px-4 py-3 text-right">
                  ₦{buyer.spent.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopBuyersTable;
