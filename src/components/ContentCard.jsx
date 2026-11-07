import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Image as ImageIcon } from 'lucide-react';

const ContentCard = ({ item }) => {
  return (
    <Link
      to={`/content/${item._id}`}
      className="bg-[#172033] rounded-lg overflow-hidden border border-[#1e293b] hover:border-[#5d5fef]/50 transition group flex flex-col"
    >
      {/* Poster Thumbnail */}
      <div className="w-full aspect-[4/5] bg-[#1e293b]/50 relative flex items-center justify-center overflow-hidden">
        {item.posterUrl ? (
          <img
            src={item.posterUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-500">
            <ImageIcon className="w-8 h-8 mb-1" />
            <span className="text-xs">Poster</span>
          </div>
        )}
      </div>

      {/* Info Body */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="text-white font-semibold text-base truncate" title={item.title}>
            {item.title}
          </h3>
          <button
            onClick={(e) => {
              e.preventDefault();
              // Aksi toggle favorit bisa disematkan di sini
            }}
            className="text-slate-400 hover:text-rose-500 transition"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>
            {item.releaseYear} • {item.category}
          </span>
          <div className="flex items-center gap-1 bg-[#131b2e] px-2 py-0.5 rounded border border-[#1e293b]">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-amber-300">
              {item.rating ? item.rating.toFixed(1) : '4.5'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ContentCard;