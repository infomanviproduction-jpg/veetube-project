import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getChannelByHandle, getVideosByChannelHandle } from '../data/videos';
import VideoCard from '../components/VideoCard';
import { CheckCircle2, Bell, Link as LinkIcon } from 'lucide-react';

const tabs = ['Home', 'Videos', 'Playlists', 'About'];

export default function Channel() {
  const { id } = useParams();
  const handle = id ? `@${id}` : '';
  const channel = getChannelByHandle(handle);
  const [activeTab, setActiveTab] = useState('Home');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveTab('Home');
    setSubscribed(false);
  }, [id]);

  if (!channel) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-lg font-medium">Channel not found</p>
      </div>
    );
  }

  const channelVideos = getVideosByChannelHandle(channel.handle);

  return (
    <div className="pb-8">
      {/* Banner */}
      <div className="h-32 sm:h-44 lg:h-56 w-full overflow-hidden">
        <img src={channel.banner} alt="" className="w-full h-full object-cover" />
      </div>

      {/* Channel header */}
      <div className="px-4 sm:px-6 py-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        <img
          src={channel.avatar}
          alt={channel.name}
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-yt-bg dark:border-yt-bg-dark -mt-12 sm:-mt-16 shrink-0"
        />
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            {channel.name}
            {channel.verified && <CheckCircle2 className="w-5 h-5 text-yt-text-secondary dark:text-yt-text-secondary-dark" />}
          </h1>
          <div className="text-sm text-yt-text-secondary dark:text-yt-text-secondary-dark mt-1">
            {channel.handle} • {channel.subscribers} subscribers • {channel.videoCount} videos
          </div>
          <p className="text-sm text-yt-text-secondary dark:text-yt-text-secondary-dark mt-2 line-clamp-1">
            {channel.description}
          </p>
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={() => setSubscribed((s) => !s)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                subscribed
                  ? 'bg-yt-hover dark:bg-yt-hover-dark text-yt-text dark:text-yt-text-dark'
                  : 'bg-yt-text dark:bg-yt-text-dark text-yt-bg dark:text-yt-bg-dark hover:bg-yt-hover dark:hover:bg-yt-hover-dark'
              }`}
            >
              {subscribed ? (
                <>
                  <Bell className="w-4 h-4" /> Subscribed
                </>
              ) : (
                'Subscribe'
              )}
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-yt-hover dark:bg-yt-hover-dark text-sm font-medium hover:bg-yt-border dark:hover:bg-yt-border-dark transition-colors">
              <LinkIcon className="w-4 h-4" /> {channel.handle}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 sm:px-6 border-b border-yt-border dark:border-yt-border-dark">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-yt-text dark:border-yt-text-dark text-yt-text dark:text-yt-text-dark'
                  : 'border-transparent text-yt-text-secondary dark:text-yt-text-secondary-dark hover:text-yt-text dark:hover:text-yt-text-dark'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-4 sm:px-6 py-6">
        {activeTab === 'Home' && (
          <div>
            <div className="rounded-xl overflow-hidden mb-6 bg-yt-hover dark:bg-yt-card-dark">
              {channelVideos[0] && (
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-1/2 aspect-video">
                    <img src={channelVideos[0].thumbnail} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 flex-1">
                    <h2 className="text-lg font-bold mb-2">{channelVideos[0].title}</h2>
                    <p className="text-sm text-yt-text-secondary dark:text-yt-text-secondary-dark mb-2">
                      {channelVideos[0].views} • {channelVideos[0].uploadedAt}
                    </p>
                    <p className="text-sm line-clamp-4">{channelVideos[0].description}</p>
                  </div>
                </div>
              )}
            </div>
            <h2 className="font-bold text-lg mb-4">Recent videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
              {channelVideos.slice(0, 4).map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Videos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {channelVideos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        )}

        {activeTab === 'Playlists' && (
          <div className="text-center py-20">
            <p className="text-lg font-medium mb-2">No public playlists yet</p>
            <p className="text-sm text-yt-text-secondary dark:text-yt-text-secondary-dark">
              Playlists created by this channel will appear here
            </p>
          </div>
        )}

        {activeTab === 'About' && (
          <div className="max-w-2xl">
            <h2 className="font-bold text-lg mb-3">Description</h2>
            <p className="text-sm whitespace-pre-wrap mb-6">{channel.description}</p>
            <h2 className="font-bold text-lg mb-3">Stats</h2>
            <div className="text-sm space-y-1 text-yt-text-secondary dark:text-yt-text-secondary-dark">
              <p>{channel.subscribers} subscribers</p>
              <p>{channel.videoCount} videos</p>
              <p>Joined Jan 1, 2018</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
