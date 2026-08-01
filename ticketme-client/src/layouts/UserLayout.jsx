import { Outlet } from 'react-router-dom';
import Layout from '../components/layout/Layout';

function UserLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default UserLayout;
