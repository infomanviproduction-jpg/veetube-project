import { useState } from 'react'
import { supabase } from '../supabase'

const Auth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAuth = async () => {
    setLoading(true)
    setMessage('')

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage('❌ ' + error.message)
      else setMessage('✅ Login ho gaye!')
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage('❌ ' + error.message)
      else setMessage('✅ Account ban gaya! Email check karo!')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md">
        
        {/* Logo */}
        <h1 className="text-red-500 text-3xl font-bold text-center mb-2">
          VeeTube
        </h1>
        <p className="text-gray-400 text-center mb-6">
          {isLogin ? 'Login karo' : 'Account banao'}
        </p>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-3 outline-none focus:ring-2 focus:ring-red-500"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-red-500"
        />

        {/* Button */}
        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition"
        >
          {loading ? 'Wait...' : isLogin ? 'Login' : 'Sign Up'}
        </button>

        {/* Message */}
        {message && (
          <p className="text-center mt-4 text-sm text-gray-300">{message}</p>
        )}

        {/* Toggle */}
        <p className="text-center mt-4 text-gray-400 text-sm">
          {isLogin ? 'Create account? ' : 'Pehle se account hai? '}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-red-500 cursor-pointer hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  )
}

export default Auth