import React, { useState } from 'react';
import { Play } from 'lucide-react';

export default function YouTubeFacade({ videoId, title = 'Student Video Story' }) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!videoId) return null;

  return (
    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md group">
      {isPlaying ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          className="w-full h-full relative block text-left focus:outline-none focus:ring-2 focus:ring-[#C9A84C] cursor-pointer"
          aria-label={`Play video: ${title}`}
        >
          <img
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt={title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-[#0B1F3A]/30 group-hover:bg-[#0B1F3A]/20 transition-colors flex items-center justify-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0B1F3A]/90 text-white border-2 border-[#C9A84C] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 sm:w-7 sm:h-7 text-[#C9A84C] fill-[#C9A84C] ml-1" />
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
