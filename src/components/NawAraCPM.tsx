import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Plus, 
  ShieldCheck, 
  Lock, 
  LogOut, 
  ChevronRight, 
  ChevronDown, 
  Layers, 
  HardHat, 
  Package, 
  UserCheck, 
  Key, 
  Camera, 
  ArrowUpRight, 
  Send,
  Calendar,
  Thermometer,
  CloudSun,
  Eye,
  Check
} from 'lucide-react';
import { 
  CPMProject, 
  CPMUser, 
  ConstructionPhase, 
  DailySiteReport, 
  FinancialTransaction, 
  MaterialItem, 
  Language, 
  UserRole 
} from '../types';
import { initialCpmUsers, initialCpmProjects, initialDailyReports, initialFinancials, initialMaterials } from '../data/initialCpmData';

interface NawAraCPMProps {
  lang: Language;
  initialProjectId?: string;
  onBackToStudio: () => void;
}

export default function NawAraCPM({ lang, initialProjectId, onBackToStudio }: NawAraCPMProps) {
  // Authentication state
  const [currentUser, setCurrentUser] = useState<CPMUser | null>(initialCpmUsers[0]); // Default to Super Admin for immediate demo, but can switch
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Data states (in-memory persistent state)
  const [users, setUsers] = useState<CPMUser[]>(initialCpmUsers);
  const [projects, setProjects] = useState<CPMProject[]>(initialCpmProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId || initialCpmProjects[0].id);
  const [dailyReports, setDailyReports] = useState<DailySiteReport[]>(initialDailyReports);
  const [financials, setFinancials] = useState<FinancialTransaction[]>(initialFinancials);
  const [materials, setMaterials] = useState<MaterialItem[]>(initialMaterials);

  // Active view tab inside CPM
  const [cpmTab, setCpmTab] = useState<'stages' | 'daily_logs' | 'users_permissions' | 'financials' | 'materials' | 'client_portal'>('stages');

  // Modal / form states
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('site_engineer');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserCompany, setNewUserCompany] = useState('');
  const [newUserAssignedProj, setNewUserAssignedProj] = useState(initialCpmProjects[0].id);

  const [showAddDailyLogModal, setShowAddDailyLogModal] = useState(false);
  const [newLogTasks, setNewLogTasks] = useState('');
  const [newLogWorkers, setNewLogWorkers] = useState(120);
  const [newLogWeather, setNewLogWeather] = useState('آفتابی و صاف (Sunny)');

  const [showAdvancePhaseModal, setShowAdvancePhaseModal] = useState(false);
  const [selectedPhaseToEdit, setSelectedPhaseToEdit] = useState<ConstructionPhase | null>(null);
  const [phaseProgressInput, setPhaseProgressInput] = useState(0);

  const isFa = lang === 'fa';
  const isPs = lang === 'ps';

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Role permissions check
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isProjectManager = currentUser?.role === 'project_manager' || isSuperAdmin;
  const isClient = currentUser?.role === 'client';

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const matchedUser = users.find(
      (u) => (u.username.toLowerCase() === loginUsername.toLowerCase() || u.email.toLowerCase() === loginUsername.toLowerCase())
    );

    if (matchedUser) {
      setCurrentUser(matchedUser);
      setIsLoggedOut(false);
      if (matchedUser.role === 'client') {
        setCpmTab('client_portal');
        if (matchedUser.assignedProjectIds.length > 0) {
          setSelectedProjectId(matchedUser.assignedProjectIds[0]);
        }
      } else {
        setCpmTab('stages');
      }
    } else {
      setLoginError(isFa ? 'نام کاربری یا کلمه عبور اشتباه است.' : isPs ? 'کارن نوم یا پټنوم ناسم دی.' : 'Invalid credentials. Try quick role logins below.');
    }
  };

  const handleQuickRoleLogin = (user: CPMUser) => {
    setCurrentUser(user);
    setIsLoggedOut(false);
    if (user.role === 'client') {
      setCpmTab('client_portal');
      if (user.assignedProjectIds.length > 0) {
        setSelectedProjectId(user.assignedProjectIds[0]);
      }
    } else {
      setCpmTab('stages');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedOut(true);
  };

  // Add new User / Staff member
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    const newUser: CPMUser = {
      id: `user-${Date.now()}`,
      username: newUserName.toLowerCase().replace(/\s+/g, '.'),
      fullName: newUserName,
      email: newUserEmail || `${newUserName.toLowerCase().replace(/\s+/g, '.')}@nawara.af`,
      phone: '+93 799 000 111',
      role: newUserRole,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      companyOrClientName: newUserCompany || (newUserRole === 'client' ? 'مشتری محترم' : 'NawAra Engineering'),
      assignedProjectIds: [newUserAssignedProj],
      permissions: newUserRole === 'client' 
        ? ['view_assigned_project', 'view_milestones', 'view_daily_photos'] 
        : ['post_daily_reports', 'update_phase_progress'],
      isActive: true,
      lastLogin: 'تازه ثبت شده',
    };

    setUsers([...users, newUser]);
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserCompany('');
  };

  // Update Construction Phase Progress
  const handleUpdatePhaseProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPhaseToEdit) return;

    const updatedProjects = projects.map((proj) => {
      if (proj.id === selectedProjectId) {
        const updatedPhases = proj.phases.map((ph) => {
          if (ph.id === selectedPhaseToEdit.id) {
            const isDone = phaseProgressInput >= 100;
            return {
              ...ph,
              progressPercent: phaseProgressInput,
              status: isDone ? ('completed' as const) : ('in_progress' as const),
            };
          }
          return ph;
        });

        // calculate new overall progress
        const totalProgress = Math.round(
          updatedPhases.reduce((acc, curr) => acc + curr.progressPercent, 0) / updatedPhases.length
        );

        return {
          ...proj,
          phases: updatedPhases,
          overallProgressPercent: totalProgress,
          lastUpdateDate: '2026-08-24',
        };
      }
      return proj;
    });

    setProjects(updatedProjects);
    setShowAdvancePhaseModal(false);
    setSelectedPhaseToEdit(null);
  };

  // Add Daily Site Log
  const handleAddDailyLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: DailySiteReport = {
      id: `rep-${Date.now()}`,
      projectId: selectedProjectId,
      date: new Date().toISOString().split('T')[0],
      authorName: currentUser?.fullName || 'مهندس ناظر نوآرا',
      authorRole: currentUser?.role || 'Site Engineer',
      weather: newLogWeather,
      temperatureC: 30,
      activeWorkersCount: Number(newLogWorkers),
      tasksCompleted: newLogTasks.split('\n').filter((t) => t.trim().length > 0),
      tasksPlannedForTomorrow: ['ادامه عملیات بتن‌ریزی و بازرسی اتصالات'],
      materialArrivals: ['تحویل بتن آماده و نمونه‌گیری آزمایشگاهی'],
      safetyIncidents: 'فاقد حادثه - رعایت کامل استاندارد HSE',
      photoUrls: ['https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80'],
      isClientVisible: true,
    };

    setDailyReports([newReport, ...dailyReports]);
    setShowAddDailyLogModal(false);
    setNewLogTasks('');
  };

  // If logged out or no user selected, show the Login Screen
  if (!currentUser || isLoggedOut) {
    return (
      <div id="cpm-login-screen" className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-neutral-950 font-bold mx-auto shadow-lg shadow-amber-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-100">NawAra CPM</h1>
            <p className="text-xs text-neutral-400">
              {isFa ? 'پرتال مدیریت پروژه‌های عمرانی و سامانه مشتریان نوآرا' : isPs ? 'د نوآرا د ودانیزو پروژو او پیرودونکو پورټل' : 'Construction Project Management & Client Portal'}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">
                {isFa ? 'نام کاربری یا ایمیل' : isPs ? 'کارن نوم یا بریښنالیک' : 'Username or Email'}
              </label>
              <input
                id="cpm-username-input"
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="admin or client.capital"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">
                {isFa ? 'کلمه عبور' : isPs ? 'پټنوم' : 'Password'}
              </label>
              <input
                id="cpm-password-input"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              id="btn-cpm-login"
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-2.5 rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all"
            >
              {isFa ? 'ورود به سامانه NawAra CPM' : isPs ? 'نوآرا پورټل ته ننوتل' : 'Sign In to CPM Portal'}
            </button>
          </form>

          {/* Quick Demo Role Switcher */}
          <div className="pt-4 border-t border-neutral-800 space-y-2.5">
            <div className="text-[11px] text-neutral-400 text-center font-medium">
              {isFa ? 'یا ورود سریع با نقش‌های کاربری زیر:' : isPs ? 'یا د لاندې نقشونو له لارې آزموینه:' : 'Or Quick Login with Demo Roles:'}
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {users.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickRoleLogin(u)}
                  className="flex items-center justify-between p-2 rounded-xl bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 text-left transition-colors text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                      {u.role === 'super_admin' ? 'A' : u.role === 'client' ? 'C' : 'E'}
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-200 text-xs">{u.fullName}</div>
                      <div className="text-[10px] text-neutral-500">{u.companyOrClientName} ({u.role})</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                </button>
              ))}
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onBackToStudio}
              className="text-xs text-neutral-500 hover:text-amber-400 transition-colors"
            >
              ← {isFa ? 'بازگشت به وبسایت اصلی نوآرا استدیو' : isPs ? 'اصلي وېبپاڼې ته بېرته' : 'Back to NawAra Studio Website'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="nawara-cpm-portal" className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* Top CPM Navigation Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToStudio}
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-neutral-950 font-bold shadow-md shadow-amber-500/20 hover:scale-105 transition-all"
              title="Return to NawAra Studio"
            >
              <Building2 className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-neutral-100 tracking-tight">NawAra CPM</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {currentUser.role.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="text-[11px] text-neutral-400 hidden sm:block truncate max-w-xs">
                {currentProject.name[lang] || currentProject.name.en}
              </div>
            </div>
          </div>

          {/* Project Selector Dropdown */}
          <div className="flex items-center gap-3">
            {!isClient && (
              <div className="hidden md:flex items-center gap-1.5 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs">
                <span className="text-neutral-500">{isFa ? 'پروژه جاری:' : isPs ? 'پروژه:' : 'Project:'}</span>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="bg-transparent text-neutral-200 font-semibold focus:outline-none cursor-pointer"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id} className="bg-neutral-900 text-neutral-100">
                      {p.name[lang] || p.name.en}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Current User Pill & Logout */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.fullName}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="font-semibold text-neutral-200 hidden sm:inline max-w-[120px] truncate">
                  {currentUser.fullName}
                </span>
              </div>

              <button
                id="btn-cpm-logout"
                type="button"
                onClick={handleLogout}
                className="p-2 rounded-xl bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 text-neutral-400 hover:text-red-400 transition-colors"
                title="خروج از سامانه / Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none text-xs border-t border-neutral-800/60 pt-2 sm:pt-0 sm:border-0">
          <button
            type="button"
            onClick={() => setCpmTab('stages')}
            className={`px-4 py-2 border-b-2 font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              cpmTab === 'stages'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isFa ? 'مراحل ساخت و فازها (Stages)' : isPs ? 'د کار پړاوونه' : 'Construction Phases'}</span>
          </button>

          <button
            type="button"
            onClick={() => setCpmTab('daily_logs')}
            className={`px-4 py-2 border-b-2 font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              cpmTab === 'daily_logs'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <HardHat className="w-4 h-4" />
            <span>{isFa ? 'گزارش‌های روزانه کارگاه' : isPs ? 'ورځني راپورونه' : 'Daily Site Logs'}</span>
          </button>

          <button
            type="button"
            onClick={() => setCpmTab('client_portal')}
            className={`px-4 py-2 border-b-2 font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              cpmTab === 'client_portal'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{isFa ? 'پرتال اختصاصی کارفرما / مشتری' : isPs ? 'د پیرودونکي پورټل' : 'Client Progress Portal'}</span>
          </button>

          {!isClient && (
            <>
              <button
                type="button"
                onClick={() => setCpmTab('users_permissions')}
                className={`px-4 py-2 border-b-2 font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  cpmTab === 'users_permissions'
                    ? 'border-amber-400 text-amber-300 font-bold'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>{isFa ? 'مدیریت کارمندان و دسترسی‌ها' : isPs ? 'د کارکوونکو واکونه' : 'Staff & Permissions'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCpmTab('financials')}
                className={`px-4 py-2 border-b-2 font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  cpmTab === 'financials'
                    ? 'border-amber-400 text-amber-300 font-bold'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>{isFa ? 'امور مالی و صورت‌وضعیت‌ها' : isPs ? 'مالي حسابونه' : 'Financial Ledger'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCpmTab('materials')}
                className={`px-4 py-2 border-b-2 font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  cpmTab === 'materials'
                    ? 'border-amber-400 text-amber-300 font-bold'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>{isFa ? 'انبار و متریال ساختمانی' : isPs ? 'د توکو زېرمه' : 'Materials & Stock'}</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main CPM Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Project KPI Overview Banner */}
        <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-amber-400">{currentProject.code}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium">
                  {currentProject.status.toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 mt-1">
                {currentProject.name[lang] || currentProject.name.en}
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                {currentProject.location} • {isFa ? 'مدیر پروژه:' : isPs ? 'د پروژې مدیر:' : 'PM:'} {currentProject.managerName}
              </p>
            </div>

            {/* Overall Progress Dial */}
            <div className="flex items-center gap-4 bg-neutral-950 border border-neutral-800/80 p-4 rounded-xl">
              <div>
                <div className="text-[11px] text-neutral-400 uppercase font-mono">{isFa ? 'پیشرفت فیزیکی کل' : isPs ? 'ټول پرمختګ' : 'Overall Progress'}</div>
                <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                  {currentProject.overallProgressPercent}%
                </div>
              </div>
              <div className="w-14 h-14 rounded-full border-4 border-neutral-800 border-t-emerald-400 flex items-center justify-center font-bold text-xs">
                {currentProject.overallProgressPercent}%
              </div>
            </div>
          </div>

          {/* Current Stage Indicator */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-amber-300">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-semibold">{isFa ? 'مرحله اجرایی در دست اقدام:' : isPs ? 'اوسنی روان پړاو:' : 'Active Construction Stage:'}</span>
              <span className="text-neutral-200">{currentProject.currentPhaseName[lang] || currentProject.currentPhaseName.en}</span>
            </div>
            <span className="text-neutral-400 font-mono text-[11px] hidden sm:inline">
              {isFa ? 'موعد تحویل:' : isPs ? 'د تسلیمۍ نېټه:' : 'Handover:'} {currentProject.estimatedHandoverDate}
            </span>
          </div>
        </section>

        {/* TAB 1: Construction Phases / Stages Tracker */}
        {cpmTab === 'stages' && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-400" />
                  <span>{isFa ? 'مدیریت و پایش گام‌به‌گام مراحل ساخت (Stages Timeline)' : isPs ? 'د ساختمان د پړاوونو څارنه' : 'Construction Phases & Milestones'}</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  {isFa ? 'رهگیری زنده پیشرفت از گودبرداری تا تحویل کلید' : isPs ? 'له کیندلو تر کیلیو تسلیمولو پورې ټول پړاوونه' : 'Real-time stage tracking from foundation to key handover'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {currentProject.phases.map((phase, idx) => (
                <div
                  key={phase.id}
                  className={`bg-neutral-900 border rounded-2xl p-5 transition-all space-y-3 ${
                    phase.status === 'completed'
                      ? 'border-emerald-500/30 bg-emerald-950/10'
                      : phase.status === 'in_progress'
                      ? 'border-amber-500/40 shadow-lg shadow-amber-500/5'
                      : 'border-neutral-800 opacity-80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        phase.status === 'completed'
                          ? 'bg-emerald-500 text-neutral-950'
                          : phase.status === 'in_progress'
                          ? 'bg-amber-500 text-neutral-950 animate-pulse'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {phase.status === 'completed' ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-neutral-100">
                          {phase.name[lang] || phase.name.en}
                        </h4>
                        <div className="text-xs text-neutral-400 flex items-center gap-3 mt-0.5 font-mono">
                          <span>{isFa ? 'تاریخ شروع:' : isPs ? 'پیل:' : 'Start:'} {phase.startDate}</span>
                          <span>•</span>
                          <span>{isFa ? 'هدف تکمیل:' : isPs ? 'پای:' : 'Target:'} {phase.targetEndDate}</span>
                          <span>•</span>
                          <span className="text-amber-400">{isFa ? 'ناظر:' : isPs ? 'څارونکی:' : 'Supervisor:'} {phase.supervisorName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                        phase.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : phase.status === 'in_progress'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {phase.progressPercent}%
                      </span>

                      {isProjectManager && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPhaseToEdit(phase);
                            setPhaseProgressInput(phase.progressPercent);
                            setShowAdvancePhaseModal(true);
                          }}
                          className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors border border-neutral-700"
                        >
                          {isFa ? 'ویرایش درصد' : isPs ? 'سلنه بدله کړئ' : 'Update %'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-neutral-950 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        phase.status === 'completed' ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                      style={{ width: `${phase.progressPercent}%` }}
                    />
                  </div>

                  {phase.notes && (
                    <div className="text-xs text-neutral-400 bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-850">
                      <span className="text-neutral-500">{isFa ? 'یادداشت فنی کارگاه:' : isPs ? 'تخنیکي یادښت:' : 'Site Notes:'}</span> {phase.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 2: Daily Site Logs & QA/QC Inspector Reports */}
        {cpmTab === 'daily_logs' && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                  <HardHat className="w-5 h-5 text-amber-400" />
                  <span>{isFa ? 'گزارش‌های روزانه مهندسی و کنترل کیفی (QA/QC Logs)' : isPs ? 'د کارځای ورځني راپورونه' : 'Daily Site & QA/QC Reports'}</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  {isFa ? 'تست‌های مقاومت بتن، نفرات حاضر، ورود مصالح و ایمنی HSE' : isPs ? 'د کانکریټ کیفیت معاینه او د کارکوونکو حاضرې' : 'Concrete strength tests, worker count, and HSE inspections'}
                </p>
              </div>

              {!isClient && (
                <button
                  type="button"
                  onClick={() => setShowAddDailyLogModal(true)}
                  className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isFa ? 'ثبت گزارش روزانه جدید' : isPs ? 'نوی ورځنی راپور' : 'New Daily Report'}</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {dailyReports.map((report) => (
                <div key={report.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-100">{report.date}</h4>
                        <div className="text-xs text-neutral-400">
                          {isFa ? 'تهیه کننده:' : isPs ? 'جوړوونکی:' : 'Report by:'} <span className="text-neutral-200 font-medium">{report.authorName}</span> ({report.authorRole})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 flex items-center gap-1">
                        <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                        <span>{report.weather}</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{report.activeWorkersCount} {isFa ? 'پرسنل فعال' : isPs ? 'کارکوونکي' : 'Workers'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2">
                      <span className="font-bold text-amber-400 block">{isFa ? 'فعالیت‌های اجرا شده امروز:' : isPs ? 'ترسره شوي کارونه:' : 'Tasks Completed:'}</span>
                      <ul className="space-y-1 text-neutral-300">
                        {report.tasksCompleted.map((t, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <span className="font-bold text-cyan-400 block">{isFa ? 'ورود مصالح و متریال به کارگاه:' : isPs ? 'راغلي ودانیز توکي:' : 'Material Deliveries:'}</span>
                      <ul className="space-y-1 text-neutral-300">
                        {report.materialArrivals.map((m, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Package className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {report.safetyIncidents && (
                    <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span><strong className="text-neutral-300">{isFa ? 'وضعیت ایمنی HSE:' : isPs ? 'د خوندیتوب حالت:' : 'HSE Status:'}</strong> {report.safetyIncidents}</span>
                    </div>
                  )}

                  {report.photoUrls.length > 0 && (
                    <div className="flex items-center gap-3 pt-2">
                      {report.photoUrls.map((url, pIdx) => (
                        <img
                          key={pIdx}
                          src={url}
                          alt="Site inspection photo"
                          className="w-20 h-16 object-cover rounded-xl border border-neutral-800"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 3: Client Exclusive Portal */}
        {cpmTab === 'client_portal' && (
          <section className="space-y-6">
            <div className="bg-gradient-to-r from-amber-500/10 via-neutral-900 to-neutral-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">{isFa ? 'پرتال اختصاصی کارفرما' : isPs ? 'د کارفرما ځانګړی پورټل' : 'Exclusive Client Portal'}</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-neutral-100 mt-1">
                    {currentProject.name[lang] || currentProject.name.en}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    {isFa ? 'کارفرمای محترم: ' : isPs ? 'محترم پیرودونکی: ' : 'Dear Client: '}
                    <strong className="text-neutral-200">{currentProject.clientName}</strong>
                  </p>
                </div>

                <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl text-xs space-y-1">
                  <div className="text-neutral-500 font-mono">{isFa ? 'وضعیت قرارداد و پرداخت‌ها' : isPs ? 'د قرارداد مالي حالت' : 'Financial Standing'}</div>
                  <div className="text-neutral-200 font-bold">
                    ${(currentProject.paidAmountUsd / 1000000).toFixed(2)}M / ${(currentProject.totalBudgetUsd / 1000000).toFixed(2)}M USD
                  </div>
                  <div className="text-emerald-400 font-mono text-[11px]">
                    {Math.round((currentProject.paidAmountUsd / currentProject.totalBudgetUsd) * 100)}% {isFa ? 'تسویه شده' : isPs ? 'ورکول شوی' : 'Settled'}
                  </div>
                </div>
              </div>
            </div>

            {/* Client Phase Roadmap */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
              <h4 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>{isFa ? 'پروژه شما تا کجا رسیده؟ (پیشرفت فیزیکی مراحل)' : isPs ? 'ستاسو پروژه کوم ځای ته رسېدلې؟' : 'Where is Your Project Now?'}</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentProject.phases.map((ph, idx) => (
                  <div
                    key={ph.id}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      ph.status === 'completed'
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-neutral-200'
                        : ph.status === 'in_progress'
                        ? 'bg-amber-950/20 border-amber-500/40 text-neutral-100'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-500'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-neutral-800 text-neutral-300 flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span>{ph.name[lang] || ph.name.en}</span>
                      </span>
                      <span className="font-mono">{ph.progressPercent}%</span>
                    </div>

                    <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          ph.status === 'completed' ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                        style={{ width: `${ph.progressPercent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Supervising Team Direct Action */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-neutral-100">{isFa ? 'درخواست بازدید حضوری از کارگاه یا جلسه فنی' : isPs ? 'د کارځای لیدنې یا ناستې غوښتنه' : 'Request Site Visit or Technical Meeting'}</h4>
                <p className="text-xs text-neutral-400">{isFa ? 'مهندسان ناظر نوآرا آماده هماهنگی و ارائه گزارش‌های تکمیلی هستند.' : isPs ? 'د نوآرا څارونکي انجنیران ستاسو په خدمت کې دي.' : 'Resident engineers are ready to facilitate physical QA inspections.'}</p>
              </div>

              <a
                href="tel:+93799123456"
                className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20 whitespace-nowrap"
              >
                {isFa ? 'تماس با سرپرست کارگاه (+93 799 123 456)' : isPs ? 'له انجنیر سره اړیکه' : 'Call Supervising Team'}
              </a>
            </div>
          </section>
        )}

        {/* TAB 4: Staff & Role Permissions Management */}
        {cpmTab === 'users_permissions' && !isClient && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  <span>{isFa ? 'مدیریت کارمندان، مشتریان و پرمیژن‌ها (User & Role Matrix)' : isPs ? 'د کارکوونکو او لاسرسي واکونه' : 'Staff & Client Role Permission Matrix'}</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  {isFa ? 'ایجاد حساب کاربری برای کارمندان با سطح دسترسی سفارشی و ساخت یوزر مشتری برای مشاهده پروژه' : isPs ? 'کارکوونکو او پیرودونکو ته د ځانګړي واک لرونکی حساب جوړول' : 'Create accounts for site engineers, managers, and clients with granular permissions'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddUserModal(true)}
                className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{isFa ? 'افزودن کاربر / کارمند جدید' : isPs ? 'نوی کارن ورزیات کړئ' : 'Add New User'}</span>
              </button>
            </div>

            {/* Users Table */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 uppercase font-mono">
                    <tr>
                      <th className="p-4">{isFa ? 'نام و مشخصات' : isPs ? 'نوم او ځانګړنې' : 'User'}</th>
                      <th className="p-4">{isFa ? 'نقش سازمانی' : isPs ? 'نقش' : 'Role'}</th>
                      <th className="p-4">{isFa ? 'شرکت / نهاد' : isPs ? 'اداره' : 'Organization'}</th>
                      <th className="p-4">{isFa ? 'پرمیژن‌های دسترسی' : isPs ? 'واکونه' : 'Permissions'}</th>
                      <th className="p-4">{isFa ? 'وضعیت' : isPs ? 'حالت' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-neutral-850/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={u.avatar} alt={u.fullName} className="w-8 h-8 rounded-full object-cover" />
                            <div>
                              <div className="font-bold text-neutral-100">{u.fullName}</div>
                              <div className="text-neutral-500 font-mono text-[11px]">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-md font-mono text-[11px] font-bold ${
                            u.role === 'super_admin'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : u.role === 'project_manager'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : u.role === 'client'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {u.role.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-neutral-300 font-medium">{u.companyOrClientName || 'NawAra Studio'}</td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {u.permissions.map((p, pIdx) => (
                              <span key={pIdx} className="px-2 py-0.5 rounded bg-neutral-950 text-neutral-400 text-[10px] font-mono border border-neutral-800">
                                {p}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span>Active</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* TAB 5: Financial Ledger */}
        {cpmTab === 'financials' && !isClient && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-400" />
                  <span>{isFa ? 'دفتر کل مالی، صورت‌وضعیت‌ها و فاکتورها' : isPs ? 'مالي حسابونه او فکتورونه' : 'Financial Ledger & Invoices'}</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  {isFa ? 'ردیابی اقساط کارفرما، مخارج خرید متریال و هزینه‌های اجرایی' : isPs ? 'د لګښتونو او عوایدو بشپړ مالي راپور' : 'Client progress billings, contractor disbursements, and material invoices'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-1">
                <div className="text-xs text-neutral-500 font-mono uppercase">{isFa ? 'کل بودجه مصوب پروژه' : isPs ? 'ټوله بودیجه' : 'Total Project Budget'}</div>
                <div className="text-2xl font-bold text-neutral-100 font-mono">${(currentProject.totalBudgetUsd / 1000000).toFixed(2)}M</div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-1">
                <div className="text-xs text-neutral-500 font-mono uppercase">{isFa ? 'مبالغ دریافتی از کارفرما' : isPs ? 'ترلاسه شوې پیسې' : 'Received Payments'}</div>
                <div className="text-2xl font-bold text-emerald-400 font-mono">${(currentProject.paidAmountUsd / 1000000).toFixed(2)}M</div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-1">
                <div className="text-xs text-neutral-500 font-mono uppercase">{isFa ? 'مانده تعهدات کارفرما' : isPs ? 'پاتې پیسې' : 'Remaining Balance'}</div>
                <div className="text-2xl font-bold text-amber-400 font-mono">${((currentProject.totalBudgetUsd - currentProject.paidAmountUsd) / 1000000).toFixed(2)}M</div>
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 uppercase font-mono">
                  <tr>
                    <th className="p-4">{isFa ? 'شماره سند' : isPs ? 'نمبر' : 'Invoice #'}</th>
                    <th className="p-4">{isFa ? 'شرح تراکنش' : isPs ? 'تفصیل' : 'Description'}</th>
                    <th className="p-4">{isFa ? 'نوع' : isPs ? 'ډول' : 'Type'}</th>
                    <th className="p-4">{isFa ? 'مبلغ (USD)' : isPs ? 'پیسې' : 'Amount (USD)'}</th>
                    <th className="p-4">{isFa ? 'تاریخ' : isPs ? 'نېټه' : 'Date'}</th>
                    <th className="p-4">{isFa ? 'وضعیت تایید' : isPs ? 'حالت' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-mono">
                  {financials.map((fin) => (
                    <tr key={fin.id} className="hover:bg-neutral-850/50 transition-colors">
                      <td className="p-4 text-amber-400 font-bold">{fin.invoiceNumber}</td>
                      <td className="p-4 font-sans text-neutral-200 font-medium">{fin.title}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          fin.type.includes('income') ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                        }`}>
                          {fin.type.includes('income') ? 'INCOME' : 'EXPENSE'}
                        </span>
                      </td>
                      <td className={`p-4 font-bold ${fin.type.includes('income') ? 'text-emerald-400' : 'text-neutral-200'}`}>
                        ${fin.amountUsd.toLocaleString()}
                      </td>
                      <td className="p-4 text-neutral-400">{fin.date}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                          {fin.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 6: Materials & Inventory */}
        {cpmTab === 'materials' && !isClient && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-400" />
                  <span>{isFa ? 'انبار، موجودی و تأمین مصالح ساختمانی' : isPs ? 'ودانیز توکي او زېرمتون' : 'Material Inventory & Supply Chain'}</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  {isFa ? 'کنترل لحظه‌ای سیمان، میلگرد، شیشه، بتن و قطعات MEP' : isPs ? 'د سیمنټو، سیخ ګول او ښیښو کنټرول' : 'Real-time stock monitoring of rebar, cement, glass, and MEP supplies'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {materials.map((mat) => (
                <div key={mat.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-neutral-950 text-neutral-400 border border-neutral-800">
                      {mat.category.replace('_', ' ')}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-neutral-100">{mat.name[lang] || mat.name.en}</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">{mat.supplier}</p>
                  </div>

                  <div className="pt-2 border-t border-neutral-800 flex items-baseline justify-between">
                    <span className="text-xs text-neutral-500 font-mono">{isFa ? 'موجودی انبار:' : isPs ? 'موجودي:' : 'In Stock:'}</span>
                    <span className="text-base font-bold text-emerald-400 font-mono">
                      {mat.quantity.toLocaleString()} <span className="text-xs text-neutral-400 font-normal">{mat.unit}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Modal: Add New Staff / Client */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>{isFa ? 'ثبت کاربر / کارمند جدید' : isPs ? 'نوی کارکوونکی یا پیرودونکی' : 'Create User or Client Account'}</span>
              </h3>
              <button type="button" onClick={() => setShowAddUserModal(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-neutral-300 font-semibold">{isFa ? 'نام و نام خانوادگی' : isPs ? 'نوم' : 'Full Name'}</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Eng. Ahmad Zaki"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-300 font-semibold">{isFa ? 'نقش کاربری در سیستم' : isPs ? 'نقش' : 'Role in System'}</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="site_engineer">{isFa ? 'مهندس ناظر (Site Engineer)' : 'Site Engineer'}</option>
                  <option value="project_manager">{isFa ? 'مدیر پروژه (Project Manager)' : 'Project Manager'}</option>
                  <option value="client">{isFa ? 'کارفرما / مشتری (Client)' : 'Client (View Assigned Project)'}</option>
                  <option value="finance_officer">{isFa ? 'مسئول امور مالی (Finance Officer)' : 'Finance Officer'}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-300 font-semibold">{isFa ? 'شرکت یا نام تجاری' : isPs ? 'شرکت' : 'Company / Entity'}</label>
                <input
                  type="text"
                  value={newUserCompany}
                  onChange={(e) => setNewUserCompany(e.target.value)}
                  placeholder="e.g. NawAra Construction / Client Company"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-300 font-semibold">{isFa ? 'تخصیص به پروژه' : isPs ? 'پروژې ته ورکول' : 'Assign to Project'}</label>
                <select
                  value={newUserAssignedProj}
                  onChange={(e) => setNewUserAssignedProj(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 focus:outline-none focus:border-amber-500"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name[lang] || p.name.en}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 mt-2"
              >
                {isFa ? 'ایجاد حساب کاربری و فعال‌سازی پرمیژن‌ها' : isPs ? 'حساب جوړ کړئ' : 'Create & Activate Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Update Construction Phase Progress */}
      {showAdvancePhaseModal && selectedPhaseToEdit && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-neutral-100">
                {isFa ? 'بروزرسانی درصد پیشرفت مرحله' : isPs ? 'د پړاو پرمختګ ثبتول' : 'Update Phase Progress'}
              </h3>
              <button type="button" onClick={() => setShowAdvancePhaseModal(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleUpdatePhaseProgress} className="space-y-4 text-xs">
              <div>
                <div className="font-bold text-neutral-200 text-sm">{selectedPhaseToEdit.name[lang] || selectedPhaseToEdit.name.en}</div>
                <div className="text-neutral-400 mt-1">{isFa ? 'ناظر مسئول:' : 'Supervisor:'} {selectedPhaseToEdit.supervisorName}</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-neutral-300">{isFa ? 'درصد تکمیل شده:' : isPs ? 'سلنه:' : 'Completion Percentage:'}</label>
                  <span className="font-mono font-bold text-amber-400 text-base">{phaseProgressInput}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={phaseProgressInput}
                  onChange={(e) => setPhaseProgressInput(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/20"
              >
                {isFa ? 'ذخیره و همگام‌سازی با پرتال مشتری' : isPs ? 'ثبت او له کارفرما سره شریکول' : 'Save & Sync to Client Portal'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Daily Log */}
      {showAddDailyLogModal && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                <HardHat className="w-4 h-4 text-amber-400" />
                <span>{isFa ? 'ثبت گزارش روزانه کارگاه ساختمانی' : isPs ? 'د کارځای نوی راپور' : 'Submit Daily Site Inspection Log'}</span>
              </h3>
              <button type="button" onClick={() => setShowAddDailyLogModal(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddDailyLog} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">{isFa ? 'تعداد کارگران و مهندسان حاضر' : isPs ? 'د کارکوونکو شمېر' : 'Active Workers'}</label>
                  <input
                    type="number"
                    value={newLogWorkers}
                    onChange={(e) => setNewLogWorkers(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 font-semibold">{isFa ? 'وضعیت آب و هوا' : isPs ? 'هوا' : 'Weather'}</label>
                  <input
                    type="text"
                    value={newLogWeather}
                    onChange={(e) => setNewLogWeather(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-300 font-semibold">{isFa ? 'فعالیت‌های انجام شده (هر خط یک مورد)' : isPs ? 'ترسره شوي کارونه' : 'Completed Tasks (One per line)'}</label>
                <textarea
                  rows={3}
                  required
                  value={newLogTasks}
                  onChange={(e) => setNewLogTasks(e.target.value)}
                  placeholder={isFa ? 'مثال: بتن‌ریزی ستون‌ها\nنصب شیشه‌های نما' : 'e.g. Concrete slab pour L24\nCurtain wall inspection'}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-neutral-100 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/20"
              >
                {isFa ? 'ثبت و انتشار گزارش روزانه' : isPs ? 'راپور خپور کړئ' : 'Publish Daily Log'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
