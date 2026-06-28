import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

const categories = ['All', 'Music', 'Gaming', 'News', 'Live', 'Cooking', 'React', 'Python', 'Sports'];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setVideos(data);
    setLoading(false);
  };

  const incrementViews = async (id: string) => {
    await supabase.rpc('increment_views', { video_id: id });
  };

  const handleVideoClick = async (video: any) => {
    await incrementViews(video.id);
    navigate(`/watch/${video.id}`);
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views?.toString() || '0';
  };

  const formatDate = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Aaj';
    if (days === 1) return 'Kal';
    if (days < 30) return `${days} din pehle`;
    if (days < 365) return `${Math.floor(days / 30)} mahine pehle`;
    return `${Math.floor(days / 365)} saal pehle`;
  };

  return (
    <div className="min-h-screen bg-black">
      
      {/* Categories */}
      <div className="sticky top-14 z-40 bg-black px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide border-b border-gray-800">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
              activeCategory === cat
                ? 'bg-white text-black'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Videos Grid */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-white text-xl">Videos load ho rahi hain...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-400 text-xl mb-2">Abhi koi video nahi hai</p>
            <p className="text-gray-600">Upload karo pehli video!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => handleVideoClick(video)}
                className="cursor-pointer group"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden mb-3">
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                      <span className="text-gray-500 text-4xl">🎬</span>
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="flex gap-3">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white font-bold shrink-0">
                    {video.user_email?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3 className="text-white font-medium line-clamp-2 text-sm leading-snug mb-1">
                      {video.title}
                    </h3>
                    <p className="text-gray-400 text-xs">{video.user_email?.split('@')[0]}</p>
                    <p className="text-gray-400 text-xs">
                      {formatViews(video.views)} views • {formatDate(video.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
