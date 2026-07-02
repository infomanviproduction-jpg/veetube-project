import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  Search,
  Mic,
  Video as VideoIcon,
  Bell,
  Sun,
  Moon,
  X,
} from 'lucide-react';
import Logo from './Logo';
import { useTheme } from '../context/ThemeContext';
import { useUI } from '../context/UIContext';
import { supabase } from '../supabase';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { toggleSidebar, toggleMobileSidebar } = useUI();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  const isSearchPage = location.pathname === '/search';

  useEffect(() => {
    if (isSearchPage) {
      const params = new URLSearchParams(location.search);
      setSearchQuery(params.get('q') || '');
    }
  }, [isSearchPage, location.search]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-yt-bg dark:bg-yt-bg-dark flex items-center justify-between px-2 sm:px-4 gap-2 sm:gap-4">
        <div className={`flex items-center gap-1 sm:gap-4 ${mobileSearchOpen ? 'hidden sm:flex' : 'flex'}`}>
          <button
            onClick={() => {
              if (window.innerWidth < 1024) toggleMobileSidebar();
              else toggleSidebar();
            }}
            className="p-2 rounded-full hover:bg-yt-hover dark:hover:bg-yt-hover-dark transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Logo />
        </div>

        <div className={`flex-1 max-w-2xl ${mobileSearchOpen ? 'flex' : 'hidden sm:flex'} items-center`}>
          {mobileSearchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center w-full gap-2">
              <button
                type="button"
                onClick={() => setMobileSearchOpen(false)}
                className="p-2 rounded-full hover:bg-yt-hover dark:hover:bg-yt-hover-dark transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="flex-1 h-10 px-4 bg-yt-bg dark:bg-yt-card-dark border border-yt-border dark:border-yt-border-dark rounded-l-full outline-none focus:border-yt-blue text-sm"
              />
              <button
                type="submit"
                className="h-10 px-5 bg-yt-hover dark:bg-yt-hover-dark border border-l-0 border-yt-border dark:border-yt-border-dark rounded-r-full hover:bg-yt-border dark:hover:bg-yt-border-dark transition-colors shrink-0"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSearch} className="flex items-center w-full gap-2">
              <div className="flex-1 flex">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="flex-1 h-10 px-4 bg-yt-bg dark:bg-yt-card-dark border border-yt-border dark:border-yt-border-dark rounded-l-full outline-none focus:ring-1 focus:ring-yt-blue focus:border-yt-blue text-sm"
                />
                <button
                  type="submit"
                  className="h-10 px-5 bg-yt-hover dark:bg-yt-hover-dark border border-l-0 border-yt-border dark:border-yt-border-dark rounded-r-full hover:bg-yt-border dark:hover:bg-yt-border-dark transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
              <button
                type="button"
                className="p-2.5 rounded-full bg-yt-hover dark:bg-yt-hover-dark hover:bg-yt-border dark:hover:bg-yt-border-dark transition-colors shrink-0"
                aria-label="Search with voice"
              >
                <Mic className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>

        <div className={`flex items-center gap-1 sm:gap-2 ${mobileSearchOpen ? 'hidden' : 'flex'}`}>
          <button
            onClick={() => setMobileSearchOpen(true)}
            className="sm:hidden p-2 rounded-full hover:bg-yt-hover dark:hover:bg-yt-hover-dark transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <Link
            to="/upload"
            className="p-2 rounded-full hover:bg-yt-hover dark:hover:bg-yt-hover-dark transition-colors hidden sm:block"
            aria-label="Upload"
          >
            <VideoIcon className="w-5 h-5" />
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-yt-hover dark:hover:bg-yt-hover-dark transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            className="relative p-2 rounded-full hover:bg-yt-hover dark:hover:bg-yt-hover-dark transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-violet-600 text-white text-[9px] font-bold flex items-center justify-center">
              9
            </span>
          </button>
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((o) => !o)}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white font-medium text-sm shrink-0"
              aria-label="Profile"
            >
              {user?.email?.charAt(0).toUpperCase() || 'V'}
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-12 w-64 bg-yt-bg dark:bg-yt-card-dark rounded-xl shadow-2xl border border-yt-border dark:border-yt-border-dark py-2 animate-slide-up overflow-hidden">
                <div className="px-4 py-3 border-b border-yt-border dark:border-yt-border-dark">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white font-medium">
                      {user?.email?.charAt(0).toUpperCase() || 'V'}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">{user?.email?.split('@')[0] || 'Vee User'}</div>
                      <div className="text-xs text-yt-text-secondary dark:text-yt-text-secondary-dark truncate">{user?.email || '@veeuser'}</div>
                    </div>
                  </div>
                  <Link
                    to={`/channel/${user?.id}`}
                    onClick={() => setProfileOpen(false)}
                    className="block mt-3 text-center text-sm font-medium text-yt-blue hover:underline"
                  >
                    View your channel
                  </Link>
                </div>
                <div className="py-1">
                  {[
                    { label: 'Your channel', to: `/channel/${user?.id}` },
                    { label: 'Upload video', to: '/upload' },
                    { label: 'Settings', to: '/profile' },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2.5 text-sm hover:bg-yt-hover dark:hover:bg-yt-hover-dark transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="border-t border-yt-border dark:border-yt-border-dark py-1">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      toggleTheme();
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-yt-hover dark:hover:bg-yt-hover-dark transition-colors flex items-center gap-3"
                  >
                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}