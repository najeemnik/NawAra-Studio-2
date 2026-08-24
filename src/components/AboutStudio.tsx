import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Layers, 
  Award, 
  Compass, 
  CheckCircle2, 
  Users, 
  Globe2, 
  Cpu,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Language } from '../types';

interface AboutStudioProps {
  lang: Language;
  onOpenProjects: () => void;
  onOpenCpm: () => void;
}

export default function AboutStudio({ lang, onOpenProjects, onOpenCpm }: AboutStudioProps) {
  const isFa = lang === 'fa';
  const isPs = lang === 'ps';

  return (
    <div id="about-nawara-studio" className="space-y-16 py-8">
      {/* Studio Philosophy Hero */}
      <div className="relative bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-12 overflow-hidden shadow-2xl">
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isFa ? 'شرکت ساختمانی و مهندسی نوآرا' : isPs ? 'د نوآرا ودانیز او انجنیري شرکت' : 'NawAra Engineering & Construction'}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-50 tracking-tight leading-tight">
            {isFa 
              ? 'تلفیق هویت غنی معماری افغانستان با پیشرفته‌ترین مهندسی سازه و فناوری ۳D جهان'
              : isPs
              ? 'د افغانستان د بډایه معمارۍ او د نړۍ د تر ټولو پرمختللې انجنیرۍ او ۳D ټیکنالوژۍ یووالی'
              : 'Synthesizing Afghan Architectural Heritage with World-Class Seismic Engineering & 3D Tech'}
          </h2>

          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
            {isFa
              ? 'استودیو نوآرا پیشگام در طراحی برج‌های شهری مقاوم در برابر شدیدترین زلزله‌ها، مراکز فرهنگی پایدار و پروژه‌های تحول‌آفرین زیربنایی در افغانستان است. ما با رویکردی جسورانه (الهام‌گرفته از BIG.dk) و سیستم مدیریت ساخت یکپارچه NawAra CPM، فاصله بین رویا و ساخت واقعی را از میان برداشته‌ایم.'
              : isPs
              ? 'نوآرا سټوډیو په افغانستان کې د لوړو او د زلزلې ضد ودانیو، کلتوري مرکزونو او عصري ښارګوټو په ډیزاین او پلي کولو کې مخکښ دی.'
              : 'NawAra Studio pioneers high-performance earthquake-resilient towers, sustainable cultural centers, and transformative masterplans across Afghanistan, backed by proprietary CPM construction management.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={onOpenProjects}
              className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-6 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-xl shadow-amber-500/20 transition-all"
            >
              <span>{isFa ? 'مشاهده آرشیو شاهکارهای معماری' : isPs ? 'د معمارۍ پروژې' : 'Explore Architectural Works'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenCpm}
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold px-6 py-3 rounded-2xl text-xs flex items-center gap-2 border border-neutral-700 transition-all"
            >
              <span>{isFa ? 'ورود به سامانه مدیریت ساخت NawAra CPM' : isPs ? 'د مدیریت پورټل (CPM)' : 'Launch NawAra CPM Portal'}</span>
            </button>
          </div>
        </div>

        {/* Ambient watermark graphic */}
        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none translate-x-12 translate-y-12">
          <Building2 className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Core Engineering Disciplines */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h3 className="text-2xl font-bold text-neutral-100">
            {isFa ? 'خدمات جامع و استانداردهای بین‌المللی نوآرا' : isPs ? 'د نوآرا نړیوال خدمات او معیارونه' : 'Comprehensive Architectural & Engineering Standards'}
          </h3>
          <p className="text-xs text-neutral-400">
            {isFa ? 'از تحلیل ژئوتکنیک و مدل‌سازی اطلاعات ساختمان (BIM) تا اجرای بدون نقص' : 'From geotechnical seismic analysis to turnkey execution and BIM lifecycle'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl hover:border-amber-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-neutral-100">
              {isFa ? 'مهندسی سازه ضدزلزله (Seismic Zone 4)' : isPs ? 'د زلزلې ضد پیاوړی ډیزاین' : 'Seismic Resilience Engineering'}
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              {isFa
                ? 'طراحی سازه‌های بتنی و فولادی مقاوم در برابر زلزله‌های شدید هندو کش با استفاده از سیستم‌های میراگر ویسکوز، دیوارهای برشی هسته‌ای و قاب‌های خمشی ویژه.'
                : 'Advanced structural engineering adapted to the Hindu Kush tectonic activity, using viscous dampers and reinforced core walls.'}
            </p>
          </div>

          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl hover:border-amber-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-neutral-100">
              {isFa ? 'مدل‌سازی سه‌بعدی BIM و شبیه‌سازی اقلیمی' : isPs ? 'BIM او ۳D ډیزاین' : 'BIM Level 3 & Climate Modeling'}
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              {isFa
                ? 'شبیه‌سازی دینامیک سیالات محاسباتی (CFD) برای بهره‌گیری از بادهای فصلی افغانستان و بهینه‌سازی مصرف انرژی تا ۴۰ درصد.'
                : 'Computational fluid dynamic wind simulation and thermal modeling to reduce building energy consumption by up to 40%.'}
            </p>
          </div>

          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl hover:border-amber-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-neutral-100">
              {isFa ? 'مدیریت و نظارت ساخت با NawAra CPM' : isPs ? 'د پروژو ریښتینی مدیریت' : 'Turnkey Construction & CPM'}
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              {isFa
                ? 'شفافیت کامل برای کارفرما از طریق پرتال آنلاین، کنترل کیفی آزمایشگاهی بتن و مصالح، و تحویل پروژه دقیقاً بر اساس برنامه زمان‌بندی.'
                : 'Complete transparency for clients with live progress tracking, QA/QC concrete testing, and strict on-time delivery.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
