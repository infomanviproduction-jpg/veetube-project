import { Outlet, useLocation, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useUI } from '../context/UIContext';
import { Home, Search, Upload, Bell, User } from 'lucide-react';

export default function Layout() {
  const { sidebarOpen, mobileSidebarOpen } = useUI();
  const location = useLocation();

  const isWatchPage = location.pathname.startsWith('/watch/');
  const desktopMargin = sidebarOpen ? 'lg:ml-60' : 'lg:ml-16';

  return (
    <div className="min-h-screen bg-yt-bg dark:bg-yt-bg-dark">
      <Navbar />
      <Sidebar />
      <main
        className={`pt-14 pb-16 min-h-screen transition-[margin] duration-200 ${
          isWatchPage ? 'lg:ml-16' : desktopMargin
        } ${mobileSidebarOpen ? 'overflow-hidden' : ''}`}
      >
        <Outlet />
      </main>

      {/* YouTube Style Bottom Bar - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-around h-14 lg:hidden">
        
        <Link to="/" className={`flex flex-col items-center gap-0.5 px-4 py-1 ${location.pathname === '/' ? 'text-black dark:text-white' : 'text-gray-500'}`}>
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        <Link to="/search" className={`flex flex-col items-center gap-0.5 px-4 py-1 ${location.pathname === '/search' ? 'text-black dark:text-white' : 'text-gray-500'}`}>
          <Search className="w-6 h-6" />
          <span className="text-[10px] font-medium">Search</span>
        </Link>

        <Link to="/upload" className="flex flex-col items-center gap-0.5 px-4 py-1 text-gray-500">
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] font-medium">Upload</span>
        </Link>

        <button className={`flex flex-col items-center gap-0.5 px-4 py-1 text-gray-500`}>
          <Bell className="w-6 h-6" />
          <span className="text-[10px] font-medium">Notifications</span>
        </button>

        <Link to="/profile" className={`flex flex-col items-center gap-0.5 px-4 py-1 ${location.pathname === '/profile' ? 'text-black dark:text-white' : 'text-gray-500'}`}>
          <User className="w-6 h-6" />
          <span className="text-[10px] font-medium">You</span>
        </Link>

      </div>
    </div>
  );
}