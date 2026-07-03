import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Search, Mic, Video as VideoIcon, Bell, Sun, Moon, X } from 'lucide-react';
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
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
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

  const handleSignOut = async () => {
    setProfileOpen(false)
    await supabase.auth.signOut()
    window.location.href = '/'
  }

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
          >
            <Menu className="w-5 h-5" />
          </button>
          <Logo />
        </div>

        <div className={`flex-1 max-w-2xl ${mobileSearchOpen ? 'flex' : 'hidden sm:flex'} items-center`}>
          {mobileSearchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center w-full gap-2">
              <button type="button" onClick={() => setMobileSearchOpen(false)} className="p-2 rounded-full hover:bg-yt-hover dark:hover:bg-yt-hover-dark transition-colors shrink-0">
                <X className="w-5 h-5" />
              </button>
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="flex-1 h-10 px-4 bg-yt-bg dark:bg-yt-card-dark border border-yt-border dark:border-yt-border-dark rounded-l-full outline-none text-sm"
              />
              <button type="submit" className="h-10 px-5 bg-yt-hover dark:bg-yt-hover-dark border border-l-0 border-yt-border dark:border-yt-border-dark rounded-r-full shrink-0">
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
                  className="flex-1 h-10 px-4 bg-yt-bg dark:bg-yt-card-dark border border-yt-border dark:border-yt-border-dark rounded-l-full outline-none text-sm"
                />
                <button type="submit" className="h-10 px-5 bg-yt-hover dark:bg-yt-hover-dark border border-l-0 border-yt-border dark:border-yt-border-dark rounded-r-full">
                  <Search className="w-5 h-5" />
                </button>
              </div>
              <button type="button" className="p-2.5 rounded-full bg-yt-hover dark:bg-yt-hover-dark shrink-0">
                <Mic className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>

        <div className={`flex items-center gap-1 sm:gap-2 ${mobileSearchOpen ? 'hidden' : 'flex'}`}>
          <button onClick={() => setMobileSearchOpen(true)} className="sm:hidden p-2 rounded-full hover:bg-yt-hover dark:hover:bg-yt-hover-dark transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <Link to="/upload" className="p-2 rounded-full hover:bg-yt-hover dark:hover:bg-yt-hover-dark transition-colors hidden sm:block">
            <VideoIcon className="w-5 h-5" />
          </Link>
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-yt-hover dark:hover:bg-yt-hover-dark transition-colors">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button className="relative p-2 rounded-full hover:bg-yt-hover dark:hover:bg-yt-hover-dark transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">9</span>
          </button>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((o) => !o)}
              className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-sm shrink-0"
            >
              {user?.email?.charAt(0).toUpperCase() || 'V'}
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-12 w-72 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                
                <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {user?.email?.charAt(0).toUpperCase() || 'V'}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate dark:text-white">
                      {user?.email?.split('@')[0] || 'VeeTube User'}
                    </div>
                    <div className="text-xs text-gray-500 truncate">{user?.email || ''}</div>
                    <Link
                      to={`/channel/${user?.id}`}
                      onClick={() => setProfileOpen(false)}
                      className="text-xs text-blue-500 hover:underline"
                    >
                      Channel dekho
                    </Link>
                  </div>
                </div>

                <div className="py-1">
                  <Link to={`/channel/${user?.id}`} onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white transition">
                    <span>👤</span> Aapka Channel
                  </Link>
                  <Link to="/upload" onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white transition">
                    <span>🎬</span> Video Upload
                  </Link>
                  <Link to="/profile" onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white transition">
                    <span>⚙️</span> Settings
                  </Link>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 py-1">
                  <button
                    onClick={() => { setProfileOpen(false); toggleTheme(); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white transition"
                  >
                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                  </button>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 py-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition text-red-500"
                  >
                    <span>🚪</span> Sign Out
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