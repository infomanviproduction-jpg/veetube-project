import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { UIProvider } from './context/UIContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Watch from './pages/Watch'
import Search from './pages/Search'
import Channel from './pages/Channel'
import Upload from './pages/Upload'
import Profile from './pages/Profile'
import Analytics from './pages/Analytics'
import Studio from './pages/Studio'
import Notifications from './pages/Notifications'
import Auth from './components/Auth'
import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export default function App() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-500 text-3xl font-bold">VeeTube</p>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <UIProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/watch/:id" element={<Watch />} />
              <Route path="/search" element={<Search />} />
              <Route path="/channel/:id" element={<Channel />} />
              <Route path="/upload" element={user ? <Upload /> : <Auth />} />
              <Route path="/profile" element={user ? <Profile /> : <Auth />} />
              <Route path="/analytics" element={user ? <Analytics /> : <Auth />} />
              <Route path="/studio" element={user ? <Studio /> : <Auth />} />
              <Route path="/notifications" element={user ? <Notifications /> : <Auth />} />
              <Route path="/login" element={<Auth />} />
              <Route path="*" element={<Home />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UIProvider>
    </ThemeProvider>
  )
}
