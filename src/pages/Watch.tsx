import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase';
import { ThumbsUp, Share2, Download, Send, Trash2 } from 'lucide-react';

export default function Watch() {
  const { id } = useParams();
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState<any>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [subCount, setSubCount] = useState(0);

  useEffect(() => {
    fetchVideo();
    fetchComments();
    getUser();
  }, [id]);

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchVideo = async () => {
    const { data } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .single();
    if (data) {
      setVideo(data);
      fetchSubInfo(data.user_email);
    }
    setLoading(false);
  };

  const fetchSubInfo = async (channelEmail: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { count } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('channel_email', channelEmail);
    setSubCount(count || 0);

    if (user) {
      const { data } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('subscriber_id', user.id)
        .eq('channel_email', channelEmail)
        .single();
      setSubscribed(!!data);
    }
  };

  const handleSubscribe = async () => {
    if (!user || !video) return;

    if (subscribed) {
      await supabase
        .from('subscriptions')
        .delete()
        .eq('subscriber_id', user.id)
        .eq('channel_email', video.user_email);
      setSubscribed(false);
      setSubCount(subCount - 1);
    } else {
      await supabase
        .from('subscriptions')
        .insert({
          subscriber_id: user.id,
          channel_email: video.user_email,
        });
      setSubscribed(true);
      setSubCount(subCount + 1);
    }
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('video_id', id)
      .order('created_at', { ascending: false });
    if (data) setComments(data);
  };

  const handleLike = async () => {
    if (liked) return;
    setLiked(true);
    await supabase
      .from('videos')
      .update({ likes: (video.likes || 0) + 1 })
      .eq('id', id);
    setVideo({ ...video, likes: (video.likes || 0) + 1 });
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    const { data, error } = await supabase
      .from('comments')
      .insert({
        video_id: id,
        user_id: user?.id,
        user_email: user?.email,
        content: newComment.trim(),
      })
      .select()
      .single();
    if (!error && data) {
      setComments([data, ...comments]);
      setNewComment('');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    await supabase.from('comments').delete().eq('id', commentId);
    setComments(comments.filter((c) => c.id !== commentId));
  };

  const formatDate = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <p className="text-white text-xl">Loading...</p>
    </div>
  );

  if (!video) return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <p className="text-white text-xl">Video not found!</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-5xl mx-auto">

        {/* Video Player */}
        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4">
          <video src={video.video_url} controls autoPlay className="w-full h-full" />
        </div>

        {/* Title */}
        <h1 className="text-white text-xl font-bold mb-3">{video.title}</h1>

        {/* Channel + Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
              {video.user_email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-medium">{video.user_email?.split('@')[0]}</p>
              <p className="text-gray-400 text-sm">{subCount} subscribers</p>
            </div>
            {user?.email !== video.user_email && (
              <button
                onClick={handleSubscribe}
                className={`ml-4 px-4 py-1.5 rounded-full font-bold text-sm transition ${
                  subscribed
                    ? 'bg-gray-700 text-white'
                    : 'bg-white text-black hover:bg-gray-200'
                }`}
              >
                {subscribed ? 'Subscribed ✓' : 'Subscribe'}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${liked ? 'bg-blue-500 text-white' : 'bg-gray-800 text-white'}`}
            >
              <ThumbsUp className="w-4 h-4" /> {video.likes || 0}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 text-white text-sm">
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button
              onClick={() => window.open(video.video_url, '_blank')}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 text-white text-sm"
            >
              <Download className="w-4 h-4" /> Download
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-900 rounded-xl p-4 mb-6">
          <p className="text-gray-400 text-sm mb-2">{formatDate(video.created_at)}</p>
          <p className="text-white text-sm">{video.description || 'No description available.'}</p>
        </div>

        {/* Comments Section */}
        <div className="bg-gray-900 rounded-xl p-4">
          <h3 className="text-white font-bold text-lg mb-4">
            💬 {comments.length} Comments
          </h3>

          <div className="flex gap-3 mb-6">
            <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white font-bold shrink-0">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                onClick={handleComment}
                className="bg-red-500 hover:bg-red-600 text-white px-4 rounded-lg"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No comments yet. Be the first!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shrink-0">
                    {comment.user_email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white text-sm font-medium">
                          {comment.user_email?.split('@')[0]}
                        </span>
                        <span className="text-gray-500 text-xs ml-2">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      {user?.id === comment.user_id && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm mt-1">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}