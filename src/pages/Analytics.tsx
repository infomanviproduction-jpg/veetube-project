import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { BarChart2, Eye, ThumbsUp, Users, Video, TrendingUp } from 'lucide-react';

export default function Analytics() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [totalViews, setTotalViews] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalSubscribers, setTotalSubscribers] = useState(0);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) fetchAnalytics();
  }, [user]);

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchAnalytics = async () => {
    setLoading(true);

    const { data: videosData } = await supabase
      .from('videos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (videosData) {
      setVideos(videosData);
      setTotalViews(videosData.reduce((sum, v) => sum + (v.views || 0), 0));
      setTotalLikes(videosData.reduce((sum, v) => sum + (v.likes || 0), 0));
    }

    const { count: subsCount } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('channel_email', user.email);
    setTotalSubscribers(subsCount || 0);

    setLoading(false);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <p className="text-white text-xl">Loading Analytics...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
          <BarChart2 className="text-red-500" /> Analytics Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400 text-sm">Total Views</span>
            </div>
            <p className="text-white text-2xl font-bold">{totalViews.toLocaleString()}</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ThumbsUp className="w-5 h-5 text-green-400" />
              <span className="text-gray-400 text-sm">Total Likes</span>
            </div>
            <p className="text-white text-2xl font-bold">{totalLikes.toLocaleString()}</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span className="text-gray-400 text-sm">Subscribers</span>
            </div>
            <p className="text-white text-2xl font-bold">{totalSubscribers.toLocaleString()}</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Video className="w-5 h-5 text-red-400" />
              <span className="text-gray-400 text-sm">Total Videos</span>
            </div>
            <p className="text-white text-2xl font-bold">{videos.length}</p>
          </div>
        </div>

        {/* Views Bar Chart */}
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-400" /> Views per Video
          </h2>
          {videos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No videos yet!</p>
          ) : (
            <div className="space-y-3">
              {videos.map((video) => {
                const maxViews = Math.max(...videos.map(v => v.views || 0), 1);
                const percentage = ((video.views || 0) / maxViews) * 100;
                return (
                  <div key={video.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-white text-sm truncate max-w-xs">{video.title}</span>
                      <span className="text-gray-400 text-sm">{(video.views || 0).toLocaleString()} views</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Video List */}
        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Video className="text-red-400" /> Your Videos
          </h2>
          {videos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No videos uploaded yet!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 text-sm border-b border-gray-700">
                    <th className="text-left py-2 pr-4">Video</th>
                    <th className="text-center py-2 px-4">Views</th>
                    <th className="text-center py-2 px-4">Likes</th>
                    <th className="text-center py-2 px-4">Status</th>
                    <th className="text-right py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((video) => (
                    <tr key={video.id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-10 bg-gray-700 rounded overflow-hidden shrink-0">
                            {video.thumbnail_url ? (
                              <img src={video.thumbnail_url} className="w-full h-full object-cover" alt={video.title} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500">🎬</div>
                            )}
                          </div>
                          <span className="text-white text-sm truncate max-w-xs">{video.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-white text-sm">{(video.views || 0).toLocaleString()}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-white text-sm">{(video.likes || 0).toLocaleString()}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          video.visibility === 'public' ? 'bg-green-500/20 text-green-400' :
                          video.visibility === 'private' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {video.visibility || 'public'}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-gray-400 text-sm">{formatDate(video.created_at)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}