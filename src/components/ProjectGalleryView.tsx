import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Filter, 
  MapPin, 
  ArrowUpRight, 
  Sparkles, 
  Layers, 
  Eye, 
  Search, 
  SlidersHorizontal,
  Compass,
  CheckCircle2,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { ArchitecturalProject, Language, ProjectTypology } from '../types';

interface ProjectGalleryViewProps {
  projects: ArchitecturalProject[];
  lang: Language;
  onSelectProject: (project: ArchitecturalProject) => void;
  onOpenCpm: () => void;
}

export default function ProjectGalleryView({
  projects,
  lang,
  onSelectProject,
  onOpenCpm,
}: ProjectGalleryViewProps) {
  const [selectedTypology, setSelectedTypology] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  const isFa = lang === 'fa';
  const isPs = lang === 'ps';

  // Typologies list
  const typologies = [
    { id: 'all', label: isFa ? 'همه پروژه‌ها' : isPs ? 'ټولې پروژې' : 'All Projects' },
    { id: 'commercial', label: isFa ? 'تجاری و اداری' : isPs ? 'سوداګریز' : 'Commercial' },
    { id: 'residential', label: isFa ? 'مسکونی و برج' : isPs ? 'استوګنیز' : 'Residential' },
    { id: 'civic_cultural', label: isFa ? 'فرهنگی و عمومی' : isPs ? 'کلتوري' : 'Cultural & Civic' },
    { id: 'healthcare', label: isFa ? 'درمانی و شفاخانه' : isPs ? 'روغتیايي' : 'Healthcare' },
    { id: 'hospitality', label: isFa ? 'هتل و اکوتوریسم' : isPs ? 'هوټلونه' : 'Hospitality' },
  ];

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesTypology = selectedTypology === 'all' || p.typology === selectedTypology;
      const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
      const title = (p.title[lang] || p.title.en).toLowerCase();
      const location = (p.location[lang] || p.location.en).toLowerCase();
      const city = p.city.toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch = !query || title.includes(query) || location.includes(query) || city.includes(query);

      return matchesTypology && matchesStatus && matchesSearch;
    });
  }, [projects, selectedTypology, selectedStatus, searchQuery, lang]);

  return (
    <div id="nawara-project-gallery" className="space-y-10">
      {/* Search and Filters Bar */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-4 sm:p-6 shadow-xl backdrop-blur-md space-y-4">
        {/* Search & Meta Counts */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-project-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isFa ? 'جستجو در پروژه‌ها (کابل، هرات، مزارشریف، برج...)' : isPs ? 'پروژو کې لټون...' : 'Search projects by name, city, or feature...'}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-neutral-400">
            <span>
              <strong className="text-amber-400 font-mono text-sm">{filteredProjects.length}</strong> {isFa ? 'پروژه یافت شد' : isPs ? 'پروژې' : 'Projects Found'}
            </span>
          </div>
        </div>

        {/* Typology Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {typologies.map((t) => (
            <button
              key={t.id}
              id={`filter-typology-${t.id}`}
              type="button"
              onClick={() => setSelectedTypology(t.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTypology === t.id
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            id={`project-card-${project.id}`}
            onClick={() => onSelectProject(project)}
            onMouseEnter={() => setHoveredProjectId(project.id)}
            onMouseLeave={() => setHoveredProjectId(null)}
            className="group bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
          >
            {/* Visual Hero Area */}
            <div className="relative aspect-[16/11] overflow-hidden bg-neutral-950">
              <img
                src={project.heroImage}
                alt={project.title[lang]}
                draggable={false}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-80" />

              {/* Status & 8K Badge */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md border border-neutral-800 text-neutral-200 text-[11px] font-mono">
                  {project.city}
                </span>

                <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-mono px-2.5 py-1 rounded-full backdrop-blur-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>8K & 3D</span>
                </div>
              </div>

              {/* Hover Quick Action */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400">
                  {project.areaSqm}
                </span>

                <div className="w-8 h-8 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
            </div>

            {/* Architectural Content & Spec Snippet */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500 uppercase">
                  <span>{project.typology.replace('_', ' ')}</span>
                  <span>•</span>
                  <span>{project.year}</span>
                </div>

                <h3 className="text-lg font-bold text-neutral-100 group-hover:text-amber-300 transition-colors leading-snug">
                  {project.title[lang] || project.title.en}
                </h3>

                <p className="text-xs text-neutral-400 font-light line-clamp-2 leading-relaxed">
                  {project.tagline[lang] || project.tagline.en}
                </p>
              </div>

              {/* Progress & Specifications Micro-Bar */}
              <div className="pt-4 border-t border-neutral-800/80 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{project.location[lang] || project.location.en}</span>
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">{project.progressPercent}%</span>
                </div>

                <div className="w-full bg-neutral-950 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${project.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
