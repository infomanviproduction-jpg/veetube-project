import { useState } from 'react'
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
      setMessage('❌ Title aur Video dono zaroori hain!')
      return
    }

    setUploading(true)
    setProgress(10)
    setMessage('📤 Video upload ho rahi hai...')

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
      const { error } = await supabase.from('videos').insert({
        title,
        description,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl || `https://res.cloudinary.com/dqocu8qnc/video/upload/so_0/${videoUrl.split('/').pop()?.split('.')[0]}.jpg`,
        user_id: user?.id,
        user_email: user?.email,
      })

      if (error) throw error

      setProgress(100)
      setMessage('✅ Video upload ho gayi!')
      setTitle('')
      setDescription('')
      setVideoFile(null)
      setThumbnailFile(null)

    } catch (err: any) {
      setMessage('❌ Error: ' + err.message)
    }

    setUploading(false)
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-2xl mx-auto bg-gray-900 rounded-2xl p-8">
        
        <h1 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
          <UploadIcon className="text-red-500" /> Video Upload Karo
        </h1>

        {/* Title */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-1 block">Video Title *</label>
          <input
            type="text"
            placeholder="Apni video ka title likho..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-1 block">Description</label>
          <textarea
            placeholder="Video ke baare mein likho..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 resize-none"
          />
        </div>

        {/* Video Upload */}
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
                <p className="text-gray-400">Video select karne ke liye click karo</p>
                <p className="text-gray-600 text-sm">MP4, AVI, MOV support hai</p>
              </div>
            )}
          </div>
          <input id="videoInput" type="file" accept="video/*" className="hidden"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
        </div>

        {/* Thumbnail Upload */}
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
                <p className="text-gray-400 text-sm">Thumbnail select karo</p>
              </div>
            )}
          </div>
          <input id="thumbnailInput" type="file" accept="image/*" className="hidden"
            onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
        </div>

        {/* Progress Bar */}
        {uploading && (
          <div className="mb-4">
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div className="bg-red-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }} />
            </div>
            <p className="text-gray-400 text-sm mt-1 text-center">{progress}%</p>
          </div>
        )}

        {/* Message */}
        {message && (
          <p className="text-center mb-4 text-sm font-bold text-gray-300">{message}</p>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white font-bold py-3 rounded-xl transition"
        >
          {uploading ? 'Uploading...' : '🚀 Upload Karo'}
        </button>

      </div>
    </div>
  )
}