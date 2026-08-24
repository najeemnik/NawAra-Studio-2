import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Building2, 
  Layers, 
  Sparkles, 
  Check, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck,
  Image as ImageIcon,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';
import { ArchitecturalProject, Language, ProjectTypology, ProjectStatus } from '../types';

interface AdminPanelProps {
  lang: Language;
  projects: ArchitecturalProject[];
  onSaveProject: (project: ArchitecturalProject) => void;
  onDeleteProject: (projectId: string) => void;
  onBackToStudio: () => void;
}

export default function AdminPanel({
  lang,
  projects,
  onSaveProject,
  onDeleteProject,
  onBackToStudio,
}: AdminPanelProps) {
  const [editingProject, setEditingProject] = useState<ArchitecturalProject | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const isFa = lang === 'fa';
  const isPs = lang === 'ps';

  const defaultNewProject: ArchitecturalProject = {
    id: `proj-${Date.now()}`,
    slug: `new-project-${Date.now()}`,
    title: {
      fa: 'پروژه جدید نوآرا',
      en: 'New NawAra Architectural Project',
      ps: 'د نوآرا نوې پروژه',
    },
    tagline: {
      fa: 'توصیف کوتاه و جذاب از کانسپت و عملکرد ساختمان',
      en: 'Short conceptual tagline of the architectural innovation',
      ps: 'د ودانۍ لنډه او ښکلې پېژندنه',
    },
    location: {
      fa: 'کابل، افغانستان',
      en: 'Kabul, Afghanistan',
      ps: 'کابل، افغانستان',
    },
    city: 'Kabul',
    country: 'Afghanistan',
    year: '2026',
    areaSqm: '12,000 m²',
    typology: 'commercial',
    status: 'under_construction',
    progressPercent: 35,
    clientName: {
      fa: 'سرمایه‌گذار خصوصی',
      en: 'Private Development Group',
      ps: 'خصوصي پانګوال',
    },
    collaborators: {
      fa: 'مهندسان مشاور نوآرا',
      en: 'NawAra Engineering Studio',
      ps: 'د نوآرا انجنیري شرکت',
    },
    structuralEngineer: {
      fa: 'سازه بتن آرمه ضدزلزله با سیستم قاب خمشی ویژه',
      en: 'Special Reinforced Concrete Moment Frame (Seismic Zone 4)',
      ps: 'د زلزلې ضد کانکریټي قوي جوړښت',
    },
    sustainabilityRating: 'LEED Gold Standard Target',
    estimatedBudgetUsd: '$8,500,000',
    story: {
      fa: 'داستان معماری، پاسخ به اقلیم بومی و ویژگی‌های خاص مهندسی و بصری پروژه را در این بخش بنویسید.',
      en: 'Comprehensive architectural narrative, climate adaptation, and spatial journey.',
      ps: 'دلته د پروژې مفکوره، اقلیمي ځانګړنې او بشپړ معلومات ولیکئ.',
    },
    conceptDescription: {
      fa: 'هندسه مدرن با تلفیق عناصر بومی سنتی افغانستان.',
      en: 'Contemporary form tailored to Afghan environmental context.',
      ps: 'د افغانستان له دودیزې معمارۍ سره همغږی ډیزاین.',
    },
    features: {
      fa: [
        'طراحی مقاوم در برابر زلزله شدید با آخرین استانداردهای مهندسی',
        'عایق‌بندی صوتی و حرارتی پیشرفته',
        'فضاهای سبز و نورگیری طبیعی بهینه',
      ],
      en: [
        'Advanced seismic resilience engineering',
        'High-performance thermal & acoustic envelope',
        'Maximized natural daylighting & biophilic integration',
      ],
      ps: [
        'د زلزلې پر وړاندې لوړ مقاومت',
        'د غږ او تودوخې غوره عایق',
        'طبیعي رڼا او شنه چاپېریال',
      ],
    },
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=85',
    gallery: [
      {
        id: 'img-1',
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=90',
        caption: {
          fa: 'نمای پرسپکتیو کلی پروژه',
          en: 'Exterior main perspective',
          ps: 'د ودانۍ بهرنی عمومي انځور',
        },
        resolution: '8K UHD',
        isHero: true,
      },
    ],
    diagrams: [
      {
        id: 'diag-1',
        title: {
          fa: 'انرژی خورشیدی و نور طبیعی',
          en: 'Solar & Daylight Geometry',
          ps: 'د لمر رڼا او انرژي',
        },
        description: {
          fa: 'طراحی جهت‌گیری ساختمان بر اساس زاویه تابش آفتاب در طول فصول سال.',
          en: 'Optimized orientation for solar heat gain reduction in summer and capture in winter.',
          ps: 'د لمر د زاویو سره سم د ودانۍ جوړښت.',
        },
        iconType: 'sun',
      },
    ],
    model3d: {
      type: 'tower',
      floors: 18,
      heightMeters: 75,
      colorTheme: '#38bdf8',
      wireframeColor: '#0284c7',
      rotationSpeed: 0.003,
      hasRoofGarden: true,
      hasCurvedFacade: true,
    },
    cpmProjectId: 'cpm-proj-001',
    featured: true,
  };

  const handleStartCreate = () => {
    setEditingProject({ ...defaultNewProject, id: `proj-${Date.now()}` });
    setIsCreatingNew(true);
  };

  const handleStartEdit = (proj: ArchitecturalProject) => {
    setEditingProject({ ...proj });
    setIsCreatingNew(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    onSaveProject(editingProject);
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      setEditingProject(null);
      setIsCreatingNew(false);
    }, 1200);
  };

  return (
    <div id="nawara-admin-panel" className="min-h-screen bg-neutral-950 text-neutral-100 pb-20">
      {/* Admin Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToStudio}
              className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-amber-400 transition-colors"
            >
              {isFa || isPs ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{isFa ? 'بازگشت به سایت نوآرا' : isPs ? 'بېرته وېبپاڼې ته' : 'Back to Studio'}</span>
            </button>
            <span className="text-neutral-600">|</span>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-sm text-neutral-100">
                {isFa ? 'پنل مدیریت و انتشار پروژه‌ها (BIG.dk CMS)' : isPs ? 'د پروژو د خپرولو او مدیریت پینل' : 'Architectural Project CMS'}
              </span>
            </div>
          </div>

          <button
            id="btn-admin-add-project"
            type="button"
            onClick={handleStartCreate}
            className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{isFa ? 'پست پروژه جدید با مشخصات کامل' : isPs ? 'نوې پروژه خپره کړئ' : 'Post New Project'}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Editor Modal or Inline Editor */}
        {editingProject ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-amber-400" />
                  <span>{isCreatingNew ? (isFa ? 'پست پروژه جدید' : 'Create New Project') : (isFa ? 'ویرایش مشخصات پروژه' : 'Edit Project')}</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {isFa ? 'مشخصات کامل پروژه مشابه استانداردهای big.dk را وارد کنید.' : 'Fill all architectural parameters matching BIG.dk standards.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold hover:bg-neutral-700 transition-colors"
                >
                  {isFa ? 'انصراف' : 'Cancel'}
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{savedFeedback ? (isFa ? 'ذخیره شد!' : 'Saved!') : (isFa ? 'ذخیره و انتشار پروژه' : 'Save & Publish')}</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6 text-xs">
              {/* Basic Details in FA & EN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-300">عنوان پروژه (فارسی / دری):</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title.fa}
                    onChange={(e) => setEditingProject({ ...editingProject, title: { ...editingProject.title, fa: e.target.value } })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-300">Project Title (English):</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title.en}
                    onChange={(e) => setEditingProject({ ...editingProject, title: { ...editingProject.title, en: e.target.value } })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Taglines */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-300">توصیف کوتاه و جذاب (فارسی):</label>
                  <textarea
                    rows={2}
                    value={editingProject.tagline.fa}
                    onChange={(e) => setEditingProject({ ...editingProject, tagline: { ...editingProject.tagline, fa: e.target.value } })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-neutral-100 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-300">Tagline (English):</label>
                  <textarea
                    rows={2}
                    value={editingProject.tagline.en}
                    onChange={(e) => setEditingProject({ ...editingProject, tagline: { ...editingProject.tagline, en: e.target.value } })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-neutral-100 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>
              </div>

              {/* Technical Matrix (Typology, Status, Area, Budget, Location) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-neutral-950/60 rounded-2xl border border-neutral-800/80">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">کاربری / Typology:</label>
                  <select
                    value={editingProject.typology}
                    onChange={(e) => setEditingProject({ ...editingProject, typology: e.target.value as ProjectTypology })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="commercial">Commercial / تجاری</option>
                    <option value="residential">Residential / مسکونی</option>
                    <option value="civic_cultural">Civic & Cultural / فرهنگی</option>
                    <option value="healthcare">Healthcare / درمانی</option>
                    <option value="educational">Educational / آموزشی</option>
                    <option value="hospitality">Hospitality / هتل و بوم‌گردی</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">وضعیت / Status:</label>
                  <select
                    value={editingProject.status}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as ProjectStatus })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="under_construction">Under Construction / در حال ساخت</option>
                    <option value="completed">Completed / تکمیل شده</option>
                    <option value="in_design">In Design / در حال طراحی</option>
                    <option value="concept">Concept / کانسپت</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">مساحت (m²):</label>
                  <input
                    type="text"
                    value={editingProject.areaSqm}
                    onChange={(e) => setEditingProject({ ...editingProject, areaSqm: e.target.value })}
                    placeholder="e.g. 48,500 m²"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">سال / Year:</label>
                  <input
                    type="text"
                    value={editingProject.year}
                    onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                    placeholder="2025 - 2026"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-neutral-300">موقعیت و آدرس:</label>
                  <input
                    type="text"
                    value={editingProject.location.fa}
                    onChange={(e) => setEditingProject({ ...editingProject, location: { ...editingProject.location, fa: e.target.value } })}
                    placeholder="کابل، شهر نو"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-neutral-300">کارفرما / مالک:</label>
                  <input
                    type="text"
                    value={editingProject.clientName.fa}
                    onChange={(e) => setEditingProject({ ...editingProject, clientName: { ...editingProject.clientName, fa: e.target.value } })}
                    placeholder="نام کارفرما یا نهاد سرمایه‌گذار"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Structural System & Sustainability */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-300">مهندسی سازه و مقاومت زلزله (Structural System):</label>
                  <input
                    type="text"
                    value={editingProject.structuralEngineer.fa}
                    onChange={(e) => setEditingProject({ ...editingProject, structuralEngineer: { ...editingProject.structuralEngineer, fa: e.target.value } })}
                    placeholder="هسته بتنی با دیاگرام فولادی ضدزلزله"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-300">استاندارد انرژی و پایداری (Sustainability):</label>
                  <input
                    type="text"
                    value={editingProject.sustainabilityRating}
                    onChange={(e) => setEditingProject({ ...editingProject, sustainabilityRating: e.target.value })}
                    placeholder="LEED Platinum Target / Net-Zero"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* 8K Photo URL & 3D Model Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-neutral-950/60 rounded-2xl border border-neutral-800">
                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-300 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>آدرس تصویر اصلی 8K (Hero Image URL):</span>
                  </label>
                  <input
                    type="url"
                    value={editingProject.heroImage}
                    onChange={(e) => setEditingProject({ ...editingProject, heroImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-neutral-100 focus:outline-none focus:border-amber-500 font-mono text-[11px]"
                  />
                  {editingProject.heroImage && (
                    <img src={editingProject.heroImage} alt="Preview" className="w-full h-28 object-cover rounded-xl mt-2 border border-neutral-800" />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="font-semibold text-neutral-300 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-cyan-400" />
                    <span>تنظیمات مدل سه‌بعدی (3D Model Archetype):</span>
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-neutral-500">نوع فرم 3D:</span>
                      <select
                        value={editingProject.model3d.type}
                        onChange={(e) => setEditingProject({
                          ...editingProject,
                          model3d: { ...editingProject.model3d, type: e.target.value as any }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-1.5 text-xs text-neutral-100"
                      >
                        <option value="tower">Skyscraper Tower (برج)</option>
                        <option value="cultural_pavilion">Cultural Shell Pavilion (پاویون)</option>
                        <option value="modular_complex">Modular Tech Hub (مدولار)</option>
                        <option value="parametric_villa">Parametric Eco Resort (ویلا)</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-500">تعداد طبقات:</span>
                      <input
                        type="number"
                        value={editingProject.model3d.floors}
                        onChange={(e) => setEditingProject({
                          ...editingProject,
                          model3d: { ...editingProject.model3d, floors: Number(e.target.value) }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-1.5 text-xs text-neutral-100 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Story Narrative */}
              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-300">داستان و تشریح کامل کانسپت معماری (فارسی):</label>
                <textarea
                  rows={4}
                  value={editingProject.story.fa}
                  onChange={(e) => setEditingProject({ ...editingProject, story: { ...editingProject.story, fa: e.target.value } })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-neutral-100 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-5 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold shadow-lg shadow-amber-500/20"
                >
                  ذخیره و انتشار در وبسایت
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Projects List in Admin */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-neutral-100">
                  {isFa ? 'لیست پروژه‌های منتشر شده در وبسایت' : isPs ? 'په وېبپاڼه کې خپرې شوې پروژې' : 'Published Architecture Projects'}
                </h2>
                <p className="text-xs text-neutral-400">
                  {projects.length} {isFa ? 'پروژه فعال با پیش‌نمایش سه‌بعدی و کیفیت 8K' : isPs ? 'پروژې' : 'Active Projects'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-amber-500/40 transition-all"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={proj.heroImage}
                      alt={proj.title[lang]}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-neutral-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-amber-300 border border-neutral-800">
                      {proj.status.toUpperCase()}
                    </div>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-500 uppercase">{proj.typology} • {proj.year}</span>
                      <h3 className="text-base font-bold text-neutral-100 mt-1 line-clamp-1">
                        {proj.title[lang] || proj.title.en}
                      </h3>
                      <p className="text-xs text-neutral-400 line-clamp-2 mt-1 font-light">
                        {proj.tagline[lang] || proj.tagline.en}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                      <div className="text-[11px] text-neutral-400">
                        {proj.city} • <span className="font-mono text-emerald-400 font-bold">{proj.progressPercent}%</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(proj)}
                          className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(isFa ? 'آیا از حذف این پروژه اطمینان دارید؟' : 'Delete this project?')) {
                              onDeleteProject(proj.id);
                            }
                          }}
                          className="p-2 rounded-lg bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 text-xs transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
