import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { Upload as UploadIcon, Video, Image, X } from 'lucide-react'

export default function Upload() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')
  const [hasChannel, setHasChannel] = useState<boolean | null>(null)
  const [channelName, setChannelName] = useState('')
  const [channelHandle, setChannelHandle] = useState('')
  const [channelDesc, setChannelDesc] = useState('')
  const [creatingChannel, setCreatingChannel] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkChannel()
  }, [])

  const checkChannel = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (!user) return
    const { data } = await supabase.from('channels').select('*').eq('user_id', user.id).single()
    setHasChannel(!!data)
  }

  const createChannel = async () => {
    if (!channelName) { setMessage('❌ Channel name is required!'); return }
    setCreatingChannel(true)
    await supabase.from('channels').insert({ user_id: user?.id, name: channelName, description: channelDesc })
    setHasChannel(true)
    setCreatingChannel(false)
  }

  const uploadToCloudinary = async (file: File, resourceType: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'veetube')
    formData.append('cloud_name', 'dqocu8qnc')
    const response = await fetch(`https://api.cloudinary.com/v1_1/dqocu8qnc/${resourceType}/upload`, { method: 'POST', body: formData })
    const data = await response.json()
    return data.secure_url
  }

  const handleUpload = async () => {
    if (!title || !videoFile) { setMessage('❌ Title and video are required!'); return }
    setUploading(true)
    setProgress(10)
    setMessage('📤 Uploading video...')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setProgress(30)
      const videoUrl = await uploadToCloudinary(videoFile, 'video')
      setProgress(60)
      let thumbnailUrl = ''
      if (thumbnailFile) thumbnailUrl = await uploadToCloudinary(thumbnailFile, 'image')
      setProgress(80)
      const { error } = await supabase.from('videos').insert({ title, description, video_url: videoUrl, thumbnail_url: thumbnailUrl, user_id: user?.id, user_email: user?.email })
      if (error) throw error
      setProgress(100)
      setMessage('✅ Video uploaded successfully!')
      setTitle(''); setDescription(''); setVideoFile(null); setThumbnailFile(null)
    } catch (err: any) {
      setMessage('❌ Error: ' + err.message)
    }
    setUploading(false)
  }

  if (hasChannel === null) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-white">Loading...</p>
    </div>
  )

  if (!hasChannel) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-gray-900 text-xl font-bold mb-1">Create your channel</h2>
        <p className="text-gray-500 text-sm mb-6">You need a channel to upload videos on VeeTube</p>
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-2">
            <span className="text-4xl">👤</span>
          </div>
        </div>
        <div className="mb-4">
          <label className="text-gray-700 text-sm font-medium mb-1 block">Channel name</label>
          <input
            type="text"
            placeholder="e.g. Manvi Production"
            value={channelName}
            onChange={(e) => { setChannelName(e.target.value); setChannelHandle('@' + e.target.value.toLowerCase().replace(/\s+/g, '')) }}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>
        <div className="mb-4">
          <label className="text-gray-700 text-sm font-medium mb-1 block">Handle</label>
          <input type="text" value={channelHandle} onChange={(e) => setChannelHandle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" />
        </div>
        <div className="mb-6">
          <label className="text-gray-700 text-sm font-medium mb-1 block">Description (Optional)</label>
          <textarea placeholder="Tell viewers about your channel..." value={channelDesc} onChange={(e) => setChannelDesc(e.target.value)} rows={2}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 resize-none" />
        </div>
        {message && <p className="text-red-500 text-sm mb-4">{message}</p>}
        <div className="flex justify-end gap-3">
          <button className="text-gray-600 px-6 py-2 rounded-full font-medium hover:bg-gray-100">Cancel</button>
          <button onClick={createChannel} disabled={creatingChannel}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition">
            {creatingChannel ? 'Creating...' : 'Create Channel'}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-2xl mx-auto bg-gray-900 rounded-2xl p-8">
        <h1 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
          <UploadIcon className="text-red-500" /> Upload Video
        </h1>
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-1 block">Video Title *</label>
          <input type="text" placeholder="Enter video title..." value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-1 block">Description</label>
          <textarea placeholder="Tell viewers about your video..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 resize-none" />
        </div>
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-1 block">Video File *</label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-red-500 transition cursor-pointer"
            onClick={() => document.getElementById('videoInput')?.click()}>
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
          <input id="videoInput" type="file" accept="video/*" className="hidden" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
        </div>
        <div className="mb-6">
          <label className="text-gray-400 text-sm mb-1 block">Thumbnail (Optional)</label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-red-500 transition cursor-pointer"
            onClick={() => document.getElementById('thumbnailInput')?.click()}>
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
          <input id="thumbnailInput" type="file" accept="image/*" className="hidden" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
        </div>
        {uploading && (
          <div className="mb-4">
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div className="bg-red-500 h-3 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-gray-400 text-sm mt-1 text-center">{progress}%</p>
          </div>
        )}
        {message && <p className="text-center mb-4 text-sm font-bold text-gray-300">{message}</p>}
        <button onClick={handleUpload} disabled={uploading}
          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white font-bold py-3 rounded-xl transition">
          {uploading ? 'Uploading...' : '🚀 Upload'}
        </button>
      </div>
    </div>
  )
}