"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

type Category = { name: string; count: number; image: string; href: string };

export default function CategorySlider({ categories }: { categories: Category[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  const colors = [
    { bg: "from-violet-500 to-purple-600", light: "bg-violet-50", ring: "ring-violet-200" },
    { bg: "from-rose-500 to-pink-600", light: "bg-rose-50", ring: "ring-rose-200" },
    { bg: "from-sky-500 to-blue-600", light: "bg-sky-50", ring: "ring-sky-200" },
    { bg: "from-amber-500 to-orange-600", light: "bg-amber-50", ring: "ring-amber-200" },
    { bg: "from-emerald-500 to-teal-600", light: "bg-emerald-50", ring: "ring-emerald-200" },
    { bg: "from-fuchsia-500 to-purple-600", light: "bg-fuchsia-50", ring: "ring-fuchsia-200" },
    { bg: "from-indigo-500 to-blue-600", light: "bg-indigo-50", ring: "ring-indigo-200" },
    { bg: "from-red-500 to-rose-600", light: "bg-red-50", ring: "ring-red-200" },
  ];

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-[#7A2FCC] hover:bg-[#7A2FCC] hover:text-white transition-all duration-200 -translate-x-1/2"
        >
          <IoChevronBack size={20} />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-[#7A2FCC] hover:bg-[#7A2FCC] hover:text-white transition-all duration-200 translate-x-1/2"
        >
          <IoChevronForward size={20} />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide py-4 px-2"
        dir="ltr"
      >
        {categories.map((cat, i) => {
          const color = colors[i % colors.length];
          return (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
              className="shrink-0"
            >
              <Link
                href={cat.href}
                className="group relative w-[130px] sm:w-[150px] h-[170px] sm:h-[190px] flex flex-col items-center justify-center gap-3 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${color.bg} opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-300`} />
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-3xl group-hover:border-[#A842E4]/30 transition-colors duration-300" />

                {/* Decorative corner */}
                <div className={`absolute -top-6 -right-6 w-16 h-16 rounded-full bg-gradient-to-br ${color.bg} opacity-20 group-hover:opacity-40 group-hover:scale-125 transition-all duration-500`} />

                {/* Image */}
                <div className={`relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${color.light} ring-1 ${color.ring} overflow-hidden flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      unoptimized
                      className="object-contain p-2.5"
                      sizes="80px"
                    />
                  ) : (
                    <span className="text-2xl">🛍️</span>
                  )}
                </div>

                {/* Name */}
                <p className="relative z-10 text-[11px] sm:text-xs font-bold text-gray-700 text-center leading-tight line-clamp-2 px-2 group-hover:text-[#7A2FCC] transition-colors duration-200" dir="rtl">
                  {cat.name}
                </p>

                {/* Count pill */}
                {cat.count > 0 && (
                  <span className={`relative z-10 text-[9px] sm:text-[10px] font-bold text-white px-2.5 py-0.5 rounded-full bg-gradient-to-r ${color.bg} shadow-sm`}>
                    {cat.count} منتج
                  </span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
