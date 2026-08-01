import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { loginUser } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [remember, setRemember] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      const data = await loginUser(email, password);

      login(data.data.user, data.token);

      const role = data.data.user.role;

      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'organizer') {
        navigate('/organizer');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black">Welcome Back</h1>

        <p className="mt-3 text-slate-500">
          Login to continue managing your events.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}

        <div>
          <label className="mb-2 block font-semibold">Email Address</label>

          <div className="flex items-center rounded-2xl border bg-white px-4 dark:bg-slate-900">
            <Mail className="text-slate-400" size={20} />

            <input
              type="email"
              className="w-full bg-transparent p-4 outline-none"
              placeholder="Enter your email"
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}

        <div>
          <label className="mb-2 block font-semibold">Password</label>

          <div className="flex items-center rounded-2xl border bg-white px-4 dark:bg-slate-900">
            <Lock className="text-slate-400" size={20} />

            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full bg-transparent p-4 outline-none"
              placeholder="Enter your password"
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Remember */}

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
            />
            Remember me
          </label>

          <Link
            to="/forgot-password"
            className="font-semibold text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Button */}

        <button
          disabled={loading}
          className="w-full rounded-2xl bg-blue-600 py-4 text-lg font-bold text-white transition hover:bg-blue-700 disabled:opacity-70"
        >
          {loading ? 'Signing In...' : 'Login'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <span className="text-slate-500">Don't have an account?</span>

        <Link
          to="/register"
          className="ml-2 font-bold text-blue-600 hover:underline"
        >
          Create Account
        </Link>
      </div>
    </>
  );
}

export default Login;
