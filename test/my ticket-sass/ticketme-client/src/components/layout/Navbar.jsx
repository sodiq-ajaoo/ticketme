import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

function Navbar() {
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(false);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    document.body.style.overflow = openMenu ? 'hidden' : 'auto';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [openMenu]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpenMenu(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/');
    window.location.reload();
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="text-3xl font-black tracking-tight">
            <span className="text-blue-600">Ticket</span>
            <span className="text-slate-900 dark:text-white">Me</span>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            <Link to="/" className="font-medium hover:text-blue-600">
              Home
            </Link>

            <Link to="/events" className="font-medium hover:text-blue-600">
              Events
            </Link>

            <Link to="/about" className="font-medium hover:text-blue-600">
              About
            </Link>
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <button
              onClick={toggleTheme}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 hover:bg-blue-600 hover:text-white dark:bg-slate-800"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {token ? (
              <>
                <span className="font-semibold">
                  Hi, {user?.name?.split(' ')[0]}
                </span>

                <Link
                  to="/dashboard"
                  className="rounded-xl border px-4 py-2 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="font-medium">
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setOpenMenu(true)} className="lg:hidden">
            <Menu size={30} />
          </button>
        </div>
      </nav>

      <div
        onClick={() => setOpenMenu(false)}
        className={`fixed inset-0 z-[999] transition-all duration-300 ${
          openMenu ? 'visible bg-black/50 opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white p-6 shadow-2xl transition-transform duration-300 dark:bg-slate-900 ${
            // className={`absolute right-0 top-0 h-full w-72 bg-white p-6 shadow-2xl transition-transform duration-300 dark:bg-slate-900 ${
            openMenu ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Menu</h2>

            <button onClick={() => setOpenMenu(false)}>
              <X size={28} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              to="/"
              onClick={() => setOpenMenu(false)}
              className="block w-full rounded-xl px-4 py-3 text-lg font-semibold transition hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Home
            </Link>

            <Link
              to="/events"
              onClick={() => setOpenMenu(false)}
              className="block w-full rounded-xl px-4 py-3 text-lg font-semibold transition hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Events
            </Link>

            <Link
              to="/about"
              onClick={() => setOpenMenu(false)}
              className="block w-full rounded-xl px-4 py-3 text-lg font-semibold transition hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              About
            </Link>

            <hr className="my-4 dark:border-slate-700" />

            {token ? (
              <>
                <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                  <p className="text-sm text-slate-500">Signed in as</p>
                  <h3 className="mt-1 font-bold">{user?.name}</h3>
                </div>

                <Link
                  to="/dashboard"
                  onClick={() => setOpenMenu(false)}
                  className="block w-full rounded-xl bg-blue-600 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpenMenu(false)}
                  className="block w-full rounded-xl border border-slate-300 py-3 text-center font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setOpenMenu(false)}
                  className="block w-full rounded-xl bg-blue-600 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}

            <button
              onClick={toggleTheme}
              className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 py-3 font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              {darkMode ? (
                <>
                  <Sun size={18} />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon size={18} />
                  Dark Mode
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
