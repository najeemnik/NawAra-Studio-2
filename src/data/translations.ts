import { Language } from '../types';

export const translations = {
  brand: {
    studioName: {
      fa: 'نو آرا استدیو',
      en: 'NawAra Studio',
      ps: 'نو آرا سټوډیو',
    },
    companyFullName: {
      fa: 'شرکت ساختمانی و مهندسی نوآرا',
      en: 'NawAra Construction & Engineering Co.',
      ps: 'د نوآرا ودانیز او انجنیري شرکت',
    },
    cpmName: {
      fa: 'نوآرا CPM - مدیریت پروژه',
      en: 'NawAra CPM - Project Manager',
      ps: 'نوآرا CPM - د پروژې سمبالښت',
    },
    tagline: {
      fa: 'معماری مدرن، مهندسی پیشرفته و نظارت دقیق بر پروژه‌های عمرانی افغانستان',
      en: 'Modern Architecture, Advanced Engineering & Precision Project Management in Afghanistan',
      ps: 'عصري معمارۍ، پرمختللی انجنیري او په افغانستان کې د ودانیزو پروژو کره څارنه',
    },
  },
  nav: {
    projects: { fa: 'پروژه‌ها', en: 'Projects', ps: 'پروژې' },
    studio3d: { fa: 'نمایش سه‌بعدی', en: '3D Explorer', ps: '۳D ماډلونه' },
    about: { fa: 'درباره ما', en: 'About Studio', ps: 'زموږ په اړه' },
    cpmPortal: { fa: 'پرتال NawAra CPM', en: 'NawAra CPM Portal', ps: 'نوآرا CPM پورټل' },
    adminPanel: { fa: 'پنل مدیریت', en: 'Admin Panel', ps: 'د مدیریت پینل' },
    contact: { fa: 'ارتباط با ما', en: 'Contact', ps: 'اړیکه' },
    login: { fa: 'ورود کارمندان / مشتریان', en: 'Staff & Client Login', ps: 'د کارکوونکو او پیرودونکو ننوتل' },
    logout: { fa: 'خروج', en: 'Logout', ps: 'وتل' },
    livePhaseTracker: { fa: 'رهگیری زنده مراحل ساخت', en: 'Live Construction Stages', ps: 'د جوړولو ژوندی پړاوونه' },
    viewIn8k: { fa: 'مشاهده با کیفیت 8K', en: 'View in 8K Ultra-HD', ps: 'په 8K کیفیت کتل' },
  },
  categories: {
    all: { fa: 'همه پروژه‌ها', en: 'All Projects', ps: 'ټولې پروژې' },
    commercial: { fa: 'تجاری و اداری', en: 'Commercial & Office', ps: 'تجارتي او دفترونه' },
    residential: { fa: 'مسکونی و ویلا', en: 'Residential & Villas', ps: 'استوګنیز او ویلاګانې' },
    civic_cultural: { fa: 'فرهنگی و عمومی', en: 'Civic & Cultural', ps: 'کلتوري او عامه' },
    healthcare: { fa: 'درمانی و شفاخانه‌ها', en: 'Healthcare & Hospitals', ps: 'روغتیایي او روغتونونه' },
    educational: { fa: 'آموزشی و دانشگاه', en: 'Educational', ps: 'تعلیمي او پوهنتون' },
    infrastructure: { fa: 'زیرساخت و پارک صنعتی', en: 'Infrastructure & Tech Parks', ps: 'زېربناوې او صنعتي پارکونه' },
    hospitality: { fa: 'هتل و اقامتگاه', en: 'Hospitality & Resorts', ps: 'هوټلونه او تفرېحي ځایونه' },
  },
  specs: {
    typology: { fa: 'کاربری / تایپولوژی', en: 'Typology', ps: 'د پروژې ډول' },
    status: { fa: 'وضعیت اجرا', en: 'Status', ps: 'حالت' },
    location: { fa: 'موقعیت', en: 'Location', ps: 'ځای او ښار' },
    area: { fa: 'مساحت زیربنا', en: 'Floor Area', ps: 'ټوله ساحه' },
    year: { fa: 'سال طراحی / تکمیل', en: 'Year', ps: 'کال' },
    client: { fa: 'کارفرما / مالک', en: 'Client', ps: 'فرمایش ورکوونکی' },
    collaborators: { fa: 'همکاران و مشاوران', en: 'Collaborators', ps: 'همکاران او سلاکاران' },
    structuralEngineer: { fa: 'مهندسی سازه و زلزله', en: 'Structural Engineering', ps: 'د جوړښت او زلزلې انجنیري' },
    sustainability: { fa: 'استاندارد پایداری و انرژی', en: 'Sustainability Rating', ps: 'د انرژۍ او چاپېریال معیار' },
    budget: { fa: 'بودجه تقریبی', en: 'Estimated Budget', ps: 'اټکلي بودیجه' },
    progress: { fa: 'پیشرفت فیزیکی کل', en: 'Total Progress', ps: 'ټول پرمختګ' },
    modelInteractive: { fa: 'کاوشگر سه‌بعدی و دیاگرام سازه‌ای', en: 'Interactive 3D Architectural Explorer', ps: '۳D ماډل او د جوړښت دیاګرام' },
  },
  statusLabels: {
    completed: { fa: 'تکمیل شده و بهره‌برداری', en: 'Completed', ps: 'بشپړ شوی' },
    under_construction: { fa: 'در حال ساخت و نظارت', en: 'Under Construction', ps: 'تر کار لاندې' },
    in_design: { fa: 'در مرحله طراحی و محاسبات', en: 'In Design & Engineering', ps: 'د ډیزاین په پړاو کې' },
    concept: { fa: 'طرح مفهومی و پروپوزل', en: 'Concept Masterplan', ps: 'مفهومي طرحه' },
  },
  cpm: {
    title: { fa: 'سیستم جامع مدیریت پروژه ساختمانی نوآرا (NawAra CPM)', en: 'NawAra Construction Project Management System', ps: 'د نوآرا ودانیزو پروژو د سمبالښت جامع سیستم' },
    subtitle: { fa: 'مدیریت مراحل اجرایی، پرتال مشتریان، کارمندان، پیشرفت روزانه و امور مالی', en: 'Construction phase tracking, client portal, staff permission matrix, daily logs & finances', ps: 'د ساختماني پړاوونو څارنه، د پیرودونکو پورټل، د کارکوونکو لاسرسی او مالي راپورونه' },
    loginPrompt: { fa: 'ورود امن به سامانه NawAra CPM', en: 'Secure Login to NawAra CPM', ps: 'نوآرا CPM ته خوندي ننوتل' },
    username: { fa: 'نام کاربری / ایمیل', en: 'Username or Email', ps: 'کارن نوم یا بریښنالیک' },
    password: { fa: 'کلمه عبور', en: 'Password', ps: 'پټنوم' },
    loginBtn: { fa: 'ورود به پرتال', en: 'Sign In to Portal', ps: 'پورټل ته ننوتل' },
    demoQuickLogin: { fa: 'ورود سریع تستی با نقش‌های سازمانی:', en: 'Quick Demo Role Login:', ps: 'د نقشونو چټکه آزموینه:' },
    clientPortal: { fa: 'پرتال اختصاصی مشتری', en: 'Client Exclusive Portal', ps: 'د پیرودونکي ځانګړی پورټل' },
    stagesTitle: { fa: 'مراحل ساخت و ساز پروژه (Stage Tracking)', en: 'Construction Phase Milestones', ps: 'د ساختمان پړاوونه او پرمختګ' },
    dailyLogs: { fa: 'گزارش‌های روزانه کارگاه', en: 'Daily Site Logs', ps: 'د کارځای ورځني راپورونه' },
    materials: { fa: 'انبار و متریال ساختمانی', en: 'Materials & Stock', ps: 'ودانیز توکي او ذخیره' },
    financials: { fa: 'حسابداری و پرداخت‌های مالی', en: 'Financials & Invoices', ps: 'مالي حسابونه او تادیات' },
    teamManagement: { fa: 'مدیریت کارمندان و دسترسی‌ها', en: 'Staff & Role Permissions', ps: 'د کارکوونکو او واکونو سمبالښت' },
    addStaff: { fa: 'افزودن کارمند جدید', en: 'Add Team Member', ps: 'نوی کارکوونکی ورزیات کړئ' },
    roleAdmin: { fa: 'مدیر ارشد (Super Admin)', en: 'Super Admin', ps: 'لوړپوړی مدیر' },
    rolePm: { fa: 'مدیر پروژه (Project Manager)', en: 'Project Manager', ps: 'د پروژې مدیر' },
    roleEngineer: { fa: 'مهندس ناظر (Site Engineer)', en: 'Site Engineer', ps: 'څارونکی انجنیر' },
    roleClient: { fa: 'کارفرما / مشتری (Client)', en: 'Client / Owner', ps: 'پیرودونکی / مالک' },
    roleFinance: { fa: 'مسئول مالی (Finance)', en: 'Finance Officer', ps: 'مالي مدیر' },
  },
  security: {
    photoShield: { fa: 'حفاظت هوشمند کپی‌رایت 8K', en: '8K Secure Copyright Shield Active', ps: 'د کاپي رایټ فعال 8K امنیت' },
    photoNotice: { fa: 'تصاویر با رزولوشن بسیار بالا جهت پیش‌نمایش بهینه‌سازی شده‌اند و ذخیره‌سازی غیرمجاز مسدود است.', en: 'High-fidelity images are protected with copyright watermarking and direct extraction protection.', ps: 'انځورونه په لوړ کیفیت ساتل شوي او غیرمجاز کښته کول بند دي.' },
  },
};

export function useTranslation(lang: Language) {
  return {
    t: (section: keyof typeof translations, key: string) => {
      // @ts-ignore
      return translations[section]?.[key]?.[lang] || translations[section]?.[key]?.['en'] || key;
    },
    lang,
    dir: lang === 'en' ? 'ltr' : 'rtl',
  };
}
