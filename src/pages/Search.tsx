import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchVideos } from '../data/videos';
import { SearchResultSkeleton } from '../components/Skeletons';
import { CheckCircle2 } from 'lucide-react';

const filters = ['All', 'Video', 'Channel', 'Playlist'];

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [query]);

  const results = searchVideos(query);

  return (
    <div className="px-4 sm:px-6 py-4 max-w-5xl mx-auto">
      {/* Filter buttons */}
      <div className="flex gap-2 mb-4 border-b border-yt-border dark:border-yt-border-dark pb-3">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === f
                ? 'bg-yt-text dark:bg-yt-text-dark text-yt-bg dark:text-yt-bg-dark'
                : 'bg-yt-hover dark:bg-yt-hover-dark hover:bg-yt-border dark:hover:bg-yt-border-dark'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <SearchResultSkeleton count={5} />
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-medium mb-2">No results found</p>
          <p className="text-sm text-yt-text-secondary dark:text-yt-text-secondary-dark">
            Try different keywords or remove search filters
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {results.map((video) => (
            <Link
              key={video.id}
              to={`/watch/${video.id}`}
              className="flex flex-col sm:flex-row gap-4 group cursor-pointer animate-fade-in"
            >
              <div className="relative w-full sm:w-80 aspect-video rounded-xl overflow-hidden shrink-0 bg-yt-hover dark:bg-yt-card-dark">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white text-[11px] font-medium">
                  {video.duration}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-medium line-clamp-2 leading-6 group-hover:text-yt-text-secondary dark:group-hover:text-yt-text-secondary-dark">
                  {video.title}
                </h3>
                <div className="text-xs text-yt-text-secondary dark:text-yt-text-secondary-dark mt-1">
                  {video.views} • {video.uploadedAt}
                </div>
                <Link
                  to={`/channel/${video.channelHandle.replace('@', '')}`}
                  className="flex items-center gap-2 mt-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img src={video.channelAvatar} alt={video.channelName} className="w-6 h-6 rounded-full" />
                  <span className="text-xs text-yt-text-secondary dark:text-yt-text-secondary-dark flex items-center gap-1">
                    {video.channelName}
                    {video.channelVerified && <CheckCircle2 className="w-3 h-3" />}
                  </span>
                </Link>
                <p className="text-sm text-yt-text-secondary dark:text-yt-text-secondary-dark mt-2 line-clamp-2">
                  {video.description.split('\n')[0]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
