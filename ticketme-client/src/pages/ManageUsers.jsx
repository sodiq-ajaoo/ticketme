import { useEffect, useState } from 'react';
import { Search, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/ui/Spinner';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await api.get('/users');
      setUsers(res.data.data.users || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()),
  );

  const copyId = (id) => {
    navigator.clipboard.writeText(id);
    alert('User ID copied!');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner text="Loading users..." />
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-slate-100 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-black dark:text-white">Manage Users</h1>

          <div className="relative w-80">
            <Search
              size={18}
              className="absolute left-4 top-4 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border py-3 pl-11 pr-4 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-xl dark:bg-slate-900">
          <table className="w-full">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr className="text-left">
                <th className="px-6 py-5">User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>User ID</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-t dark:border-slate-800">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          user.photo ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name,
                          )}`
                        }
                        alt={user.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />

                      <span className="font-semibold dark:text-white">
                        {user.name}
                      </span>
                    </div>
                  </td>

                  <td className="text-slate-500">{user.email}</td>

                  <td>
                    <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                      {user.role}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        user.active !== false
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.active !== false ? 'Active' : 'Suspended'}
                    </span>
                  </td>

                  <td>
                    <button
                      onClick={() => copyId(user._id)}
                      className="font-mono text-sm text-blue-600 hover:underline"
                      title="Click to copy full ID"
                    >
                      {user._id.slice(0, 8)}...
                    </button>
                  </td>

                  <td>
                    <div className="flex justify-center">
                      <Link
                        to={`/admin/users/${user._id}/edit`}
                        className="rounded-lg p-3 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Edit User"
                      >
                        <Pencil size={18} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default ManageUsers;
