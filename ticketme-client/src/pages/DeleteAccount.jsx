import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function DeleteAccount() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This cannot be undone.',
    );

    if (!confirmed) return;

    try {
      await api.delete('/users/deleteMe');

      logout();

      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to delete account.');
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
          <h1 className="text-3xl font-black text-red-600">Delete Account</h1>

          <p className="mt-6 text-slate-500 dark:text-slate-300">
            Deleting your account will permanently remove your profile.
          </p>

          <button
            onClick={handleDelete}
            className="mt-10 w-full rounded-xl bg-red-600 py-4 font-bold text-white hover:bg-red-700"
          >
            Delete My Account
          </button>
        </div>
      </div>
    </section>
  );
}

export default DeleteAccount;
