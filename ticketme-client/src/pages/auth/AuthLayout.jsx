import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <section className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left Side */}

        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 p-14 text-white">
          <div>
            <h1 className="text-5xl font-black">TicketMe</h1>

            <p className="mt-6 max-w-md text-xl leading-9 text-blue-100">
              Discover, book and manage unforgettable events with one powerful
              platform.
            </p>
          </div>

          <div>
            <div className="rounded-3xl bg-white/10 p-8 backdrop-blur">
              <h2 className="text-3xl font-bold">Experience Every Event.</h2>

              <p className="mt-4 text-blue-100 leading-8">
                Concerts, conferences, comedy shows, sports, festivals and
                everything in between.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}

        <div className="flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AuthLayout;
