import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Pencil } from 'lucide-react';
import api from '../services/api';
import Spinner from '../components/ui/Spinner';
import AdminLayout from '../components/admin/AdminLayout';

function ManageOrganizers() {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchOrganizers();
  }, []);

  async function fetchOrganizers() {
    try {
      const res = await api.get('/users');

      const users = res.data.data.users || [];

      setOrganizers(users.filter((u) => u.role === 'organizer'));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = organizers.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner text="Loading organizers..." />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-black dark:text-white">
          Manage Organizers
        </h1>

        <Link
          to="/admin/organizers/assign"
          className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white"
        >
          + Assign Organizer
        </Link>
      </div>

      <div className="mb-6 relative w-80">
        <Search size={18} className="absolute left-4 top-4 text-slate-400" />

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border py-3 pl-11 pr-4"
        />
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-6 py-5 text-left">Organizer</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="px-6 py-5 font-semibold">{user.name}</td>

                <td>{user.email}</td>

                <td>{user.phone || '-'}</td>

                <td>{user.active ? 'Active' : 'Suspended'}</td>

                <td>
                  <div className="flex justify-center">
                    <Link to={`/admin/users/${user._id}/edit`}>
                      <Pencil size={18} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default ManageOrganizers;
