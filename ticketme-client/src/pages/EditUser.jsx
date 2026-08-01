import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../services/api';
import Spinner from '../components/ui/Spinner';

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    active: true,
  });

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const res = await api.get(`/users/${id}`);

      const user = res.data.data.user;

      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role,
        active: user.active,
      });
    } catch (err) {
      console.log(err);
      alert('Unable to load user.');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSaving(true);

      await api.patch(`/users/${id}`, {
        name: formData.name,
        phone: formData.phone,
        role: formData.role,
        active: formData.active,
      });

      alert('User updated successfully.');

      navigate('/admin/users');
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || 'Unable to update user.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteUser() {
    const confirmDelete = window.confirm('Delete this user permanently?');

    if (!confirmDelete) return;

    try {
      await api.delete(`/users/${id}`);

      alert('User deleted.');

      navigate('/admin/users');
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || 'Unable to delete user.');
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner text="Loading user..." />
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-slate-100 py-14 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl px-6">
        <Link
          to="/admin/users"
          className="mb-8 inline-flex items-center gap-2 text-blue-600 hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Users
        </Link>

        <div className="rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900">
          <h1 className="mb-8 text-3xl font-black dark:text-white">
            Edit User
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block font-semibold dark:text-white">
                Name
              </label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border p-4 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold dark:text-white">
                Email
              </label>

              <input
                value={formData.email}
                disabled
                className="w-full rounded-xl border bg-slate-100 p-4 text-slate-500 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold dark:text-white">
                Phone
              </label>

              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-xl border p-4 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold dark:text-white">
                Role
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-xl border p-4 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="user">User</option>
                <option value="organizer">Organizer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />

              <label className="font-semibold dark:text-white">
                Active Account
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-xl bg-blue-600 py-4 font-bold text-white hover:bg-blue-700"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>

              <button
                type="button"
                onClick={deleteUser}
                className="rounded-xl bg-red-600 px-8 font-bold text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default EditUser;
