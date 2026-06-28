import { Link } from 'react-router-dom';
import { Video } from '../data/videos';
import { CheckCircle2 } from 'lucide-react';

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <div className="flex flex-col gap-3 group cursor-pointer animate-fade-in">
      <Link to={`/watch/${video.id}`} className="relative block aspect-video w-full rounded-xl overflow-hidden bg-yt-hover dark:bg-yt-card-dark">
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        {video.duration === 'LIVE' ? (
          <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-red-600 text-white text-[11px] font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            LIVE
          </span>
        ) : (
          <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white text-[11px] font-medium">
            {video.duration}
          </span>
        )}
      </Link>
      <div className="flex gap-3">
        <Link to={`/channel/${video.channelHandle.replace('@', '')}`} className="shrink-0">
          <img
            src={video.channelAvatar}
            alt={video.channelName}
            loading="lazy"
            className="w-9 h-9 rounded-full object-cover"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link to={`/watch/${video.id}`}>
            <h3 className="text-sm font-medium text-yt-text dark:text-yt-text-dark line-clamp-2 leading-5">
              {video.title}
            </h3>
          </Link>
          <Link to={`/channel/${video.channelHandle.replace('@', '')}`}>
            <div className="flex items-center gap-1 mt-1 text-xs text-yt-text-secondary dark:text-yt-text-secondary-dark hover:text-yt-text dark:hover:text-yt-text-dark transition-colors">
              <span>{video.channelName}</span>
              {video.channelVerified && (
                <CheckCircle2 className="w-3 h-3 shrink-0" />
              )}
            </div>
          </Link>
          <div className="text-xs text-yt-text-secondary dark:text-yt-text-secondary-dark mt-0.5">
            {video.views} • {video.uploadedAt}
          </div>
        </div>
      </div>
    </div>
  );
}
