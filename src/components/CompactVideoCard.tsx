import { Link } from 'react-router-dom';
import { Video } from '../data/videos';
import { CheckCircle2 } from 'lucide-react';

interface CompactCardProps {
  video: Video;
}

export default function CompactVideoCard({ video }: CompactCardProps) {
  return (
    <Link
      to={`/watch/${video.id}`}
      className="flex gap-2 group cursor-pointer animate-fade-in"
    >
      <div className="relative w-40 sm:w-44 shrink-0 aspect-video rounded-lg overflow-hidden bg-yt-hover dark:bg-yt-card-dark">
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {video.duration === 'LIVE' ? (
          <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-red-600 text-white text-[10px] font-medium">
            LIVE
          </span>
        ) : (
          <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-white text-[10px] font-medium">
            {video.duration}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0 pr-2">
        <h3 className="text-sm font-medium text-yt-text dark:text-yt-text-dark line-clamp-2 leading-5">
          {video.title}
        </h3>
        <div className="flex items-center gap-1 mt-1 text-xs text-yt-text-secondary dark:text-yt-text-secondary-dark">
          <span className="truncate">{video.channelName}</span>
          {video.channelVerified && <CheckCircle2 className="w-3 h-3 shrink-0" />}
        </div>
        <div className="text-xs text-yt-text-secondary dark:text-yt-text-secondary-dark mt-0.5">
          {video.views} • {video.uploadedAt}
        </div>
      </div>
    </Link>
  );
}
