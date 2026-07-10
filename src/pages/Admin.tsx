import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Shield, Trash2 } from 'lucide-react';

const ADMIN_EMAIL = 'info.manviproduction@gmail.com';

export default function Admin() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  const checkAdminAndFetch = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.email !== ADMIN_EMAIL) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setIsAdmin(true);

    const { data } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    setVideos(data || []);
    setLoading(false);
  };

  const handleDelete = async (videoId: string, videoTitle: string) => {
    const confirmed = window.confirm(`Pakka "${videoTitle}" delete karna hai?`);
    if (!confirmed) return;

    setDeletingId(videoId);

    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId);

    if (error) {
      alert('Delete nahi hua: ' + error.message);
      setDeletingId(null);
      return;
    }

    setVideos((prev) => prev.filter((v) => v.id !== videoId));
    setDeletingId(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <p className="text-white text-xl">Loading...</p>
    </div>
  );

  if (!isAdmin) return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <p className="text-red-500 text-xl">🚫 Ye page sirf admin ke liye hai</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
          <Shield className="text-red-500" /> Admin Panel — Sab Videos
        </h1>

        <div className="bg-gray-900 rounded-xl p-6">
          {videos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Koi video nahi hai</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 text-sm border-b border-gray-700">
                    <th className="text-left py-2 pr-4">Video</th>
                    <th className="text-center py-2 px-4">Views</th>
                    <th className="text-center py-2 px-4">Status</th>
                    <th className="text-center py-2 pl-4">Action</th>
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
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          video.visibility === 'public' ? 'bg-green-500/20 text-green-400' :
                          video.visibility === 'private' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {video.visibility || 'public'}
                        </span>
                      </td>
                      <td className="py-3 pl-4 text-center">
                        <button
                          onClick={() => handleDelete(video.id, video.title)}
                          disabled={deletingId === video.id}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition disabled:opacity-50"
                          title="Delete video"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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