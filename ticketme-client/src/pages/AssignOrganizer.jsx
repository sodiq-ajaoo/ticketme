import { useEffect, useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/ui/Spinner';
import AdminLayout from '../components/admin/AdminLayout';

function AssignOrganizer() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await api.get('/users');

      const normalUsers = res.data.data.users.filter(
        (user) => user.role === 'user',
      );

      setUsers(normalUsers);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function assignOrganizer(id) {
    try {
      await api.patch(`/users/${id}`, {
        role: 'organizer',
      });

      setUsers((prev) => prev.filter((user) => user._id !== id));

      alert('User promoted to Organizer.');
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || 'Unable to assign organizer.');
    }
  }

  const filtered = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner text="Loading users..." />
      </div>
    );
  }

  return (
    <AdminLayout>
      <Link
        to="/admin/organizers"
        className="mb-8 inline-flex items-center gap-2 text-blue-600 hover:underline"
      >
        <ArrowLeft size={18} />
        Back
      </Link>

      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-black dark:text-white">
          Assign Organizer
        </h1>

        <div className="relative w-80">
          <Search size={18} className="absolute left-4 top-4 text-slate-400" />

          <input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border py-3 pl-11 pr-4"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-6 py-5 text-left">User</th>
              <th>Email</th>
              <th>Phone</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="px-6 py-5 font-semibold">{user.name}</td>

                <td>{user.email}</td>

                <td>{user.phone || '-'}</td>

                <td className="text-center">
                  <button
                    onClick={() => assignOrganizer(user._id)}
                    className="rounded-xl bg-green-600 px-5 py-2 font-bold text-white hover:bg-green-700"
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default AssignOrganizer;
