import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useUI } from '../context/UIContext';

export default function Layout() {
  const { sidebarOpen, mobileSidebarOpen } = useUI();
  const location = useLocation();

  // Watch page uses a different layout (no sidebar margin, full width on mobile)
  const isWatchPage = location.pathname.startsWith('/watch/');

  // On mobile, when drawer is open we don't shift content
  const desktopMargin = sidebarOpen ? 'lg:ml-60' : 'lg:ml-16';

  return (
    <div className="min-h-screen bg-yt-bg dark:bg-yt-bg-dark">
      <Navbar />
      <Sidebar />
      <main
        className={`pt-14 min-h-screen transition-[margin] duration-200 ${
          isWatchPage ? 'lg:ml-16' : desktopMargin
        } ${mobileSidebarOpen ? 'overflow-hidden' : ''}`}
      >
        <Outlet />
      </main>
    </div>
  );
}
