import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Maximize2, 
  Layers, 
  Building2, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Compass, 
  CheckCircle2, 
  Clock, 
  Wind, 
  Sun, 
  Share2, 
  ExternalLink,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { ArchitecturalProject, Language, ProjectImage } from '../types';
import ThreeArchViewer from './ThreeArchViewer';
import ProtectedImageViewer from './ProtectedImageViewer';

interface BigDkProjectDetailProps {
  project: ArchitecturalProject;
  lang: Language;
  onBack: () => void;
  onSelectProject: (proj: ArchitecturalProject) => void;
  allProjects: ArchitecturalProject[];
  onOpenCpmProject?: (cpmId: string) => void;
}

export default function BigDkProjectDetail({
  project,
  lang,
  onBack,
  onSelectProject,
  allProjects,
  onOpenCpmProject,
}: BigDkProjectDetailProps) {
  const [selected8kImage, setSelected8kImage] = useState<ProjectImage | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | '3d' | 'gallery' | 'cpm'>('overview');

  const isFa = lang === 'fa';
  const isPs = lang === 'ps';

  // Find previous and next project for seamless browsing
  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : allProjects[allProjects.length - 1];
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : allProjects[0];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          text: isFa ? 'تکمیل شده' : isPs ? 'بشپړ شوی' : 'Completed',
        };
      case 'under_construction':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          text: isFa ? 'در حال ساخت' : isPs ? 'تر کار لاندې' : 'Under Construction',
        };
      case 'in_design':
        return {
          bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
          text: isFa ? 'در مرحله طراحی' : isPs ? 'د ډیزاین په پړاو کې' : 'In Design',
        };
      default:
        return {
          bg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
          text: isFa ? 'طرح کانسپت' : isPs ? 'مفهومي طرحه' : 'Concept',
        };
    }
  };

  const statusInfo = getStatusBadge(project.status);

  return (
    <div id="bigdk-project-page" className="min-h-screen bg-neutral-950 text-neutral-100 pb-20">
      {/* Top Breadcrumb & Navigation */}
      <div className="border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            id="btn-back-to-projects"
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-amber-400 transition-colors"
          >
            {isFa || isPs ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isFa ? 'بازگشت به آرشیو پروژه‌ها' : isPs ? 'بېرته ټولو پروژو ته' : 'Back to Project Archive'}</span>
          </button>

          {/* Quick Sub-Navigation Tabs */}
          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-lg p-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeTab === 'overview' ? 'bg-neutral-800 text-amber-300 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {isFa ? 'مشخصات و داستان' : isPs ? 'مشخصات او کیسه' : 'Story & Specs'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('3d')}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
                activeTab === '3d' ? 'bg-neutral-800 text-amber-300 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{isFa ? 'کاوشگر ۳D' : isPs ? '۳D ماډل' : '3D Explorer'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gallery')}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
                activeTab === 'gallery' ? 'bg-neutral-800 text-amber-300 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{isFa ? 'گالری 8K' : isPs ? '8K ګالري' : '8K Gallery'}</span>
            </button>
            {project.cpmProjectId && (
              <button
                type="button"
                onClick={() => onOpenCpmProject?.(project.cpmProjectId!)}
                className="px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 font-semibold flex items-center gap-1 transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>NawAra CPM</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-10">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`text-xs px-3 py-1 rounded-full border font-medium ${statusInfo.bg}`}>
              {statusInfo.text}
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono">
              {project.areaSqm}
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300">
              {project.city}, {project.country}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-50 leading-tight">
            {project.title[lang] || project.title.en}
          </h1>

          <p className="text-base sm:text-xl text-neutral-400 max-w-4xl font-light leading-relaxed">
            {project.tagline[lang] || project.tagline.en}
          </p>
        </div>

        {/* Hero Visual Display */}
        <div className="mt-8 relative rounded-3xl overflow-hidden border border-neutral-800/80 shadow-2xl group">
          <img
            src={project.heroImage}
            alt={project.title[lang]}
            className="w-full h-[400px] sm:h-[600px] object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />

          {/* Floating Action Badge on Hero */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4">
            <div className="bg-neutral-950/80 backdrop-blur-md border border-neutral-800 px-4 py-2 rounded-xl text-xs">
              <div className="text-neutral-400">{isFa ? 'عکاسی معماری فوق‌دقیق' : isPs ? 'لوړ کیفیت انځور' : 'Architectural Photography'}</div>
              <div className="text-neutral-200 font-bold flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>8K Master UHD Protected</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelected8kImage(project.gallery[0] || { id: 'hero', url: project.heroImage, caption: project.title, resolution: '8K UHD' })}
                className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
              >
                <Maximize2 className="w-4 h-4" />
                <span>{isFa ? 'مشاهده با کیفیت 8K و زوم' : isPs ? 'په 8K کیفیت کتل او زوم' : 'Inspect in 8K Ultra-HD'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* BIG.dk Signature Specs Grid */}
        <section id="specs-matrix" className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-neutral-800">
            <Layers className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-neutral-100">
              {isFa ? 'جدول مشخصات فنی و مهندسی پروژه (BIG Specifications)' : isPs ? 'د پروژې تخنیکي او انجنیري جدول' : 'Project Specifications & Engineering Sheet'}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-xs">
            <div className="space-y-1">
              <div className="text-neutral-500 font-mono uppercase tracking-wider">{isFa ? 'کاربری / تایپولوژی' : isPs ? 'د پروژې ډول' : 'Typology'}</div>
              <div className="text-neutral-200 font-bold text-sm capitalize">{project.typology.replace('_', ' ')}</div>
            </div>

            <div className="space-y-1">
              <div className="text-neutral-500 font-mono uppercase tracking-wider">{isFa ? 'وضعیت اجرا' : isPs ? 'حالت' : 'Status'}</div>
              <div className="text-amber-400 font-bold text-sm">{statusInfo.text} ({project.progressPercent}%)</div>
            </div>

            <div className="space-y-1">
              <div className="text-neutral-500 font-mono uppercase tracking-wider">{isFa ? 'مساحت زیربنا' : isPs ? 'مساحت' : 'Floor Area'}</div>
              <div className="text-neutral-200 font-bold text-sm font-mono">{project.areaSqm}</div>
            </div>

            <div className="space-y-1">
              <div className="text-neutral-500 font-mono uppercase tracking-wider">{isFa ? 'سال ساخت / تکمیل' : isPs ? 'کال' : 'Year'}</div>
              <div className="text-neutral-200 font-bold text-sm font-mono">{project.year}</div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <div className="text-neutral-500 font-mono uppercase tracking-wider">{isFa ? 'موقعیت دقیق' : isPs ? 'دقیق ځای' : 'Location'}</div>
              <div className="text-neutral-200 font-medium text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{project.location[lang] || project.location.en}</span>
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <div className="text-neutral-500 font-mono uppercase tracking-wider">{isFa ? 'کارفرما / مالک' : isPs ? 'فرمایش ورکوونکی' : 'Client'}</div>
              <div className="text-neutral-200 font-medium text-sm">{project.clientName[lang] || project.clientName.en}</div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <div className="text-neutral-500 font-mono uppercase tracking-wider">{isFa ? 'سازه و مقاومت لرزه‌ای' : isPs ? 'د زلزلې ضد جوړښت' : 'Structural & Seismic Design'}</div>
              <div className="text-neutral-300 text-xs leading-relaxed">{project.structuralEngineer[lang] || project.structuralEngineer.en}</div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <div className="text-neutral-500 font-mono uppercase tracking-wider">{isFa ? 'استاندارد انرژی و پایداری' : isPs ? 'د چاپېریال معیار' : 'Sustainability Rating'}</div>
              <div className="text-emerald-400 font-semibold text-xs">{project.sustainabilityRating}</div>
            </div>
          </div>
        </section>

        {/* 3D Interactive Model Section */}
        <section id="interactive-3d-section" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
                <Sparkles className="w-4 h-4" />
                <span>{isFa ? 'استودیو سه‌بعدی نوآرا' : isPs ? 'د نوآرا ۳D سټوډیو' : 'NawAra 3D Studio'}</span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-100">
                {isFa ? 'کاوشگر سه‌بعدی و دیاگرام‌های سازه‌ای زنده' : isPs ? 'ژوندی ۳D ماډل او د جوړښت دیاګرامونه' : 'Interactive 3D Architectural Model'}
              </h2>
            </div>
          </div>

          {/* Three.js 3D Viewer component */}
          <ThreeArchViewer 
            config={project.model3d} 
            projectName={project.title[lang] || project.title.en} 
            lang={lang} 
          />
        </section>

        {/* Narrative & Architectural Concept Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-neutral-100">
                {isFa ? 'ایده و کانسپت معماری' : isPs ? 'د ډیزاین مفکوره' : 'The Architectural Concept'}
              </h3>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
                {project.story[lang] || project.story.en}
              </p>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {project.conceptDescription[lang] || project.conceptDescription.en}
              </p>
            </div>

            {/* Key Engineering Features Checklist */}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {isFa ? 'ویژگی‌های کلیدی سازه و نوآوری‌های اجرایی:' : isPs ? 'د ساختمان مهمې ځانګړنې:' : 'Key Engineering & Structural Highlights:'}
              </h4>
              <div className="space-y-2.5">
                {(project.features[lang] || project.features.en || []).map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Climate & Aerodynamic Diagrams Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>{isFa ? 'دیاگرام‌های اقلیمی و فرم' : isPs ? 'د اقلیم دیاګرامونه' : 'Climate & Form Diagrams'}</span>
            </h3>

            <div className="space-y-3">
              {project.diagrams.map((diag) => (
                <div
                  key={diag.id}
                  className="bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 rounded-xl p-4 transition-all"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      {diag.iconType === 'wind' ? (
                        <Wind className="w-4 h-4" />
                      ) : diag.iconType === 'sun' ? (
                        <Sun className="w-4 h-4" />
                      ) : (
                        <Layers className="w-4 h-4" />
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-neutral-200">
                      {diag.title[lang] || diag.title.en}
                    </h4>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {diag.description[lang] || diag.description.en}
                  </p>
                </div>
              ))}
            </div>

            {/* Live CPM Progress Banner */}
            {project.cpmProjectId && (
              <div className="bg-gradient-to-br from-amber-500/10 via-neutral-900 to-neutral-950 border border-amber-500/30 rounded-xl p-5 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">NawAra CPM Live Tracker</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{project.progressPercent}%</span>
                </div>

                <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${project.progressPercent}%` }}
                  />
                </div>

                <p className="text-[11px] text-neutral-400">
                  {isFa ? 'این پروژه به پرتال مدیریت عملیات ساختمانی متصل است.' : isPs ? 'دا پروژه د نوآرا مدیریت پورټل سره وصل ده.' : 'Synced with live construction management portal.'}
                </p>

                <button
                  type="button"
                  onClick={() => onOpenCpmProject?.(project.cpmProjectId!)}
                  className="w-full bg-neutral-800 hover:bg-neutral-750 text-neutral-200 font-semibold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors border border-neutral-700"
                >
                  <span>{isFa ? 'مشاهده مراحل ساخت در NawAra CPM' : isPs ? 'په CPM کې د پړاوونو کتل' : 'View Stages in NawAra CPM'}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 8K Protected Photo Gallery Section */}
        <section id="gallery-section" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>{isFa ? 'گالری تصاویر با کیفیت فوق‌العاده 8K' : isPs ? 'د لوړ کیفیت 8K انځورونو ګالري' : '8K Master Resolution Visual Archive'}</span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-100">
                {isFa ? 'گالری معماری و جزئیات اجرایی پروژه' : isPs ? 'د پروژې د انځورونو ګالري' : 'Architectural & Engineering Gallery'}
              </h2>
            </div>
            <span className="text-xs text-neutral-500 font-mono">
              {project.gallery.length} {isFa ? 'تصویر 8K' : isPs ? 'انځورونه' : 'Photos'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.gallery.map((img) => (
              <div
                key={img.id}
                onClick={() => setSelected8kImage(img)}
                className="group relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 cursor-pointer shadow-lg hover:border-amber-500/50 transition-all"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.caption[lang] || project.title.en}
                    draggable={false}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <div className="bg-amber-500 text-neutral-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-xl">
                      <Maximize2 className="w-4 h-4" />
                      <span>{isFa ? 'باز کردن با کیفیت 8K و محافظت شده' : isPs ? 'په 8K کیفیت کتل' : 'Inspect 8K Master'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-neutral-900 flex items-center justify-between text-xs">
                  <span className="text-neutral-300 truncate max-w-[80%]">
                    {img.caption[lang] || img.caption.en}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-amber-300 font-bold">
                    {img.resolution}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Previous / Next Project Footer Navigation */}
        <section className="pt-10 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onSelectProject(prevProject)}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 flex items-center gap-3 transition-all text-xs text-left"
          >
            {isFa || isPs ? <ChevronRight className="w-4 h-4 text-amber-400" /> : <ChevronLeft className="w-4 h-4 text-amber-400" />}
            <div>
              <div className="text-[10px] text-neutral-500 uppercase">{isFa ? 'پروژه قبلی' : isPs ? 'مخکنۍ پروژه' : 'Previous Project'}</div>
              <div className="font-bold text-neutral-100">{prevProject.title[lang] || prevProject.title.en}</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onSelectProject(nextProject)}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 flex items-center justify-between sm:justify-start gap-3 transition-all text-xs text-right"
          >
            <div>
              <div className="text-[10px] text-neutral-500 uppercase">{isFa ? 'پروژه بعدی' : isPs ? 'راتلونکې پروژه' : 'Next Project'}</div>
              <div className="font-bold text-neutral-100">{nextProject.title[lang] || nextProject.title.en}</div>
            </div>
            {isFa || isPs ? <ChevronLeft className="w-4 h-4 text-amber-400" /> : <ChevronRight className="w-4 h-4 text-amber-400" />}
          </button>
        </section>
      </div>

      {/* 8K Protected Lightbox Modal */}
      {selected8kImage && (
        <div className="fixed inset-0 bg-neutral-950/95 backdrop-blur-xl z-50 p-4 sm:p-8 flex items-center justify-center">
          <div className="w-full max-w-6xl">
            <ProtectedImageViewer
              image={selected8kImage}
              projectName={project.title[lang] || project.title.en}
              lang={lang}
              onClose={() => setSelected8kImage(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
