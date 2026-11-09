import { Outlet } from 'react-router';
import Chrome from './Chrome';

export default function Layout() {
  return (
    <Chrome>
      <Outlet />
    </Chrome>
  );
}
