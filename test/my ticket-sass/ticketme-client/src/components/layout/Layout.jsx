// import Navbar from './Navbar';
// import Footer from './Footer';

// function Layout({ children }) {
//   return (
//     <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
//       <Navbar />

//       <main className="w-full">{children}</main>

//       <Footer />
//     </div>
//   );
// }

// export default Layout;

import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function Layout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />

      <main className="w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default Layout;
