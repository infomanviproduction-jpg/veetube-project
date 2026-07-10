import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Bell, Heart, UserPlus, Video, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchNotifications = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setNotifications(data);
    setLoading(false);
  };

  const markAllRead = async () => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id);
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
  };

  const markRead = async (id: string) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const handleClick = async (notification: any) => {
    await markRead(notification.id);
    if (notification.video_id) {
      navigate(`/watch/${notification.video_id}`);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="w-5 h-5 text-red-400" />;
      case 'comment': return <Video className="w-5 h-5 text-blue-400" />;
      case 'subscribe': return <UserPlus className="w-5 h-5 text-green-400" />;
      default: return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatDate = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <p className="text-white">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white text-2xl font-bold flex items-center gap-2">
            <Bell className="text-red-500" />
            Notifications
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition"
            >
              <Check className="w-4 h-4" /> Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No notifications yet!</p>
            <p className="text-gray-600 text-sm mt-1">When someone likes or comments on your video, you'll see it here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleClick(notification)}
                className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition ${
                  notification.is_read
                    ? 'bg-gray-900 hover:bg-gray-800'
                    : 'bg-gray-800 hover:bg-gray-700 border-l-4 border-red-500'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${notification.is_read ? 'text-gray-300' : 'text-white font-medium'}`}>
                    {notification.message}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{formatDate(notification.created_at)}</p>
                </div>
                {!notification.is_read && (
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}