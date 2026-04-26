"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

/* ─────────────────────────────────────────
   FETCH HOOK
───────────────────────────────────────── */



function useHomeData() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/api/data?collection=home")
      .then((r) => r.json())
      .then((res) => {
        const doc = Array.isArray(res) ? res[0] : res;
        setData(doc);
      })
      .catch(console.error);
  }, []);
  return data;
}

/* ─────────────────────────────────────────
   SCROLL REVEAL HOOK
───────────────────────────────────────── */
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ═══════════════════════════════════════
   ROOT PAGE
═══════════════════════════════════════ */
export default function HomePage() {
  const data = useHomeData();
  const { language: lang } = useLanguage();

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400">
            Loading
          </span>
        </div>
      </div>
    );
  }

  const t = data.i18n[lang];
  const isRTL = lang === "ar";

  return (
    <>
      <style>{STYLES}</style>
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="min-h-screen bg-white text-[#0a0a0a] overflow-x-hidden"
        style={{ fontFamily: "'DM Sans', 'Tajawal', sans-serif" }}
      >
        <Hero data={data} t={t} />
        <Why data={data} t={t} />
        <Services data={data} t={t} />
        <Stats data={data} t={t} />
      </div>
    </>
  );
}

/* ═══════════════════════════════════════
   HERO
   FIX 1 — أزلنا whitespace-nowrap من الـ h1
   FIX 3 — خلينا py و min-h responsive
═══════════════════════════════════════ */function Hero({ data, t }) {
  const titleRef = useRef(null);

useEffect(() => {
  const el = titleRef.current;
  if (!el) return;

  const fit = () => {
    const parent = el.parentElement;
    // نقطة بداية أصغر على الموبايل
    const startSize = window.innerWidth < 768 ? 1.5 : 3.5;
    el.style.fontSize = startSize + "rem";
    
    while (el.scrollWidth > parent.clientWidth) {
      const current = parseFloat(window.getComputedStyle(el).fontSize);
      el.style.fontSize = (current - 0.1) + "px";
    }
  };

  const observer = new ResizeObserver(fit);
  observer.observe(el.parentElement);
  fit();
  return () => observer.disconnect();
}, []);

  return (
    <section className="relative overflow-hidden bg-[#1E3561]">
      <div className="w-full flex flex-col md:flex-row md:items-stretch">

        {/* LEFT — Text */}
        <div className="w-full md:w-[35%] flex flex-col justify-center px-5 sm:px-8 md:px-10 pt-6 sm:py-16 md:py-0 min-h-[220px] md:min-h-[340px]">
          <h1
            ref={titleRef}
            className="font-black tracking-tighter mb-4 animate-fadein-up leading-[1.1] whitespace-nowrap"
            style={{ color: "#ffffff" }}
          >
            {t.hero.headline}
          </h1>

          <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed animate-fadein-up2 max-w-[280px] sm:max-w-xs md:max-w-none">
            {t.hero.subheadline}
          </p>
        </div>

        {/* RIGHT — Image */}
        <div className="w-full md:w-[65%] flex items-center justify-center md:justify-end pb-6 sm:py-6 px-4 sm:px-6">
          <div className="relative w-full md:w-[92%] aspect-[16/9] md:aspect-[4/3]">
            <Image
              src={data.hero.backgroundImage}
              alt="hero"
              fill
              className="object-cover object-center rounded-xl"
              priority
              unoptimized
            />
          </div>
        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   WHY SECTION
   FIX 2 — صلحنا w-52 h-52 → w-5 h-5
═══════════════════════════════════════ */
function Why({ data, t }) {
  const [ref, visible] = useReveal();

  return (
    <section ref={ref} className="py-10 sm:py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-10 md:px-16 grid lg:grid-cols-2 gap-10 md:gap-16 lg:gap-20 items-center">
{/* Image */}
<div
  className={`hidden sm:block relative overflow-hidden rounded-2xl aspect-[3/2] sm:aspect-[4/3] w-full transition-all duration-700 ease-out ${
    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
  }`}
>
  <Image
    src={data.why.image}
    alt="Why Edumaster"
    fill
    className="object-cover"
    unoptimized
  />
  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C9A227]" />
</div>

        {/* Content */}
        <div>
<h2 className={`text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight mb-2 sm:mb-5 transition-all duration-700 delay-100 ${
  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
}`}>
  {t.why.title}
</h2>

          <ul className="flex flex-col divide-y divide-gray-100">
            {t.why.points.map((point, i) => (
              <li
                key={i}
                className={`flex items-start gap-3 py-3.5 sm:py-4 transition-all duration-500 ${
                  visible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-6"
                }`}
                style={{ transitionDelay: `${150 + i * 70}ms` }}
              >
                {/* FIX 2: كان w-52 h-52 (208px!) → صح w-5 h-5 */}
                <span className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center mt-0.5">
                  <Check size={18} color="#C9A227" />
                </span>
                <span className="text-gray-700 font-medium text-sm sm:text-[15px] leading-snug">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   SERVICES
   FIX 5 — صلحنا ترتيب header row على موبايل
═══════════════════════════════════════ */
function Services({ data, t }) {
  const [ref, visible] = useReveal();

  const merged = data.services.items.map((item) => ({
    ...item,
    ...t.services.items[item.id],
  }));

  return (
    <section ref={ref} className="py-10 sm:py-20 md:py-28 bg-[#f7f7f7]">
      <div className="px-5 sm:px-10 md:px-16">

        {/* FIX 5: flex-col على موبايل, flex-row على sm+ — ده هو الترتيب الصح */}
        <div
          className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-7 sm:mb-14 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight">
              {t.services.title}
            </h2>
          </div>
          <Link
            href={data.services.ctaHref}
            className="inline-flex items-center gap-2 border-2 border-[#0a0a0a] text-[#0a0a0a] font-bold px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm hover:bg-[#0a0a0a] hover:text-white transition-all shrink-0 self-start sm:self-auto w-fit"
          >
            {t.services.cta}
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {merged.map((s, i) => (
            <ServiceCard key={s.id} service={s} visible={visible} delay={i * 70} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, visible, delay }) {
  return (
    <Link
      href={"/services/"}
      className={`group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-[#C9A227]/30 hover:shadow-xl hover:shadow-amber-900/5 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Image */}
      <div className="relative h-36 sm:h-48 overflow-hidden bg-gray-100">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        <div
          className="absolute top-0 inset-x-0 h-[3px]"
          style={{ background: service.color }}
        />
      </div>

      {/* Body */}
      <div className="p-4 sm:p-6 flex flex-col gap-2.5 sm:gap-3 flex-1">
        <h3 className="font-black text-[#0a0a0a] text-sm sm:text-base leading-snug group-hover:text-[#C9A227] transition-colors duration-150">
          {service.title}
        </h3>
        <p className="text-gray-500 text-xs sm:text-sm leading-relaxed flex-1">
          {service.desc}
        </p>
        <div className="flex items-center gap-1 text-xs font-bold text-[#C9A227] mt-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
          Learn more <ArrowRight size={12} />
        </div>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════
   STATS
   FIX 4 — صلحنا bg-white/8 → bg-white/[0.08]
═══════════════════════════════════════ */
function Stats({ data, t }) {
  const [ref, visible] = useReveal();

  const merged = data.stats.items.map((item, i) => ({
    ...item,
    label: t.stats.items[i],
  }));

  return (
    <section
      ref={ref}
      className="relative py-10 sm:py-20 md:py-28 overflow-hidden bg-[#0a0a0a]"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0 opacity-15">
        <Image
          src={data.stats.backgroundImage}
          alt=""
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      {/* accent top border */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-[#C9A227] z-10" />

      <div className="relative z-10 px-5 sm:px-10 md:px-16">
        <div
          className={`mb-7 sm:mb-14 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
<h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
  {t.stats.title}
</h2>
        </div>

        {/* FIX 4: bg-white/8 → bg-white/[0.08] و border-white/8 → border-white/[0.08] */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.08] rounded-2xl overflow-hidden border border-white/[0.08]">
          {merged.map((s, i) => (
            <div
              key={i}
              className={`bg-[#111] p-4 sm:p-8 md:p-10 flex flex-col gap-2 transition-all duration-500 ${
                visible ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <span className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">
                {s.value}
              </span>
              <span className="text-gray-400 text-[9px] xs:text-[10px] sm:text-xs font-semibold uppercase tracking-widest mt-1 sm:mt-2 leading-tight">
                {s.label}
              </span>
              <div className="w-4 sm:w-6 h-0.5 bg-[#C9A227] mt-1.5 sm:mt-2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   LABEL — Section Label
═══════════════════════════════════════ */
function Label({ text, visible, dark = false }) {
  return (
    <div
      className={`flex items-center gap-2 mb-3 transition-all duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="w-4 sm:w-5 h-px bg-[#C9A227]" />
      <span
        className={`text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase ${
          dark ? "text-gray-400" : "text-[#C9A227]"
        }`}
      >
        {text}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════
   INLINE SVG ICONS
═══════════════════════════════════════ */
function ArrowRight({ size = 16, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function Check({ size = 16, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

/* ═══════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&family=Tajawal:wght@300;400;700;800&display=swap');

  @keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes fadein-up {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .animate-fadein      { animation: fadein    0.6s ease both; }
  .animate-fadein-up   { animation: fadein-up 0.7s ease 0.1s both; }
  .animate-fadein-up2  { animation: fadein-up 0.7s ease 0.25s both; }

  /* xs breakpoint (360px–479px) */
  @media (min-width: 360px) {
    .xs\\:text-3xl   { font-size: 1.875rem; line-height: 2.25rem; }
    .xs\\:flex-row   { flex-direction: row; }
    .xs\\:w-auto     { width: auto; }
    .xs\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .xs\\:text-\\[10px\\] { font-size: 10px; }
    .xs\\:text-3xl   { font-size: 1.875rem; }
  }

  /* منع الـ overflow على أي شاشة */
  * { box-sizing: border-box; }
  img { max-width: 100%; }
`;