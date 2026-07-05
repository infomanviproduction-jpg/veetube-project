import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import {
  Home,
  Clapperboard,
  ListVideo,
  Library,
  History,
  Clock,
  ThumbsUp,
  TrendingUp,
  Music,
  Gamepad2,
  Newspaper,
  Trophy,
  GraduationCap,
  Settings,
  HelpCircle,
  Flag,
  X,
  BarChart2,
  Upload,
} from 'lucide-react';
import { useUI } from '../context/UIContext';

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  to: string;
}

const mainItems: NavItem[] = [
  { label: 'Home', icon: Home, to: '/' },
  { label: 'Shorts', icon: Clapperboard, to: '/shorts' },
  { label: 'Subscriptions', icon: ListVideo, to: '/subscriptions' },
  { label: 'Upload', icon: Upload, to: '/upload' },
  { label: 'Analytics', icon: BarChart2, to: '/analytics' },
];

const libraryItems: NavItem[] = [
  { label: 'Library', icon: Library, to: '/library' },
  { label: 'History', icon: History, to: '/history' },
  { label: 'Watch Later', icon: Clock, to: '/watch-later' },
  { label: 'Liked Videos', icon: ThumbsUp, to: '/liked' },
];

const exploreItems: NavItem[] = [
  { label: 'Trending', icon: TrendingUp, to: '/trending' },
  { label: 'Music', icon: Music, to: '/trending?cat=Music' },
  { label: 'Gaming', icon: Gamepad2, to: '/trending?cat=Gaming' },
  { label: 'News', icon: Newspaper, to: '/trending?cat=News' },
  { label: 'Sports', icon: Trophy, to: '/trending?cat=Sports' },
  { label: 'Learning', icon: GraduationCap, to: '/trending?cat=Learning' },
];

const footerItems: NavItem[] = [
  { label: 'Settings', icon: Settings, to: '/profile' },
  { label: 'Help', icon: HelpCircle, to: '/help' },
  { label: 'Send feedback', icon: Flag, to: '/feedback' },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  const isActive = (to: string) => {
    const path = to.split('?')[0];
    return path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
  };

  const renderItems = (items: NavItem[]) =>
    items.map((item) => {
      const active = isActive(item.to);
      return (
        <Link
          key={item.label}
          to={item.to}
          onClick={onNavigate}
          className={`flex items-center gap-6 px-3 py-2.5 rounded-lg transition-colors text-sm ${
            active
              ? 'bg-yt-hover dark:bg-yt-hover-dark font-medium'
              : 'hover:bg-yt-hover dark:hover:bg-yt-hover-dark'
          }`}
        >
          <item.icon className="w-5 h-5 shrink-0" />
          <span>{item.label}</span>
        </Link>
      );
    });

  return (
    <nav className="flex flex-col gap-1 px-3 py-2 text-yt-text dark:text-yt-text-dark">
      {renderItems(mainItems)}
      <hr className="my-2 border-yt-border dark:border-yt-border-dark" />
      {renderItems(libraryItems)}
      <hr className="my-2 border-yt-border dark:border-yt-border-dark" />
      <div className="px-3 py-1 text-xs font-medium text-yt-text-secondary dark:text-yt-text-secondary-dark">
        Explore
      </div>
      {renderItems(exploreItems)}
      <hr className="my-2 border-yt-border dark:border-yt-border-dark" />
      {renderItems(footerItems)}
      <hr className="my-2 border-yt-border dark:border-yt-border-dark" />
      <div className="px-3 py-2 text-xs text-yt-text-secondary dark:text-yt-text-secondary-dark space-y-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {['About', 'Press', 'Copyright', 'Contact', 'Creators', 'Advertise', 'Developers', 'Terms', 'Privacy', 'Policy', 'Safety'].map((l) => (
            <span key={l} className="hover:text-yt-text dark:hover:text-yt-text-dark cursor-pointer">{l}</span>
          ))}
        </div>
        <div className="pt-2 text-yt-text-secondary dark:text-yt-text-secondary-dark">© 2025 VeeTube</div>
      </div>
    </nav>
  );
}

function MiniSidebar() {
  const location = useLocation();
  const items = [
    { label: 'Home', icon: Home, to: '/' },
    { label: 'Shorts', icon: Clapperboard, to: '/shorts' },
    { label: 'Upload', icon: Upload, to: '/upload' },
    { label: 'Analytics', icon: BarChart2, to: '/analytics' },
    { label: 'You', icon: Library, to: '/profile' },
  ];
  return (
    <aside className="hidden lg:flex fixed left-0 top-14 bottom-0 w-16 flex-col items-center py-1 gap-1 bg-yt-bg dark:bg-yt-bg-dark overflow-y-auto scrollbar-thin">
      {items.map((item) => {
        const active = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to);
        return (
          <Link
            key={item.label}
            to={item.to}
            className={`flex flex-col items-center gap-1 w-14 py-4 rounded-lg transition-colors ${
              active ? 'bg-yt-hover dark:bg-yt-hover-dark' : 'hover:bg-yt-hover dark:hover:bg-yt-hover-dark'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px]">{item.label}</span>
          </Link>
        );
      })}
    </aside>
  );
}

export default function Sidebar() {
  const { sidebarOpen, mobileSidebarOpen, setMobileSidebarOpen } = useUI();

  return (
    <>
      {sidebarOpen ? (
        <aside className="hidden lg:block fixed left-0 top-14 bottom-0 w-60 bg-yt-bg dark:bg-yt-bg-dark overflow-y-auto scrollbar-thin">
          <SidebarContent />
        </aside>
      ) : (
        <MiniSidebar />
      )}

      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50 animate-fade-in"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-60 bg-yt-bg dark:bg-yt-bg-dark overflow-y-auto scrollbar-thin animate-slide-up">
            <div className="flex items-center gap-4 px-4 h-14">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-2 rounded-full hover:bg-yt-hover dark:hover:bg-yt-hover-dark transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <Logo />
            </div>
            <SidebarContent onNavigate={() => setMobileSidebarOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}