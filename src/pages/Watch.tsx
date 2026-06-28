import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabase'
import { ThumbsUp, Share2, Download } from 'lucide-react'

export default function Watch() {
  const { id } = useParams()
  const [video, setVideo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    fetchVideo()
  }, [id])

  const fetchVideo = async () => {
    const { data } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .single()
    if (data) setVideo(data)
    setLoading(false)
  }

  const handleLike = async () => {
    if (liked) return
    setLiked(true)
    await supabase
      .from('videos')
      .update({ likes: (video.likes || 0) + 1 })
      .eq('id', id)
    setVideo({ ...video, likes: (video.likes || 0) + 1 })
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('hi-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-white text-xl">Loading...</p>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-white text-xl">Video nahi mili!</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-5xl mx-auto">

        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4">
          <video
            src={video.video_url}
            controls
            autoPlay
            className="w-full h-full"
          />
        </div>

        <h1 className="text-white text-xl font-bold mb-3">
          {video.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
              {video.user_email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-medium">
                {video.user_email?.split('@')[0]}
              </p>
              <p className="text-gray-400 text-sm">
                {video.views} views
              </p>
            </div>
            <button className="ml-4 bg-white text-black px-4 py-1 rounded-full font-bold text-sm">
              Subscribe
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 text-white text-sm"
            >
              <ThumbsUp className="w-4 h-4" />
              {video.likes || 0}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 text-white text-sm">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={() => window.open(video.video_url, '_blank')}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 text-white text-sm"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-2">
            {formatDate(video.created_at)}
          </p>
          <p className="text-white text-sm">
            {video.description || 'Koi description nahi hai.'}
          </p>
        </div>

      </div>
    </div>
  )
}