"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Category = { name: string; count: number; image: string; href: string };

export default function CategorySlider({ categories }: { categories: Category[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="relative w-full overflow-hidden"
      dir="rtl"
      style={{
        maskImage: "linear-gradient(to left, transparent 0%, black 4%, black 96%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to left, transparent 0%, black 4%, black 96%, transparent 100%)",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex gap-3 w-max animate-scroll-rtl"
        style={{ animationPlayState: paused ? "paused" : "running" }}
      >
        {[...categories, ...categories, ...categories].map((cat, i) => {
          const isHovered = hovered === i;
          return (
            <div
              key={`${cat.name}-${i}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="relative shrink-0"
            >
              <Link
                href={cat.href}
                className={`relative flex flex-col items-center gap-2 py-4 px-4 sm:py-5 sm:px-5 rounded-2xl border transition-all duration-300 w-[130px] sm:w-[150px] ${isHovered ? "bg-white border-[#A842E4]/30 shadow-[0_12px_40px_rgba(133,67,192,0.15)] -translate-y-2 scale-[1.03] z-10" : "bg-white/80 border-gray-100/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"}`}
              >
                {/* Top gradient line */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 h-[3px] rounded-b-full bg-gradient-to-r from-[#A842E4] to-[#7A2FCC] transition-all duration-300 ${isHovered ? "w-3/4 opacity-100" : "w-0 opacity-0"}`} />

                {/* Image */}
                <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden transition-all duration-300 ${isHovered ? "bg-gradient-to-br from-[#f3eafc] to-[#e8ddf5] shadow-md shadow-purple-100" : "bg-gray-50"}`}>
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      unoptimized
                      className={`object-contain p-2 transition-transform duration-300 ${isHovered ? "scale-110" : ""}`}
                      sizes="64px"
                    />
                  ) : (
                    <span className="flex items-center justify-center w-full h-full text-2xl">🛍️</span>
                  )}
                </div>

                {/* Name */}
                <span className={`text-[11px] sm:text-xs font-bold text-center leading-tight line-clamp-2 transition-colors duration-200 ${isHovered ? "text-[#7A2FCC]" : "text-gray-700"}`}>
                  {cat.name}
                </span>

                {/* Count badge */}
                {cat.count > 0 && (
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full transition-all duration-300 ${isHovered ? "bg-[#7A2FCC] text-white" : "bg-gray-100 text-gray-500"}`}>
                    {cat.count} منتج
                  </span>
                )}
              </Link>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes scroll-rtl {
          0% { transform: translateX(0); }
          100% { transform: translateX(33.333%); }
        }
        .animate-scroll-rtl {
          animation: scroll-rtl 70s linear infinite;
        }
      `}</style>
    </div>
  );
}
