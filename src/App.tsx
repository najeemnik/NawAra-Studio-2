import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Globe2, 
  Zap, 
  Lock, 
  Menu, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Maximize2, 
  Phone, 
  Mail, 
  Compass, 
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { ArchitecturalProject, Language } from './types';
import { initialProjects } from './data/initialProjects';
import BigDkProjectDetail from './components/BigDkProjectDetail';
import NawAraCPM from './components/NawAraCPM';
import AdminPanel from './components/AdminPanel';
import ProjectGalleryView from './components/ProjectGalleryView';
import AboutStudio from './components/AboutStudio';
import ContactSection from './components/ContactSection';
import ThreeArchViewer from './components/ThreeArchViewer';

export default function App() {
  const [lang, setLang] = useState<Language>('fa');
  const [projects, setProjects] = useState<ArchitecturalProject[]>(initialProjects);
  const [currentView, setCurrentView] = useState<'home' | 'project_detail' | 'cpm' | 'admin'>('home');
  const [selectedProject, setSelectedProject] = useState<ArchitecturalProject | null>(null);
  const [cpmInitialProjectId, setCpmInitialProjectId] = useState<string | undefined>(undefined);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Set HTML dir and lang attributes dynamically
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
  }, [lang]);

  const isFa = lang === 'fa';
  const isPs = lang === 'ps';

  // Navigation handlers
  const handleOpenProject = (proj: ArchitecturalProject) => {
    setSelectedProject(proj);
    setCurrentView('project_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCpmWithProject = (cpmId: string) => {
    setCpmInitialProjectId(cpmId);
    setCurrentView('cpm');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveProject = (updatedProj: ArchitecturalProject) => {
    const exists = projects.some((p) => p.id === updatedProj.id);
    if (exists) {
      setProjects(projects.map((p) => (p.id === updatedProj.id ? updatedProj : p)));
    } else {
      setProjects([updatedProj, ...projects]);
    }
  };

  const handleDeleteProject = (projId: string) => {
    setProjects(projects.filter((p) => p.id !== projId));
  };

  // If in CPM portal mode, render the full CPM interface
  if (currentView === 'cpm') {
    return (
      <NawAraCPM
        lang={lang}
        initialProjectId={cpmInitialProjectId}
        onBackToStudio={() => {
          setCurrentView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  // If in Admin Panel mode, render the CMS
  if (currentView === 'admin') {
    return (
      <AdminPanel
        lang={lang}
        projects={projects}
        onSaveProject={handleSaveProject}
        onDeleteProject={handleDeleteProject}
        onBackToStudio={() => {
          setCurrentView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  // If viewing project detail, render BIG.dk detail view
  if (currentView === 'project_detail' && selectedProject) {
    return (
      <div>
        <BigDkProjectDetail
          project={selectedProject}
          lang={lang}
          allProjects={projects}
          onBack={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectProject={(proj) => {
            setSelectedProject(proj);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenCpmProject={handleOpenCpmWithProject}
        />
      </div>
    );
  }

  // Featured project for Hero 3D showcase
  const featuredProject = projects.find((p) => p.featured) || projects[0];

  return (
    <div id="nawara-studio-root" className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-amber-500 selection:text-neutral-950">
      {/* Top Navbar */}
      <header className="border-b border-neutral-800/80 bg-neutral-950/85 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div 
            onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-neutral-950 font-bold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-base sm:text-lg tracking-tight text-neutral-100 flex items-center gap-1.5">
                <span>NawAra Studio</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {isFa ? 'نو آرا' : '3D ARCH'}
                </span>
              </div>
              <div className="text-[10px] text-neutral-400 font-light truncate max-w-[200px] sm:max-w-none">
                {isFa ? 'شرکت ساختمانی و مهندسی نوآرا' : isPs ? 'د نوآرا ودانیز او انجنیري شرکت' : 'NawAra Engineering & Construction Co.'}
              </div>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
            <a
              href="#featured-3d-stage"
              className="px-3.5 py-2 rounded-xl text-neutral-300 hover:text-amber-400 hover:bg-neutral-900 transition-all"
            >
              {isFa ? 'استودیو سه‌بعدی' : isPs ? '۳D سټوډیو' : '3D Studio'}
            </a>
            <a
              href="#project-archive"
              className="px-3.5 py-2 rounded-xl text-neutral-300 hover:text-amber-400 hover:bg-neutral-900 transition-all"
            >
              {isFa ? 'آرشیو پروژه‌ها (BIG Specs)' : isPs ? 'د پروژو آرشیف' : 'Projects (BIG Specs)'}
            </a>
            <a
              href="#about-section"
              className="px-3.5 py-2 rounded-xl text-neutral-300 hover:text-amber-400 hover:bg-neutral-900 transition-all"
            >
              {isFa ? 'مهندسی و پایداری' : isPs ? 'انجنیري او وړتیاوې' : 'Engineering'}
            </a>
            <a
              href="#contact-section"
              className="px-3.5 py-2 rounded-xl text-neutral-300 hover:text-amber-400 hover:bg-neutral-900 transition-all"
            >
              {isFa ? 'سفارش و مشاوره' : isPs ? 'فرمایش او اړیکه' : 'Contact & RFP'}
            </a>
          </nav>

          {/* Right Action Center (CPM Portal, Admin, Language) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-1 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setLang('fa')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  lang === 'fa' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                فارسی
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  lang === 'en' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('ps')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  lang === 'ps' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                پښتو
              </button>
            </div>

            {/* Admin CMS Button */}
            <button
              id="btn-nav-admin"
              type="button"
              onClick={() => setCurrentView('admin')}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs hidden sm:flex items-center gap-1.5 transition-colors"
              title="پنل مدیریت و انتشار پروژه‌ها / Admin CMS"
            >
              <Lock className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden md:inline">{isFa ? 'ادمین پنل' : isPs ? 'ادمین' : 'Admin'}</span>
            </button>

            {/* NawAra CPM Portal Gateway Button */}
            <button
              id="btn-nav-cpm-portal"
              type="button"
              onClick={() => setCurrentView('cpm')}
              className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-bold px-3.5 sm:px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all hover:scale-102"
            >
              <Zap className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>NawAra CPM</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-800 bg-neutral-900/95 p-4 space-y-2 text-xs font-semibold animate-in slide-in-from-top-2 duration-150">
            <a
              href="#featured-3d-stage"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2.5 rounded-xl hover:bg-neutral-800 text-neutral-200"
            >
              {isFa ? 'استودیو سه‌بعدی' : isPs ? '۳D سټوډیو' : '3D Studio'}
            </a>
            <a
              href="#project-archive"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2.5 rounded-xl hover:bg-neutral-800 text-neutral-200"
            >
              {isFa ? 'آرشیو پروژه‌ها' : isPs ? 'پروژې' : 'Projects'}
            </a>
            <a
              href="#about-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2.5 rounded-xl hover:bg-neutral-800 text-neutral-200"
            >
              {isFa ? 'درباره و مهندسی نوآرا' : 'About & Engineering'}
            </a>
            <a
              href="#contact-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2.5 rounded-xl hover:bg-neutral-800 text-neutral-200"
            >
              {isFa ? 'سفارش و ارتباط' : 'Contact & RFP'}
            </a>
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); setCurrentView('admin'); }}
              className="w-full text-left p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-amber-300 flex items-center justify-between"
            >
              <span>{isFa ? 'پنل مدیریت و انتشار پروژه (Admin Panel)' : 'Admin Panel'}</span>
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </header>

      {/* Main Home Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-20">
        {/* HERO SECTION: Dynamic 3D Architecture Stage */}
        <section id="featured-3d-stage" className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isFa ? 'استودیو طراحی معماری و مهندسی سازه' : isPs ? 'د ودانیو او معمارۍ سټوډیو' : 'NawAra Architectural & Engineering Studio'}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-50 leading-tight">
                {isFa ? (
                  <>
                    معماری فردا در قلب افغانستان؛ <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                      پروژه‌های سه‌بعدی و ضدزلزله نوآرا
                    </span>
                  </>
                ) : isPs ? (
                  <>
                    په افغانستان کې د راتلونکي معمارۍ؛ <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                      د زلزلې ضد او ښکلې ۳D پروژې
                    </span>
                  </>
                ) : (
                  <>
                    Transforming Afghan Skylines; <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                      Seismic Engineering & 3D Form
                    </span>
                  </>
                )}
              </h1>

              <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed max-w-2xl">
                {isFa
                  ? 'ارائه پروژه‌های شاخص مهندسی با مشخصات کامل (الهام‌گرفته از استانداردهای بین‌المللی BIG)، رندرهای محافظت‌شده 8K و اتصال لحظه‌ای به پرتال مدیریت ساخت NawAra CPM.'
                  : isPs
                  ? 'د نویو ودانیزو پروژو ښودل په پوره تخنیکي مشخصاتو، 8K خوندي انځورونو او ژوندي ۳D ماډلونو سره.'
                  : 'Delivering landmark architectural typologies across Kabul, Herat, and Mazar with real-time 3D orbital exploration and protected 8K archives.'}
              </p>
            </div>

            {/* Quick Hero CTA buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#project-archive"
                className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-6 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-xl shadow-amber-500/20 transition-all hover:scale-102"
              >
                <span>{isFa ? 'کاوش در آرشیو پروژه‌ها' : isPs ? 'پروژې وګورئ' : 'Explore All Projects'}</span>
                {isFa || isPs ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </a>

              <button
                type="button"
                onClick={() => setCurrentView('cpm')}
                className="bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-semibold px-5 py-3 rounded-2xl text-xs flex items-center gap-2 border border-neutral-800 transition-colors"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{isFa ? 'ورود به NawAra CPM' : isPs ? 'CPM ته ننوتل' : 'NawAra CPM Portal'}</span>
              </button>
            </div>
          </div>

          {/* Interactive 3D Canvas Showcase */}
          <div className="relative rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl">
            <ThreeArchViewer
              config={featuredProject.model3d}
              projectName={featuredProject.title[lang] || featuredProject.title.en}
              lang={lang}
            />

            {/* Project Quick Peek Banner */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 max-w-sm pointer-events-none">
              <div className="bg-neutral-950/85 backdrop-blur-md border border-neutral-800 rounded-2xl p-4 space-y-2 pointer-events-auto shadow-xl">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                  {isFa ? 'پروژه برجسته در استودیو ۳D:' : isPs ? 'غوره ۳D پروژه:' : 'Featured 3D Highlight:'}
                </span>
                <h3 className="text-sm font-bold text-neutral-100">
                  {featuredProject.title[lang] || featuredProject.title.en}
                </h3>
                <p className="text-xs text-neutral-400 line-clamp-2">
                  {featuredProject.tagline[lang] || featuredProject.tagline.en}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-neutral-800 text-xs">
                  <span className="text-neutral-400 font-mono">{featuredProject.areaSqm}</span>
                  <button
                    type="button"
                    onClick={() => handleOpenProject(featuredProject)}
                    className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                  >
                    <span>{isFa ? 'مشاهده مشخصات کامل BIG' : 'View Full Specs'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Filterable Architecture Archive (BIG.dk standard) */}
        <section id="project-archive" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
                <Layers className="w-4 h-4" />
                <span>{isFa ? 'آرشیو آثار و پروژه‌های اجرا شده' : isPs ? 'د پروژو بشپړ آرشیف' : 'Architectural Portfolio'}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-100">
                {isFa ? 'پروژه‌های شاخص مهندسی و ساختمانی نوآرا' : isPs ? 'د نوآرا مهمې او پېژندل شوې پروژې' : 'Featured Architectural & Engineering Works'}
              </h2>
            </div>
            <p className="text-xs text-neutral-400 max-w-sm">
              {isFa
                ? 'مشاهده تمام مشخصات فنی، متراژ، کاربری، سازه، دیاگرام‌های اقلیمی و گالری 8K'
                : 'Complete BIG.dk styled specification matrix, climate diagrams, and 8K zoom.'}
            </p>
          </div>

          {/* Project Gallery View */}
          <ProjectGalleryView
            projects={projects}
            lang={lang}
            onSelectProject={handleOpenProject}
            onOpenCpm={() => setCurrentView('cpm')}
          />
        </section>

        {/* SECTION 3: Engineering Capabilities & Studio Philosophy */}
        <section id="about-section">
          <AboutStudio
            lang={lang}
            onOpenProjects={() => {
              const el = document.getElementById('project-archive');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenCpm={() => setCurrentView('cpm')}
          />
        </section>

        {/* SECTION 4: Contact & RFP Proposal Builder */}
        <section id="contact-section">
          <ContactSection lang={lang} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 bg-neutral-900/60 backdrop-blur-md pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-base text-neutral-100">NawAra Studio</span>
              </div>
              <p className="text-neutral-400 font-light leading-relaxed max-w-md">
                {isFa
                  ? 'شرکت ساختمانی و مهندسی نوآرا — پیشگام در طراحی برج‌های مدرن، محاسبات پیشرفته سازه ضدزلزله و سامانه‌های دیجیتال مدیریت ساخت (NawAra CPM) در افغانستان و منطقه.'
                  : 'NawAra Engineering & Construction Studio — Pioneering earthquake-resilient architecture, sustainable masterplans, and digital construction intelligence.'}
              </p>
            </div>

            <div className="space-y-2.5">
              <span className="font-bold text-neutral-200 uppercase tracking-wider font-mono">
                {isFa ? 'دسترسی سریع' : isPs ? 'چټک لاسرسی' : 'Navigation'}
              </span>
              <ul className="space-y-1.5 text-neutral-400">
                <li><a href="#featured-3d-stage" className="hover:text-amber-400 transition-colors">{isFa ? 'استودیو ۳D' : '3D Studio'}</a></li>
                <li><a href="#project-archive" className="hover:text-amber-400 transition-colors">{isFa ? 'آرشیو پروژه‌ها' : 'Projects'}</a></li>
                <li><a href="#about-section" className="hover:text-amber-400 transition-colors">{isFa ? 'استانداردهای مهندسی' : 'Engineering'}</a></li>
                <li>
                  <button type="button" onClick={() => setCurrentView('cpm')} className="text-amber-400 hover:underline">
                    NawAra CPM Portal
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <span className="font-bold text-neutral-200 uppercase tracking-wider font-mono">
                {isFa ? 'امنیت و کپی‌رایت' : isPs ? 'کاپي رایټ' : 'Security & IP'}
              </span>
              <div className="text-neutral-400 space-y-1.5 leading-relaxed">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>8K Protected Archive</span>
                </div>
                <p className="text-[11px]">
                  {isFa
                    ? 'کلیه حقوق مالکیت معنوی، نقشه‌ها و عکس‌های رندر ۸K متعلق به شرکت ساختمانی نوآرا می‌باشد.'
                    : 'All architectural designs and 8K visual assets are copyright protected.'}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
            <div>
              © {new Date().getFullYear()} NawAra Studio (شرکت ساختمانی و مهندسی نوآرا). All Rights Reserved.
            </div>
            <div className="flex items-center gap-4 font-mono">
              <span>Kabul, Afghanistan</span>
              <span>•</span>
              <span>Dubai, UAE</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
