import { useState } from 'react'
import { supabase } from '../supabase'
import { Upload as UploadIcon, Video, Image, X, Lock, Globe, Link, Clock } from 'lucide-react'

export default function Upload() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')
  const [visibility, setVisibility] = useState('public')
  const [scheduledAt, setScheduledAt] = useState('')

  const uploadToCloudinary = async (file: File, resourceType: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'veetube')
    formData.append('cloud_name', 'dqocu8qnc')

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dqocu8qnc/${resourceType}/upload`,
      { method: 'POST', body: formData }
    )
    const data = await response.json()
    return data.secure_url
  }

  const handleUpload = async () => {
    if (!title || !videoFile) {
      setMessage('❌ Title and Video are required!')
      return
    }

    setUploading(true)
    setProgress(10)
    setMessage('📤 Uploading video...')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      setProgress(30)
      const videoUrl = await uploadToCloudinary(videoFile, 'video')
      
      setProgress(60)
      let thumbnailUrl = ''
      if (thumbnailFile) {
        thumbnailUrl = await uploadToCloudinary(thumbnailFile, 'image')
      }

      setProgress(80)

      // Schedule logic
      const finalVisibility = scheduledAt ? 'scheduled' : visibility

      const { error } = await supabase.from('videos').insert({
        title,
        description,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl || '',
        user_id: user?.id,
        user_email: user?.email,
        visibility: finalVisibility,
        scheduled_at: scheduledAt || null,
      })

      if (error) throw error

      setProgress(100)
      setMessage('✅ Video uploaded successfully!')
      setTitle('')
      setDescription('')
      setVideoFile(null)
      setThumbnailFile(null)
      setVisibility('public')
      setScheduledAt('')

    } catch (err: any) {
      setMessage('❌ Error: ' + err.message)
    }

    setUploading(false)
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-2xl mx-auto bg-gray-900 rounded-2xl p-8">
        
        <h1 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
          <UploadIcon className="text-red-500" /> Upload Video
        </h1>

        {/* Title */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-1 block">Video Title *</label>
          <input
            type="text"
            placeholder="Enter video title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-1 block">Description</label>
          <textarea
            placeholder="Write about your video..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 resize-none"
          />
        </div>

        {/* Visibility */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-2 block">Visibility</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => { setVisibility('public'); setScheduledAt('') }}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition ${
                visibility === 'public' && !scheduledAt
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-gray-700 bg-gray-800'
              }`}
            >
              <Globe className="w-5 h-5 text-green-400" />
              <span className="text-white text-xs font-medium">Public</span>
              <span className="text-gray-400 text-[10px]">Everyone</span>
            </button>

            <button
              onClick={() => { setVisibility('unlisted'); setScheduledAt('') }}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition ${
                visibility === 'unlisted' && !scheduledAt
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-gray-700 bg-gray-800'
              }`}
            >
              <Link className="w-5 h-5 text-yellow-400" />
              <span className="text-white text-xs font-medium">Unlisted</span>
              <span className="text-gray-400 text-[10px]">Link only</span>
            </button>

            <button
              onClick={() => { setVisibility('private'); setScheduledAt('') }}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition ${
                visibility === 'private' && !scheduledAt
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-gray-700 bg-gray-800'
              }`}
            >
              <Lock className="w-5 h-5 text-red-400" />
              <span className="text-white text-xs font-medium">Private</span>
              <span className="text-gray-400 text-[10px]">Only you</span>
            </button>
          </div>
        </div>

        {/* Schedule */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-1 block flex items-center gap-2">
            <Clock className="w-4 h-4" /> Schedule (Optional)
          </label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
          />
          {scheduledAt && (
            <p className="text-yellow-400 text-xs mt-1">
              ⏰ Video will be published automatically at scheduled time!
            </p>
          )}
        </div>

        {/* Video Upload */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-1 block">Video File *</label>
          <div
            className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-red-500 transition cursor-pointer"
            onClick={() => document.getElementById('videoInput')?.click()}
          >
            {videoFile ? (
              <div className="flex items-center justify-center gap-2">
                <Video className="text-red-500" />
                <span className="text-white">{videoFile.name}</span>
                <X className="text-gray-400 cursor-pointer" onClick={(e) => { e.stopPropagation(); setVideoFile(null) }} />
              </div>
            ) : (
              <div>
                <Video className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400">Click to select video</p>
                <p className="text-gray-600 text-sm">MP4, AVI, MOV supported</p>
              </div>
            )}
          </div>
          <input id="videoInput" type="file" accept="video/*" className="hidden"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
        </div>

        {/* Thumbnail */}
        <div className="mb-6">
          <label className="text-gray-400 text-sm mb-1 block">Thumbnail (Optional)</label>
          <div
            className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-red-500 transition cursor-pointer"
            onClick={() => document.getElementById('thumbnailInput')?.click()}
          >
            {thumbnailFile ? (
              <div className="flex items-center justify-center gap-2">
                <Image className="text-red-500" />
                <span className="text-white">{thumbnailFile.name}</span>
                <X className="text-gray-400 cursor-pointer" onClick={(e) => { e.stopPropagation(); setThumbnailFile(null) }} />
              </div>
            ) : (
              <div>
                <Image className="w-8 h-8 text-gray-500 mx-auto mb-1" />
                <p className="text-gray-400 text-sm">Select thumbnail</p>
              </div>
            )}
          </div>
          <input id="thumbnailInput" type="file" accept="image/*" className="hidden"
            onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
        </div>

        {/* Progress */}
        {uploading && (
          <div className="mb-4">
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-red-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-gray-400 text-sm mt-1 text-center">{progress}%</p>
          </div>
        )}

        {message && (
          <p className="text-center mb-4 text-sm font-bold text-gray-300">{message}</p>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white font-bold py-3 rounded-xl transition"
        >
          {uploading ? 'Uploading...' : '🚀 Upload'}
        </button>

      </div>
    </div>
  )
}