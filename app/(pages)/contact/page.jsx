"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

function useContactData() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/api/data?collection=contact")
      .then((r) => r.json())
      .then((res) => { const doc = Array.isArray(res) ? res[0] : res; setData(doc); })
      .catch(console.error);
  }, []);
  return data;
}

function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

export default function ContactPage() {
  const data = useContactData();
  const { language: lang } = useLanguage();

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400">Loading</span>
        </div>
      </div>
    );
  }

  const t = data.i18n[lang];
  const isRTL = lang === "ar";

  return (
    <>
      <style>{STYLES}</style>
      <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-white text-[#0a0a0a] overflow-x-hidden"
        style={{ fontFamily: "'DM Sans', 'Tajawal', sans-serif" }}>
        <ContactHero data={data} t={t} />
        <ContactMain data={data} t={t} />
      </div>
    </>
  );
}

function ContactHero({ data, t }) {
  return (
    <section className="relative flex items-end overflow-hidden bg-[#f4f4f4] min-h-[38vh]">
      <div className="absolute top-0 inset-x-0 h-[3px] bg-[#1D6FD8] z-10" />
      <div className="absolute inset-0 z-0 bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3730a3] via-[#4f46e5] to-[#2563eb]" />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "linear-gradient(#1D6FD8 1px, transparent 1px), linear-gradient(90deg, #1D6FD8 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      </div>
      <div className="relative z-10 w-full px-5 sm:px-8 md:px-6 pb-12 sm:pb-16 md:pb-20 pt-24 sm:pt-28 md:pt-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4 sm:mb-5 animate-fadein">
            <div className="w-6 sm:w-8 h-px bg-[#1D6FD8]" />
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-[#1D6FD8]">{t.hero.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[0.92] tracking-tighter text-white max-w-2xl mb-4 sm:mb-5 animate-fadein-up">
            {t.hero.headline.split(",").map((chunk, i, arr) =>
              i === arr.length - 1
                ? <span key={i} className="text-white">{chunk}</span>
                : <span key={i}>{chunk},<br /></span>
            )}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-lg leading-relaxed animate-fadein-up2">{t.hero.subheadline}</p>
        </div>
      </div>
    </section>
  );
}

function ContactMain({ data, t }) {
  const [ref, visible] = useReveal();
  return (
    <section ref={ref} className="py-16 sm:py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-6 grid lg:grid-cols-2 gap-12 md:gap-14 lg:gap-16 items-start">
        {/* Info cards */}
        <div>
          <Label text={t.info.label} visible={visible} />
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-8 sm:mb-10 transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {t.info.title}
          </h2>
          <div className="flex flex-col gap-4 sm:gap-5">
            <InfoCard visible={visible} delay={150} icon={<EmailIcon />} label={t.info.emailLabel} value={data.contact.email} href={`mailto:${data.contact.email}`} />
            <InfoCard visible={visible} delay={220} icon={<WhatsAppIcon />} label={t.info.whatsappLabel} value={data.contact.whatsappDisplay} href={`https://wa.me/${data.contact.whatsappNumber}`} isExternal accent />
            <div className={`mt-1 p-5 sm:p-6 rounded-2xl bg-[#f7f7f7] border border-gray-100 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: "300ms" }}>
              <p className="text-gray-500 text-sm leading-relaxed">{t.info.note}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <ConsultationForm data={data} t={t} visible={visible} />
      </div>
    </section>
  );
}

function InfoCard({ icon, label, value, href, isExternal, accent, visible, delay }) {
  const base = "group flex items-center gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer no-underline";
  const cls = accent
    ? `${base} border-[#1D6FD8]/20 bg-[#1D6FD8]/4 hover:bg-[#1D6FD8] hover:border-[#1D6FD8]`
    : `${base} border-gray-100 bg-white hover:border-[#1D6FD8]/30 hover:shadow-lg`;
  return (
    <a href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined}
      className={`${cls} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} transition-all duration-500`}
      style={{ transitionDelay: `${delay}ms` }}>
      <span className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${accent ? "bg-[#1D6FD8]/10 group-hover:bg-white/20" : "bg-gray-100 group-hover:bg-[#1D6FD8]/10"}`}>
        {icon}
      </span>
      <div className="flex flex-col min-w-0">
        <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-0.5 transition-colors duration-200 ${accent ? "text-[#1D6FD8] group-hover:text-white/70" : "text-gray-400"}`}>{label}</span>
        <span className={`font-black text-sm sm:text-base truncate transition-colors duration-200 ${accent ? "text-[#1D6FD8] group-hover:text-white" : "text-[#0a0a0a] group-hover:text-[#1D6FD8]"}`}>{value}</span>
      </div>
      <span className="ms-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <ArrowRight size={15} color={accent ? "white" : "#1D6FD8"} />
      </span>
    </a>
  );
}

function ConsultationForm({ data, t, visible }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [status, setStatus] = useState("idle");

  function handleChange(e) { setForm((prev) => ({ ...prev, [e.target.name]: e.target.value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(data.contact.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch { setStatus("error"); }
  }

  return (
    <div className={`transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <Label text={t.form.label} visible={visible} />
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight mb-6 sm:mb-8">{t.form.title}</h2>

      {status === "sent" ? (
        <div className="p-8 sm:p-10 rounded-2xl bg-[#1D6FD8]/5 border border-[#1D6FD8]/20 flex flex-col items-center text-center gap-4">
          <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1D6FD8] flex items-center justify-center">
            <Check size={22} color="white" />
          </span>
          <h3 className="font-black text-lg sm:text-xl">{t.form.successTitle}</h3>
          <p className="text-gray-500 text-sm max-w-xs">{t.form.successMsg}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            <Field label={t.form.fields.name} name="name" type="text" value={form.name} onChange={handleChange} required />
            <Field label={t.form.fields.email} name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <Field label={t.form.fields.phone} name="phone" type="tel" value={form.phone} onChange={handleChange} />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">{t.form.fields.service}</label>
            <select name="service" value={form.service} onChange={handleChange}
              className="w-full bg-[#f7f7f7] border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-[#0a0a0a] focus:outline-none focus:border-[#1D6FD8] transition-colors">
              <option value="">{t.form.fields.servicePlaceholder}</option>
              {t.form.serviceOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">{t.form.fields.message}</label>
            <textarea name="message" value={form.message} onChange={handleChange} rows={4} placeholder={t.form.fields.messagePlaceholder}
              className="w-full bg-[#f7f7f7] border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-[#0a0a0a] placeholder-gray-400 focus:outline-none focus:border-[#1D6FD8] transition-colors resize-none" />
          </div>
          <button onClick={handleSubmit} disabled={status === "sending"}
            className="inline-flex items-center justify-center gap-2 bg-[#1D6FD8] text-white font-bold px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base hover:bg-[#a50d24] transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed mt-1">
            {status === "sending" ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{t.form.sending}</>
            ) : (
              <>{t.form.submit}<ArrowRight size={16} /></>
            )}
          </button>
          {status === "error" && <p className="text-[#1D6FD8] text-sm font-medium">{t.form.errorMsg}</p>}
        </div>
      )}
    </div>
  );
}

function Field({ label, name, type, value, onChange, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} required={required}
        className="w-full bg-[#f7f7f7] border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-[#0a0a0a] focus:outline-none focus:border-[#1D6FD8] transition-colors" />
    </div>
  );
}

function Label({ text, visible, dark = false }) {
  return (
    <div className={`flex items-center gap-2 mb-3 transition-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`}>
      <div className="w-4 sm:w-5 h-px bg-[#1D6FD8]" />
      <span className={`text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase ${dark ? "text-gray-400" : "text-[#1D6FD8]"}`}>{text}</span>
    </div>
  );
}

function ArrowRight({ size = 16, color = "currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>;
}
function Check({ size = 16, color = "currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>;
}
function EmailIcon() {
  return <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#1D6FD8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" /></svg>;
}
function WhatsAppIcon() {
  return <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#1D6FD8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>;
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&family=Tajawal:wght@300;400;700;800&display=swap');
  @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
  @keyframes fadein-up { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fadein      { animation: fadein    0.6s ease both; }
  .animate-fadein-up   { animation: fadein-up 0.7s ease 0.1s both; }
  .animate-fadein-up2  { animation: fadein-up 0.7s ease 0.25s both; }
`;