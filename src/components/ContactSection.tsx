import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  Calendar 
} from 'lucide-react';
import { Language } from '../types';

interface ContactSectionProps {
  lang: Language;
}

export default function ContactSection({ lang }: ContactSectionProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [projectCity, setProjectCity] = useState('کابل (Kabul)');
  const [typology, setTypology] = useState('commercial');
  const [plotArea, setPlotArea] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isFa = lang === 'fa';
  const isPs = lang === 'ps';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div id="contact-nawara" className="space-y-12 py-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{isFa ? 'دفاتر و ارتباط با ما' : isPs ? 'له موږ سره اړیکه' : 'Get in Touch with NawAra'}</span>
        </div>
        <h2 className="text-3xl font-extrabold text-neutral-100">
          {isFa ? 'سفارش پروژه جدید و مشاوره مهندسی سازه' : isPs ? 'د نوې پروژې فرمایش او انجنیري مشوره' : 'Commission a Project & Engineering Consultation'}
        </h2>
        <p className="text-xs text-neutral-400">
          {isFa ? 'تیم معماری و مهندسی نوآرا آماده تحلیل سایت، برآورد اولیه هزینه و طراحی کانسپت است.' : 'Our architectural design and structural teams are ready to analyze your site and requirements.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Contact Info Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Kabul HQ */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-100">{isFa ? 'دفتر مرکزی کابل' : isPs ? 'د کابل مرکزي دفتر' : 'Kabul Studio Headquarters'}</h3>
                <p className="text-xs text-neutral-400">Afghanistan</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-neutral-300 pt-2 border-t border-neutral-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-neutral-500 shrink-0" />
                <span>{isFa ? 'چهارراهی انصاری، شهر نو، کابل، افغانستان' : 'Ansari Square, Shahr-e-Naw, Kabul'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-neutral-500 shrink-0" />
                <span className="font-mono text-amber-400">+93 799 123 456 / +93 788 888 999</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neutral-500 shrink-0" />
                <span className="font-mono">studio@nawara.af / projects@nawara.af</span>
              </div>
            </div>
          </div>

          {/* UAE Branch */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-100">{isFa ? 'دفتر هماهنگی بین‌المللی دبی' : isPs ? 'د دوبۍ دفتر' : 'Dubai International Office'}</h3>
                <p className="text-xs text-neutral-400">United Arab Emirates</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-neutral-300 pt-2 border-t border-neutral-800 font-mono">
              <div className="flex items-center gap-2 font-sans">
                <MapPin className="w-4 h-4 text-neutral-500 shrink-0" />
                <span>Business Bay, Iris Bay Tower, Dubai, UAE</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-neutral-500 shrink-0" />
                <span className="text-cyan-400">+971 4 888 7766</span>
              </div>
            </div>
          </div>
        </div>

        {/* RFP / Inquiry Form */}
        <div className="lg:col-span-3 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {isSubmitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-neutral-100">
                {isFa ? 'درخواست شما با موفقیت ثبت شد!' : isPs ? 'ستاسو غوښتنه وسپارل شوه!' : 'Inquiry Submitted Successfully!'}
              </h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                {isFa
                  ? 'کارشناسان ارشد معماری و مهندسی نوآرا ظرف حداکثر ۲۴ ساعت جهت بررسی فنی نقشه و شرایط سایت با شما تماس خواهند گرفت.'
                  : 'Our chief architect and structural consultants will review your brief and contact you within 24 hours.'}
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="mt-4 px-6 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors"
              >
                {isFa ? 'ثبت درخواست دیگر' : 'Submit Another Inquiry'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-neutral-100 mb-2">
                {isFa ? 'فرم ارسال مشخصات زمین و سفارش پروژه' : isPs ? 'د پروژې فرمایش فورم' : 'Project Commission & RFP Form'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">{isFa ? 'نام و نام خانوادگی' : isPs ? 'نوم' : 'Your Name'}</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ahmad Khan"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">{isFa ? 'شماره تماس واتساپ یا موبایل' : isPs ? 'د اړیکې شمېره' : 'Phone / WhatsApp'}</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+93 799 000 000"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">{isFa ? 'شهر پروژه' : isPs ? 'ښار' : 'City'}</label>
                  <select
                    value={projectCity}
                    onChange={(e) => setProjectCity(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-neutral-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Kabul">کابل (Kabul)</option>
                    <option value="Herat">هرات (Herat)</option>
                    <option value="Mazar-i-Sharif">مزارشریف (Mazar)</option>
                    <option value="Kandahar">قندهار (Kandahar)</option>
                    <option value="Jalalabad">جلال‌آباد (Jalalabad)</option>
                    <option value="Dubai">دبی (Dubai)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">{isFa ? 'کاربری مورد نظر' : isPs ? 'ډول' : 'Typology'}</label>
                  <select
                    value={typology}
                    onChange={(e) => setTypology(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-neutral-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="commercial">تجاری و اداری (Commercial)</option>
                    <option value="residential">مسکونی و ویلایی (Residential)</option>
                    <option value="civic_cultural">فرهنگی و عمومی (Cultural)</option>
                    <option value="healthcare">درمانی (Healthcare)</option>
                    <option value="hospitality">هتل و اکوتوریسم (Hospitality)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">{isFa ? 'متراژ زمین / زیربنا (m²)' : isPs ? 'مساحت' : 'Area (m²)'}</label>
                  <input
                    type="text"
                    value={plotArea}
                    onChange={(e) => setPlotArea(e.target.value)}
                    placeholder="e.g. 5,000 m²"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-300">{isFa ? 'توضیحات و نیازمندی‌های ویژه پروژه' : isPs ? 'د پروژې ځانګړي معلومات' : 'Project Requirements & Vision'}</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isFa ? 'مثال: طراحی برج تجاری با پارکینگ طبقاتی و محاسبات مقاومت زلزله...' : 'Describe your vision, special requirements, or target timeline...'}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-neutral-100 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all mt-2"
              >
                <Send className="w-4 h-4" />
                <span>{isFa ? 'ارسال درخواست مشاوره و طراحی معماری' : isPs ? 'د ډیزاین غوښتنه ولېږئ' : 'Submit Architectural Proposal Request'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
