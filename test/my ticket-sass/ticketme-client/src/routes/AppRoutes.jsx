// import { Routes, Route } from 'react-router-dom';

// import Layout from '../components/layout/Layout';

// import Home from '../pages/Home';
// import EventDetails from '../pages/EventDetails';
// import Checkout from '../pages/Checkout';
// import Login from '../pages/auth/Login';
// // import Signup from '../pages/Signup';
// import OrganizerDashboard from '../pages/OrganizerDashboard';
// import UserDashboard from '../pages/UserDashboard';
// import AdminDashboard from '../pages/AdminDashboard';
// import PaymentSuccess from '../pages/PaymentSuccess';
// import MyTickets from '../pages/MyTickets';
// import CreateEvent from '../pages/CreateEvent';
// import ManageEvents from '../pages/ManageEvents';
// import EditEvent from '../pages/EditEvent';
// import ScanTickets from '../pages/ScanTickets';
// import AuthLayout from '../pages/auth/AuthLayout';
// import Register from '../pages/auth/Register';
// // import CreateEvent from '../pages/CreateEvent';
// // import AdminDashboard from '../pages/AdminDashboard';

// function AppRoutes() {
//   return (
//     <Layout>
//       <Routes>
//         <Route path="/" element={<Home />} />

//         <Route path="/events/:id" element={<EventDetails />} />

//         <Route path="/checkout" element={<Checkout />} />

//         {/* <Route path="/login" element={<Login />} /> */}

//         {/* <Route path="/signup" element={<Signup />} /> */}
//         <Route path="/admin/create-event" element={<CreateEvent />} />

//         <Route path="/admin" element={<AdminDashboard />} />
//         <Route path="/organizer/scanner" element={<ScanTickets />} />
//         <Route element={<AuthLayout />}>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           {/* <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/reset-password/:token" element={<ResetPassword />} />
//           <Route path="/verify-email" element={<VerifyEmail />} /> */}
//         </Route>

//         {/* <Route path="/admin/create-event" element={<CreateEvent />} /> */}

//         <Route path="/admin/events" element={<ManageEvents />} />
//         <Route path="/admin/events/:id/edit" element={<EditEvent />} />

//         <Route path="/checkout" element={<Checkout />} />
//         <Route path="/payment-success" element={<PaymentSuccess />} />
//         <Route path="/my-tickets" element={<MyTickets />} />

//         <Route path="/dashboard" element={<UserDashboard />} />

//         <Route path="/organizer" element={<OrganizerDashboard />} />

//         {/* <Route path="/admin" element={<AdminDashboard />} /> */}
//       </Routes>
//     </Layout>
//   );
// }

// export default AppRoutes;

import { Routes, Route } from 'react-router-dom';

import Layout from '../components/layout/Layout';
import AuthLayout from '../pages/auth/AuthLayout';

import Home from '../pages/Home';
import EventDetails from '../pages/EventDetails';
import Checkout from '../pages/Checkout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

import OrganizerDashboard from '../pages/OrganizerDashboard';
import UserDashboard from '../pages/UserDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import PaymentSuccess from '../pages/PaymentSuccess';
import MyTickets from '../pages/MyTickets';
import CreateEvent from '../pages/CreateEvent';
import ManageEvents from '../pages/ManageEvents';
import EditEvent from '../pages/EditEvent';
import ScanTickets from '../pages/ScanTickets';
import Events from '../pages/Events';

function AppRoutes() {
  return (
    <Routes>
      {/* Pages with Navbar/Footer */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        <Route path="/events/:id" element={<EventDetails />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/payment-success" element={<PaymentSuccess />} />

        <Route path="/my-tickets" element={<MyTickets />} />

        <Route path="/dashboard" element={<UserDashboard />} />

        <Route path="/organizer" element={<OrganizerDashboard />} />

        <Route path="/organizer/scanner" element={<ScanTickets />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/admin/create-event" element={<CreateEvent />} />

        <Route path="/admin/events" element={<ManageEvents />} />

        <Route path="/admin/events/:id/edit" element={<EditEvent />} />
        <Route path="/events" element={<Events />} />
      </Route>

      {/* Authentication */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
