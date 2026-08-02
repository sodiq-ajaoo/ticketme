import { Routes, Route } from 'react-router-dom';

import Layout from '../components/layout/Layout';
import AuthLayout from '../pages/auth/AuthLayout';
import ProtectedRoute from './ProtectedRoute';

import Home from '../pages/Home';
import Events from '../pages/Events';
import EventDetails from '../pages/EventDetails';
import Checkout from '../pages/Checkout';
import PaymentSuccess from '../pages/PaymentSuccess';
import MyTickets from '../pages/MyTickets';
import UserDashboard from '../pages/UserDashboard';
import OrganizerDashboard from '../pages/OrganizerDashboard';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

import AdminDashboard from '../pages/AdminDashboard';
import CreateEvent from '../pages/CreateEvent';
import ManageEvents from '../pages/ManageEvents';
import ManageUsers from '../pages/ManageUsers';
import EditUser from '../pages/auth/EditUser';
import EditEvent from '../pages/EditEvent';
import ScanTickets from '../pages/ScanTickets';
import TicketDetails from '../pages/TicketDetails';
import UserProfile from '../pages/UserProfile';
import UpdatePassword from '../pages/UpdatePassword';
import DeleteAccount from '../pages/DeleteAccount';
import ManageOrganizers from '../pages/ManageOrganizers';
import AssignOrganizer from '../pages/AssignOrganizer';
function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        {/* <Route path="/events/:id" element={<EventDetails />} /> */}
        <Route
          path="/events/:id"
          element={
            <ProtectedRoute>
              <EventDetails />
            </ProtectedRoute>
          }
        />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route
          path="/my-tickets/:id"
          element={
            <ProtectedRoute>
              <TicketDetails />
            </ProtectedRoute>
          }
        />

        {/* Logged-in users */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-tickets"
          element={
            <ProtectedRoute>
              <MyTickets />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/password"
          element={
            <ProtectedRoute>
              <UpdatePassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/delete-account"
          element={
            <ProtectedRoute>
              <DeleteAccount />
            </ProtectedRoute>
          }
        />

        {/* Organizer */}
        <Route
          path="/organizer"
          element={
            <ProtectedRoute roles={['organizer', 'admin']}>
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organizer/scanner"
          element={
            <ProtectedRoute roles={['organizer', 'admin']}>
              <ScanTickets />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/organizers"
          element={
            <ProtectedRoute roles={['admin']}>
              <ManageOrganizers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users/:id/edit"
          element={
            <ProtectedRoute roles={['admin']}>
              <EditUser />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={['admin']}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/create-event"
          element={
            <ProtectedRoute roles={['admin']}>
              <CreateEvent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/events"
          element={
            <ProtectedRoute roles={['admin']}>
              <ManageEvents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/events/:id/edit"
          element={
            <ProtectedRoute roles={['admin']}>
              <EditEvent />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        path="/admin/organizers"
        element={
          <ProtectedRoute roles={['admin']}>
            <ManageOrganizers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/organizers/assign"
        element={
          <ProtectedRoute roles={['admin']}>
            <AssignOrganizer />
          </ProtectedRoute>
        }
      />

      {/* Authentication */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
}

export default AppRoutes;
