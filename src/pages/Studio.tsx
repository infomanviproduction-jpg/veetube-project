import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';
import {
  BarChart2, Video, MessageCircle,
  Edit, Trash2, Eye, ThumbsUp, Users, TrendingUp
} from 'lucide-react';

type Tab = 'dashboard' | 'content' | 'comments' | 'analytics';

export default function Studio() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [videos, setVideos] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [totalViews, setTotalViews] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [editVideo, setEditVideo] = useState<any>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  useEffect(() => { getUser(); }, []);
  useEffect(() => { if (user) { fetchVideos(); fetchComments(); fetchSubscribers(); } }, [user]);

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchVideos = async () => {
    const { data } = await supabase.from('videos').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (data) {
      setVideos(data);
      setTotalViews(data.reduce((sum, v) => sum + (v.views || 0), 0));
      setTotalLikes(data.reduce((sum, v) => sum + (v.likes || 0), 0));
    }
  };

  const fetchComments = async () => {
    const { data: myVideos } = await supabase.from('videos').select('id').eq('user_id', user.id);
    if (myVideos && myVideos.length > 0) {
      const { data } = await supabase.from('comments').select('*').in('video_id', myVideos.map(v => v.id)).order('created_at', { ascending: false });
      if (data) setComments(data);
    }
  };

  const fetchSubscribers = async () => {
    const { count } = await supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('channel_email', user?.email);
    setTotalSubscribers(count || 0);
  };

  const handleDelete = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    await supabase.from('videos').delete().eq('id', videoId);
    setVideos(videos.filter(v => v.id !== videoId));
  };

  const handleEdit = (video: any) => {
    setEditVideo(video);
    setEditTitle(video.title);
    setEditDesc(video.description || '');
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;
    const { error } = await supabase.from('videos').update({ title: editTitle, description: editDesc }).eq('id', editVideo.id).eq('user_id', user.id);
    if (!error) {
      setVideos(videos.map(v => v.id === editVideo.id ? { ...v, title: editTitle, description: editDesc } : v));
      setEditVideo(null);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    await supabase.from('comments').delete().eq('id', commentId);
    setComments(comments.filter(c => c.id !== commentId));
  };

  const handleThumbnailChange = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'veetube');
    formData.append('cloud_name', 'dqocu8qnc');
    const res = await fetch('https://api.cloudinary.com/v1_1/dqocu8qnc/image/upload', { method: 'POST', body: formData });
    const data = await res.json();
    await supabase.from('videos').update({ thumbnail_url: data.secure_url }).eq('id', editVideo.id);
    setVideos(videos.map(v => v.id === editVideo.id ? { ...v, thumbnail_url: data.secure_url } : v));
    setEditVideo({ ...editVideo, thumbnail_url: data.secure_url });
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
    { id: 'content', label: 'Content', icon: Video },
    { id: 'comments', label: 'Comments', icon: MessageCircle },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-white font-bold">VeeTube Studio</h1>
            <p className="text-gray-400 text-xs">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="w-48 bg-gray-900 min-h-screen border-r border-gray-800 pt-4">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition ${activeTab === tab.id ? 'bg-gray-800 text-white border-r-2 border-red-500' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
          <div className="mt-4 border-t border-gray-800 pt-4">
            <Link to="/upload" className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition">
              <Video className="w-4 h-4" /> Upload Video
            </Link>
          </div>
        </div>

        <div className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-white text-xl font-bold mb-6">Channel Dashboard</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-900 rounded-xl p-4"><Eye className="w-5 h-5 text-blue-400 mb-2" /><p className="text-gray-400 text-xs">Total Views</p><p className="text-white text-2xl font-bold">{totalViews.toLocaleString()}</p></div>
                <div className="bg-gray-900 rounded-xl p-4"><ThumbsUp className="w-5 h-5 text-green-400 mb-2" /><p className="text-gray-400 text-xs">Total Likes</p><p className="text-white text-2xl font-bold">{totalLikes.toLocaleString()}</p></div>
                <div className="bg-gray-900 rounded-xl p-4"><Users className="w-5 h-5 text-purple-400 mb-2" /><p className="text-gray-400 text-xs">Subscribers</p><p className="text-white text-2xl font-bold">{totalSubscribers.toLocaleString()}</p></div>
                <div className="bg-gray-900 rounded-xl p-4"><Video className="w-5 h-5 text-red-400 mb-2" /><p className="text-gray-400 text-xs">Total Videos</p><p className="text-white text-2xl font-bold">{videos.length}</p></div>
              </div>
              <div className="bg-gray-900 rounded-xl p-4">
                <h3 className="text-white font-bold mb-4">Recent Videos</h3>
                {videos.slice(0, 5).map((video) => (
                  <div key={video.id} className="flex items-center gap-3 py-2 border-b border-gray-800">
                    <div className="w-16 h-10 bg-gray-700 rounded overflow-hidden shrink-0">
                      {video.thumbnail_url ? <img src={video.thumbnail_url} className="w-full h-full object-cover" alt={video.title} /> : <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">🎬</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{video.title}</p>
                      <p className="text-gray-400 text-xs">{video.views || 0} views • {formatDate(video.created_at)}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${video.visibility === 'public' ? 'bg-green-500/20 text-green-400' : video.visibility === 'private' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {video.visibility || 'public'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div>
              <h2 className="text-white text-xl font-bold mb-6">Your Content</h2>
              {videos.length === 0 ? <p className="text-gray-400 text-center py-12">No videos yet!</p> : (
                <div className="bg-gray-900 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="text-gray-400 text-xs border-b border-gray-800">
                        <th className="text-left p-4">Video</th>
                        <th className="text-center p-4">Views</th>
                        <th className="text-center p-4">Likes</th>
                        <th className="text-center p-4">Status</th>
                        <th className="text-center p-4">Date</th>
                        <th className="text-center p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {videos.map((video) => (
                        <tr key={video.id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-20 h-12 bg-gray-700 rounded overflow-hidden shrink-0">
                                {video.thumbnail_url ? <img src={video.thumbnail_url} className="w-full h-full object-cover" alt={video.title} /> : <div className="w-full h-full flex items-center justify-center text-gray-500">🎬</div>}
                              </div>
                              <div>
                                <p className="text-white text-sm">{video.title}</p>
                                <p className="text-gray-400 text-xs truncate max-w-xs">{video.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-center text-white text-sm">{video.views || 0}</td>
                          <td className="p-4 text-center text-white text-sm">{video.likes || 0}</td>
                          <td className="p-4 text-center">
                            <span className={`text-xs px-2 py-1 rounded-full ${video.visibility === 'public' ? 'bg-green-500/20 text-green-400' : video.visibility === 'private' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                              {video.visibility || 'public'}
                            </span>
                          </td>
                          <td className="p-4 text-center text-gray-400 text-xs">{formatDate(video.created_at)}</td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => handleEdit(video)} className="p-1.5 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 transition"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete(video.id)} className="p-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/40 transition"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'comments' && (
            <div>
              <h2 className="text-white text-xl font-bold mb-6">Comments ({comments.length})</h2>
              {comments.length === 0 ? <p className="text-gray-400 text-center py-12">No comments yet!</p> : (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-900 rounded-xl p-4 flex items-start justify-between gap-4">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shrink-0">{comment.user_email?.charAt(0).toUpperCase()}</div>
                        <div>
                          <p className="text-white text-sm font-medium">{comment.user_email?.split('@')[0]}</p>
                          <p className="text-gray-300 text-sm mt-1">{comment.content}</p>
                          <p className="text-gray-500 text-xs mt-1">{formatDate(comment.created_at)}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteComment(comment.id)} className="p-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/40 transition shrink-0"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-white text-xl font-bold mb-6">Analytics</h2>
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">Views per Video</h3>
                {videos.length === 0 ? <p className="text-gray-500 text-center py-8">No videos yet!</p> : (
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
                            <div className="bg-red-500 h-2 rounded-full transition-all" style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {editVideo && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-white font-bold text-lg mb-4">Edit Video</h3>
            <div className="mb-4">
              <label className="text-gray-400 text-sm mb-1 block">Title</label>
              <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div className="mb-4">
              <label className="text-gray-400 text-sm mb-1 block">Description</label>
              <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={3} className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-red-500 resize-none" />
            </div>
            <div className="mb-6">
              <label className="text-gray-400 text-sm mb-2 block">Thumbnail</label>
              {editVideo.thumbnail_url && (
                <img src={editVideo.thumbnail_url} className="w-full h-32 object-cover rounded-lg mb-2" alt="thumbnail" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => { const file = e.target.files?.[0]; if (file) handleThumbnailChange(file); }}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 text-sm"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={handleSaveEdit} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition">Save</button>
              <button onClick={() => setEditVideo(null)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg transition">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}