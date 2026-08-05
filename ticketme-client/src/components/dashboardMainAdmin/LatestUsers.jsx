function LatestUsers({ users }) {
  return (
    <>
      <h2 className="mb-6 text-2xl font-bold">Latest Users</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>

              <th className="px-4 py-3 text-left">Email</th>

              <th className="px-4 py-3 text-right">Joined</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b">
                <td className="px-4 py-3">{user.name}</td>

                <td className="px-4 py-3">{user.email}</td>

                <td className="px-4 py-3 text-right">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default LatestUsers;
