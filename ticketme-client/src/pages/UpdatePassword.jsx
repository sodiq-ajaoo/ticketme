import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../services/api';

function UpdatePassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    passwordCurrent: '',
    password: '',
    passwordConfirm: '',
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await api.patch('/users/updateMyPassword', formData);

      alert('Password updated successfully.');

      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to update password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-100 py-14 dark:bg-slate-950">
      <div className="mx-auto max-w-xl px-6">
        <Link
          to="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-blue-600 hover:underline"
        >
          <ArrowLeft size={18} />
          Back
        </Link>

        <div className="rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900">
          <h1 className="mb-8 text-3xl font-black dark:text-white">
            Change Password
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="password"
              name="passwordCurrent"
              placeholder="Current Password"
              value={formData.passwordCurrent}
              onChange={handleChange}
              className="w-full rounded-xl border p-4 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />

            <input
              type="password"
              name="password"
              placeholder="New Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-xl border p-4 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />

            <input
              type="password"
              name="passwordConfirm"
              placeholder="Confirm Password"
              value={formData.passwordConfirm}
              onChange={handleChange}
              className="w-full rounded-xl border p-4 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />

            <button
              disabled={saving}
              className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white hover:bg-blue-700"
            >
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default UpdatePassword;
