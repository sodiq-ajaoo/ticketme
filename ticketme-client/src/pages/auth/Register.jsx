import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { registerUser } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     setLoading(true);
  //     setError('');
  //     setSuccess('');

  //     if (formData.password !== formData.passwordConfirm) {
  //       setError('Passwords do not match.');
  //       return;
  //     }

  //     const data = await registerUser(formData);

  //     setSuccess(
  //       data.message ||
  //         'Account created successfully. Please check your email to verify your account.',
  //     );

  //     setTimeout(() => {
  //       navigate('/login');
  //     }, 2500);
  //   } catch (err) {
  //     setError(err.response?.data?.message || 'Registration failed.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const data = await registerUser(formData);

      setSuccess(
        data.message ||
          'Account created successfully. Please check your email to verify your account.',
      );

      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black">Create Account</h1>

        <p className="mt-3 text-slate-500">
          Join TicketMe and start discovering amazing events.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-xl bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-xl bg-green-100 p-4 text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block font-semibold">Full Name</label>

          <div className="flex items-center rounded-2xl border bg-white px-4 dark:bg-slate-900">
            <User className="text-slate-400" size={20} />

            <input
              type="text"
              name="name"
              placeholder="John Doe"
              className="w-full bg-transparent p-4 outline-none"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block font-semibold">Email</label>

          <div className="flex items-center rounded-2xl border bg-white px-4 dark:bg-slate-900">
            <Mail className="text-slate-400" size={20} />

            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              className="w-full bg-transparent p-4 outline-none"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Phone Number <span className="text-slate-400">(Optional)</span>
          </label>

          <div className="flex items-center rounded-2xl border bg-white px-4 dark:bg-slate-900">
            <input
              type="tel"
              name="phone"
              placeholder="+234 801 234 5678"
              className="w-full bg-transparent p-4 outline-none"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
              // disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block font-semibold">Password</label>

          <div className="flex items-center rounded-2xl border bg-white px-4 dark:bg-slate-900">
            <Lock className="text-slate-400" size={20} />

            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              className="w-full bg-transparent p-4 outline-none"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block font-semibold">Confirm Password</label>

          <div className="flex items-center rounded-2xl border bg-white px-4 dark:bg-slate-900">
            <Lock className="text-slate-400" size={20} />

            <input
              type="password"
              name="passwordConfirm"
              placeholder="Confirm Password"
              className="w-full bg-transparent p-4 outline-none"
              value={formData.passwordConfirm}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-blue-600 py-4 text-lg font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Creating Account...
            </div>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        Already have an account?
        <Link to="/login" className="ml-2 font-bold text-blue-600">
          Login
        </Link>
      </div>
    </>
  );
}
export default Register;
