import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function Channel() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [channel, setChannel] = useState<any>(null)
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchChannel()
  }, [id])

  const fetchChannel = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data: channelData } = await supabase
      .from('channels')
      .select('*')
      .eq('user_id', id)
      .single()
    if (channelData) {
      setChannel(channelData)
      setName(channelData.name)
      setDescription(channelData.description || '')
      setIsOwner(user?.id === id)
    } else {
      setIsOwner(user?.id === id)
      setCreating(user?.id === id)
    }
    const { data: videoData } = await supabase
      .from('videos')
      .select('*')
      .eq('user_id', id)
      .order('created_at', { ascending: false })
    if (videoData) setVideos(videoData)
    setLoading(false)
  }

  const createChannel = async () => {
    if (!name) return
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('channels').insert({
      user_id: user?.id,
      name,
      description,
    })
    setCreating(false)
    fetchChannel()
  }

  const updateChannel = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('channels').update({ name, description }).eq('user_id', user?.id)
    setEditing(false)
    fetchChannel()
  }

  const handleSubscribe = async () => {
    setSubscribed(!subscribed)
    await supabase.from('channels').update({
      subscribers: subscribed ? (channel.subscribers - 1) : (channel.subscribers + 1)
    }).eq('id', channel.id)
    fetchChannel()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  if (creating) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md">
          <h1 className="text-white text-2xl font-bold mb-6">Channel Banao</h1>
          <input
            type="text"
            placeholder="Channel ka naam..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-4 outline-none"
          />
          <textarea
            placeholder="Channel description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-4 outline-none resize-none"
          />
          <button
            onClick={createChannel}
            className="w-full bg-red-500 text-white font-bold py-3 rounded-xl"
          >
            Channel Banao
          </button>
        </div>
      </div>
    )
  }

  if (!channel) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-gray-400 text-xl">Channel nahi mila!</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="w-full h-32 bg-gradient-to-r from-red-600 to-purple-600" />
      <div className="px-6 pb-6 border-b border-gray-800">
        <div className="flex items-end gap-4 -mt-8 mb-4">
          <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-black">
            {channel.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 pb-2">
            {editing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-800 text-white rounded px-3 py-1 w-full outline-none"
                />
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-gray-800 text-white rounded px-3 py-1 w-full outline-none text-sm"
                />
                <div className="flex gap-2">
                  <button onClick={updateChannel} className="bg-red-500 text-white px-4 py-1 rounded-full text-sm">Save</button>
                  <button onClick={() => setEditing(false)} className="bg-gray-700 text-white px-4 py-1 rounded-full text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-white text-2xl font-bold">{channel.name}</h1>
                <p className="text-gray-400 text-sm">{channel.subscribers || 0} subscribers</p>
                <p className="text-gray-400 text-sm">{channel.description}</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {isOwner ? (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(true)}
                className="bg-gray-800 text-white px-6 py-2 rounded-full font-medium"
              >
                Edit Channel
              </button>
              <button
                onClick={() => navigate('/upload')}
                className="bg-red-500 text-white px-6 py-2 rounded-full font-medium"
              >
                Upload Video
              </button>
            </div>
          ) : (
            <button
              onClick={handleSubscribe}
              className={`px-6 py-2 rounded-full font-bold ${subscribed ? 'bg-gray-700 text-white' : 'bg-red-500 text-white'}`}
            >
              {subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          )}
        </div>
      </div>
      <div className="p-6">
        <h2 className="text-white text-xl font-bold mb-4">Videos</h2>
        {videos.length === 0 ? (
          <p className="text-gray-400">Koi video nahi hai</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => navigate(`/watch/${video.id}`)}
                className="cursor-pointer"
              >
                <div className="aspect-video bg-gray-800 rounded-xl overflow-hidden mb-2">
                  {video.thumbnail_url ? (
                    <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🎬</div>
                  )}
                </div>
                <h3 className="text-white text-sm font-medium">{video.title}</h3>
                <p className="text-gray-400 text-xs">{video.views} views</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}