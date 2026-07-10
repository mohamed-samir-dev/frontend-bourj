"use client";
import { useEffect, useRef, useState } from "react";
import ContactSection from "../components/ContactSection";

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0) rotate(0deg)" : "translateY(40px) rotate(0.5deg)",
      transition: `all 0.8s cubic-bezier(.16,1,.3,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

/* ── Data ── */
const features = [
  { icon: "🛡️", value: "١٠٠٪", label: "ضمان الجودة", color: "from-[#0F4C6E] to-[#1F6F8B]" },
  { icon: "🎧", value: "٢٤/٧", label: "دعم فني متواصل", color: "from-[#1F6F8B] to-[#0a3550]" },
  { icon: "💳", value: "٠٪", label: "بدون فوائد", color: "from-[#7CC043] to-[#5a9030]" },
  { icon: "🚀", value: "سريع", label: "توصيل فوري", color: "from-[#0a3550] to-[#0F4C6E]" },
];

const timeline = [
  {
    title: "من نحن",
    paragraphs: [
      "مؤسسة تبارك التقنية الذكية هي متجر إلكتروني متخصص في تقديم المنتجات والخدمات بجودة عالية وتجربة شراء سهلة وآمنة تناسب احتياجات العملاء.",
      "نحرص على توفير أفضل الحلول والعروض مع الاهتمام بالتفاصيل التي تمنح العميل تجربة احترافية بداية من تصفح المنتجات وحتى إتمام الطلب.",
      "اختيارك الأول لشراء أحدث الأجهزة الإلكترونية بأقساط سهلة وبدون فوائد، مع دعم فني وضمان يخليك واثق إنك تتعامل مع متجر يحط رضاك فوق كل اعتبار.",
    ],
  },
  {
    title: "رؤيتنا",
    paragraphs: [
      "تقديم تجربة تسوق إلكترونية موثوقة وسريعة ومريحة، مع الحفاظ على أعلى معايير الجودة وخدمة العملاء.",
    ],
  },
  {
    title: "رسالتنا",
    paragraphs: [
      "نسعى إلى بناء ثقة طويلة الأمد مع عملائنا من خلال منتجات مميزة، دعم سريع، وشفافية كاملة في التعامل.",
    ],
  },
];

export default function AboutClient() {
  const [heroReady, setHeroReady] = useState(false);
  const [company, setCompany] = useState<{ whatsapp?: string; email?: string; addressAr?: string } | null>(null);

  useEffect(() => { setTimeout(() => setHeroReady(true), 80); }, []);
  useEffect(() => {
    fetch("/api/admin/company").then(r => r.json()).then(d => setCompany(d)).catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-[#f0f7fb] overflow-x-hidden" dir="rtl">

      {/* ════════ HERO ════════ */}
      <section className="relative min-h-[420px] sm:min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0" style={{ background: "conic-gradient(from 220deg at 70% 30%, #0a3550, #0F4C6E, #1F6F8B, #0F4C6E, #0a3550)" }} />

        {/* Geometric shapes */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[10%] right-[5%] w-72 h-72 border border-white/10 rounded-full" style={{ animation: "spin 25s linear infinite" }} />
          <div className="absolute bottom-[15%] left-[8%] w-48 h-48 border border-white/[0.07] rounded-full" style={{ animation: "spin 18s linear infinite reverse" }} />
          <div className="absolute top-[40%] left-[20%] w-3 h-3 bg-[#7CC043] rounded-full opacity-60" style={{ animation: "pulse 2s ease-in-out infinite" }} />
          <div className="absolute top-[25%] right-[30%] w-2 h-2 bg-[#B8D8EC] rounded-full opacity-50" style={{ animation: "pulse 3s ease-in-out infinite 0.5s" }} />
          <div className="absolute bottom-[30%] right-[15%] w-4 h-4 bg-[#7CC043]/40 rounded-full blur-sm" style={{ animation: "pulse 2.5s ease-in-out infinite 1s" }} />
          {/* Diagonal lines */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 30px)" }} />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 py-20">
          <div style={{ opacity: heroReady ? 1 : 0, transform: heroReady ? "scale(1)" : "scale(0.9)", transition: "all 0.9s cubic-bezier(.16,1,.3,1) 100ms" }}>
            <div className="inline-flex items-center gap-2 bg-white/[0.08] backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-sm text-[#B8D8EC] mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7CC043] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7CC043]" />
              </span>
              تعرّف علينا
            </div>
          </div>

          <h1 style={{ opacity: heroReady ? 1 : 0, transform: heroReady ? "translateY(0)" : "translateY(30px)", transition: "all 0.9s cubic-bezier(.16,1,.3,1) 250ms" }}
            className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-5 leading-[1.15]">
            مؤسسة{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-l from-[#B8D8EC] via-white to-[#7CC043]">تبارك</span>
            </span>
            <br />
            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#B8D8EC]/80">التقنية الذكية</span>
          </h1>

          <p style={{ opacity: heroReady ? 1 : 0, transform: heroReady ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s cubic-bezier(.16,1,.3,1) 450ms" }}
            className="text-[#B8D8EC]/80 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            نقدّم لك تجربة تسوّق إلكترونية فريدة بأعلى معايير الجودة والثقة
          </p>
        </div>

        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 80" className="w-full h-14 sm:h-20" preserveAspectRatio="none">
            <path d="M0,60 C360,0 1080,80 1440,20 L1440,80 L0,80 Z" fill="#f0f7fb" />
          </svg>
        </div>
      </section>

      {/* ════════ STATS STRIP ════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 -mt-6 sm:-mt-8 relative z-20">
        <Reveal>
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-[#0F4C6E]/5 border border-[#B8D8EC]/30 p-4 sm:p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {features.map((f, i) => (
                <div key={f.label} className="group text-center p-3 sm:p-4 rounded-xl hover:bg-[#f0f7fb] transition-colors duration-300" style={{ transitionDelay: `${i * 50}ms` }}>
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl sm:text-3xl shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300`}>
                    {f.icon}
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-[#0a3550]">{f.value}</p>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">{f.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ════════ TIMELINE SECTIONS ════════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute top-0 bottom-0 right-6 sm:right-8 w-[2px] bg-gradient-to-b from-[#0F4C6E] via-[#1F6F8B] to-[#7CC043] rounded-full opacity-20" />

          <div className="space-y-10 sm:space-y-14">
            {timeline.map((item, i) => (
              <Reveal key={item.title} delay={i * 120}>
                <div className="relative flex gap-4 sm:gap-6">
                  {/* Timeline dot */}
                  <div className="relative z-10 shrink-0">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${i === 0 ? "from-[#0F4C6E] to-[#1F6F8B]" : i === 1 ? "from-[#1F6F8B] to-[#0a3550]" : "from-[#7CC043] to-[#5a9030]"} flex items-center justify-center shadow-lg`}>
                      <span className="text-white text-lg sm:text-2xl font-black">{i === 0 ? "🏢" : i === 1 ? "🎯" : "⭐"}</span>
                    </div>
                  </div>

                  {/* Content card */}
                  <div className="flex-1 bg-white rounded-2xl sm:rounded-3xl border border-[#B8D8EC]/30 shadow-sm hover:shadow-lg hover:shadow-[#0F4C6E]/5 transition-all duration-500 overflow-hidden">
                    <div className={`h-1 w-full bg-gradient-to-l ${i === 0 ? "from-[#0F4C6E] to-[#1F6F8B]" : i === 1 ? "from-[#1F6F8B] to-[#0a3550]" : "from-[#7CC043] to-[#5a9030]"}`} />
                    <div className="p-5 sm:p-7">
                      <h2 className="text-lg sm:text-2xl font-black text-[#0a3550] mb-3 sm:mb-4">{item.title}</h2>
                      <div className="space-y-3">
                        {item.paragraphs.map((p, j) => (
                          <p key={j} className="text-gray-600 leading-[1.9] text-sm sm:text-base">{p}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ WHY US BANNER ════════ */}
      <Reveal>
        <section className="max-w-5xl mx-auto px-4 sm:px-8 pb-12">
          <div className="relative rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, #0a3550 0%, #0F4C6E 50%, #1F6F8B 100%)" }}>
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
            <div className="relative p-8 sm:p-12 text-center">
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">لماذا تختارنا؟</h3>
              <p className="text-[#B8D8EC]/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
                نجمع بين الجودة والسعر المناسب مع خدمة عملاء استثنائية تجعل تجربتك معنا لا تُنسى
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { emoji: "✅", text: "منتجات أصلية ١٠٠٪" },
                  { emoji: "📦", text: "شحن سريع لجميع المناطق" },
                  { emoji: "💬", text: "دعم فني على مدار الساعة" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3 bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-xl p-4 text-white text-sm sm:text-base">
                    <span className="text-xl">{item.emoji}</span>
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ════════ CONTACT ════════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 pb-16">
        <ContactSection
          title="وسائل التواصل"
          phone={company?.whatsapp}
          whatsapp={company?.whatsapp}
          email={company?.email}
          fadeDelay={200}
        />
      </section>

      {/* CSS Keyframes */}
      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}
