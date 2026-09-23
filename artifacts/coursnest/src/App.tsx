import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Link, Route, Switch, useLocation, useParams, Router as WouterRouter } from 'wouter';
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter,
  Globe2,
  GraduationCap,
  Layers3,
  Menu,
  Play,
  Printer,
  Search,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

const queryClient = new QueryClient();

type Lang = 'en' | 'ar';
type Category = 'Marketing' | 'Money & Finance' | 'Business & Entrepreneurship' | 'Technology & Digital Skills' | 'Personal Development';
type Course = {
  slug: string;
  title: string;
  arabicTitle: string;
  category: Category;
  level: 'Beginner' | 'Practical' | 'Foundations';
  minutes: number;
  lessons: number;
  accent: string;
  description: string;
  outcome: string;
};

const categories: { name: Category; slug: string; color: string; mark: string; blurb: string }[] = [
  { name: 'Marketing', slug: 'marketing', color: '#e8a64b', mark: '01', blurb: 'Find the people who need what you make.' },
  { name: 'Money & Finance', slug: 'money-finance', color: '#7cae91', mark: '02', blurb: 'Make money feel less mysterious.' },
  { name: 'Business & Entrepreneurship', slug: 'business-entrepreneurship', color: '#df8366', mark: '03', blurb: 'Turn a useful idea into momentum.' },
  { name: 'Technology & Digital Skills', slug: 'technology-digital-skills', color: '#6e9eb1', mark: '04', blurb: 'Build confidence with the tools of now.' },
  { name: 'Personal Development', slug: 'personal-development', color: '#b697c1', mark: '05', blurb: 'Make room for your best work.' },
];

const courses: Course[] = [
  { slug: 'marketing-fundamentals', title: 'Marketing Fundamentals', arabicTitle: 'أساسيات التسويق', category: 'Marketing', level: 'Beginner', minutes: 42, lessons: 5, accent: '#e8a64b', description: 'A clear first look at how good marketing earns attention and trust.', outcome: 'Write a simple, focused marketing brief.' },
  { slug: 'storytelling-for-brands', title: 'Storytelling for Brands', arabicTitle: 'السرد القصصي للعلامات التجارية', category: 'Marketing', level: 'Practical', minutes: 35, lessons: 4, accent: '#df8366', description: 'Shape a story people can remember, repeat, and believe.', outcome: 'Build a brand story in one page.' },
  { slug: 'social-content-that-works', title: 'Social Content That Works', arabicTitle: 'محتوى اجتماعي فعّال', category: 'Marketing', level: 'Practical', minutes: 48, lessons: 6, accent: '#e8a64b', description: 'Plan useful posts without living inside an algorithm.', outcome: 'Leave with a two-week content map.' },
  { slug: 'email-writing', title: 'Email Writing People Read', arabicTitle: 'كتابة بريد إلكتروني يُقرأ', category: 'Marketing', level: 'Practical', minutes: 31, lessons: 4, accent: '#7cae91', description: 'Write short, human emails that respect attention.', outcome: 'Draft a welcome email sequence.' },
  { slug: 'customer-research', title: 'Customer Research Basics', arabicTitle: 'أساسيات بحث العملاء', category: 'Marketing', level: 'Foundations', minutes: 39, lessons: 5, accent: '#6e9eb1', description: 'Ask better questions before you build the next thing.', outcome: 'Run three useful customer interviews.' },
  { slug: 'personal-brand', title: 'A Small Personal Brand', arabicTitle: 'علامتك الشخصية الصغيرة', category: 'Marketing', level: 'Beginner', minutes: 44, lessons: 5, accent: '#b697c1', description: 'Show your work with a voice that sounds like you.', outcome: 'Create a practical personal brand kit.' },
  { slug: 'money-map', title: 'Your Money Map', arabicTitle: 'خريطة أموالك', category: 'Money & Finance', level: 'Beginner', minutes: 38, lessons: 5, accent: '#7cae91', description: 'See where your money goes and choose what comes next.', outcome: 'Make a calm monthly money map.' },
  { slug: 'budgeting-without-shame', title: 'Budgeting Without Shame', arabicTitle: 'الميزانية بلا خجل', category: 'Money & Finance', level: 'Practical', minutes: 46, lessons: 6, accent: '#e8a64b', description: 'A flexible way to plan spending around your real life.', outcome: 'Set a budget you can actually keep.' },
  { slug: 'saving-small', title: 'The Small Start to Saving', arabicTitle: 'البداية الصغيرة للادخار', category: 'Money & Finance', level: 'Beginner', minutes: 26, lessons: 3, accent: '#6e9eb1', description: 'Build a saving habit that begins with what is possible.', outcome: 'Choose your first savings system.' },
  { slug: 'understanding-credit', title: 'Understanding Credit', arabicTitle: 'فهم الائتمان', category: 'Money & Finance', level: 'Foundations', minutes: 41, lessons: 5, accent: '#df8366', description: 'The useful, non-scary guide to credit scores and borrowing.', outcome: 'Read a credit report with confidence.' },
  { slug: 'freelance-pricing', title: 'Pricing Your Freelance Work', arabicTitle: 'تسعير عملك الحر', category: 'Money & Finance', level: 'Practical', minutes: 37, lessons: 4, accent: '#e8a64b', description: 'Price for the work, context, and care you bring.', outcome: 'Build a rate and proposal you can stand behind.' },
  { slug: 'investing-first-steps', title: 'Investing: First Steps', arabicTitle: 'الاستثمار: الخطوات الأولى', category: 'Money & Finance', level: 'Foundations', minutes: 52, lessons: 7, accent: '#7cae91', description: 'Understand the language of long-term investing before acting.', outcome: 'Make a personal learning plan for investing.' },
  { slug: 'idea-to-offer', title: 'From Idea to Useful Offer', arabicTitle: 'من الفكرة إلى عرض مفيد', category: 'Business & Entrepreneurship', level: 'Practical', minutes: 45, lessons: 6, accent: '#df8366', description: 'Turn a promising idea into something people can say yes to.', outcome: 'Describe your offer in one clear sentence.' },
  { slug: 'tiny-business-models', title: 'Tiny Business Models', arabicTitle: 'نماذج الأعمال الصغيرة', category: 'Business & Entrepreneurship', level: 'Foundations', minutes: 51, lessons: 6, accent: '#e8a64b', description: 'Explore small, sustainable ways useful work can earn.', outcome: 'Sketch a model for your next experiment.' },
  { slug: 'first-customer', title: 'Finding Your First Customer', arabicTitle: 'العثور على عميلك الأول', category: 'Business & Entrepreneurship', level: 'Beginner', minutes: 36, lessons: 4, accent: '#6e9eb1', description: 'A generous, practical approach to your first real conversations.', outcome: 'Plan ten thoughtful outreach messages.' },
  { slug: 'project-planning', title: 'Project Planning for Humans', arabicTitle: 'تخطيط المشاريع للبشر', category: 'Business & Entrepreneurship', level: 'Practical', minutes: 33, lessons: 4, accent: '#7cae91', description: 'Move a project forward without burying it in process.', outcome: 'Make a project plan that fits one page.' },
  { slug: 'negotiation-basics', title: 'Negotiation Without the Theater', arabicTitle: 'أساسيات التفاوض بلا مسرحية', category: 'Business & Entrepreneurship', level: 'Practical', minutes: 40, lessons: 5, accent: '#b697c1', description: 'Prepare for better conversations about value, time, and boundaries.', outcome: 'Use a simple preparation script.' },
  { slug: 'ethical-sales', title: 'Ethical Sales Conversations', arabicTitle: 'محادثات بيع أخلاقية', category: 'Business & Entrepreneurship', level: 'Foundations', minutes: 34, lessons: 4, accent: '#df8366', description: 'Sell by being clear about fit, not by creating pressure.', outcome: 'Write a sales conversation guide.' },
  { slug: 'digital-literacy', title: 'Everyday Digital Literacy', arabicTitle: 'المعرفة الرقمية اليومية', category: 'Technology & Digital Skills', level: 'Beginner', minutes: 44, lessons: 6, accent: '#6e9eb1', description: 'The calm, practical basics of working online.', outcome: 'Set up a safer digital workspace.' },
  { slug: 'spreadsheets-made-useful', title: 'Spreadsheets Made Useful', arabicTitle: 'جداول البيانات بطريقة مفيدة', category: 'Technology & Digital Skills', level: 'Practical', minutes: 58, lessons: 7, accent: '#7cae91', description: 'Make a spreadsheet that helps you think, not just store numbers.', outcome: 'Build a simple tracker with formulas.' },
  { slug: 'no-code-website', title: 'Your First No-Code Website', arabicTitle: 'موقعك الأول بلا برمجة', category: 'Technology & Digital Skills', level: 'Beginner', minutes: 49, lessons: 6, accent: '#e8a64b', description: 'Plan and publish a small website with confidence.', outcome: 'Map a clear one-page website.' },
  { slug: 'online-safety', title: 'Online Safety, Clearly', arabicTitle: 'الأمان على الإنترنت بوضوح', category: 'Technology & Digital Skills', level: 'Foundations', minutes: 29, lessons: 4, accent: '#df8366', description: 'Practical habits for passwords, devices, and shared spaces.', outcome: 'Create your personal safety checklist.' },
  { slug: 'intro-to-data', title: 'An Introduction to Data', arabicTitle: 'مقدمة إلى البيانات', category: 'Technology & Digital Skills', level: 'Foundations', minutes: 47, lessons: 5, accent: '#b697c1', description: 'Read patterns, questions, and caveats in everyday data.', outcome: 'Ask one better question of any chart.' },
  { slug: 'ai-at-work', title: 'Working Thoughtfully with AI', arabicTitle: 'العمل بوعي مع الذكاء الاصطناعي', category: 'Technology & Digital Skills', level: 'Practical', minutes: 39, lessons: 5, accent: '#6e9eb1', description: 'Use new tools with judgment, curiosity, and a human edit.', outcome: 'Create a responsible AI workflow.' },
  { slug: 'better-focus', title: 'A Better Relationship with Focus', arabicTitle: 'علاقة أفضل مع التركيز', category: 'Personal Development', level: 'Beginner', minutes: 27, lessons: 4, accent: '#b697c1', description: 'Make focus easier by designing the conditions around it.', outcome: 'Build a focus ritual that is yours.' },
  { slug: 'clear-writing', title: 'Clear Writing at Work', arabicTitle: 'الكتابة الواضحة في العمل', category: 'Personal Development', level: 'Practical', minutes: 35, lessons: 5, accent: '#e8a64b', description: 'Say what you mean with fewer words and more care.', outcome: 'Edit one recurring message into clarity.' },
  { slug: 'confidence-in-conversations', title: 'Confidence in Conversations', arabicTitle: 'الثقة في المحادثات', category: 'Personal Development', level: 'Foundations', minutes: 32, lessons: 4, accent: '#df8366', description: 'Prepare for the conversations you keep putting off.', outcome: 'Use a three-part conversation plan.' },
  { slug: 'learning-how-to-learn', title: 'Learning How to Learn', arabicTitle: 'كيف تتعلم', category: 'Personal Development', level: 'Beginner', minutes: 43, lessons: 5, accent: '#7cae91', description: 'A realistic approach to remembering and applying new ideas.', outcome: 'Create a learning loop for any skill.' },
  { slug: 'work-without-burnout', title: 'Work Without Burning Out', arabicTitle: 'العمل بلا احتراق', category: 'Personal Development', level: 'Practical', minutes: 36, lessons: 5, accent: '#6e9eb1', description: 'Notice your limits and make a more sustainable plan.', outcome: 'Design a week with recovery included.' },
];

const lessonNames = ['Start here', 'The useful idea', 'Try it yourself', 'A real-world example', 'Your next small step', 'Keep going'];
const lessonCopy = [
  'Every useful skill starts as a question. In this lesson, we will turn a fuzzy idea into a simple lens you can use today.',
  'The goal is not to remember every detail. Notice the pattern, then test it against the situation in front of you.',
  'Pause here and make this concrete. Write one sentence, draw one line, or choose one small action before you continue.',
  'A practical example makes the idea easier to carry. Look for what changed, what stayed simple, and what you would adapt.',
  'Progress likes a small doorway. Choose the next action that takes less than twenty minutes and put it somewhere visible.',
  'You do not need a perfect finish. Keep the useful part, leave the rest, and return when the skill meets a new problem.',
];

function t(lang: Lang, english: string, arabic: string) {
  return lang === 'ar' ? arabic : english;
}

function useLocalProgress() {
  const [completed, setCompleted] = useState<Record<string, number[]>>(() => {
    try { return JSON.parse(localStorage.getItem('coursnest-progress') || '{}'); } catch { return {}; }
  });
  const toggleLesson = (slug: string, lesson: number) => {
    setCompleted((current) => {
      const list = current[slug] || [];
      const next = list.includes(lesson) ? list.filter((item) => item !== lesson) : [...list, lesson];
      const value = { ...current, [slug]: next };
      localStorage.setItem('coursnest-progress', JSON.stringify(value));
      return value;
    });
  };
  return { completed, toggleLesson };
}

function Mark({ small = false }: { small?: boolean }) {
  return <img className={`brand-mark ${small ? 'brand-mark-small' : ''}`} src={`${import.meta.env.BASE_URL}coursnest-logo.jpg`} alt="CoursNest" />;
}

function Header({ lang, setLang }: { lang: Lang; setLang: (lang: Lang) => void }) {
  const [location] = useLocation();
  const [menu, setMenu] = useState(false);
  const nav = [
    { href: '/courses', label: t(lang, 'All courses', 'كل الدورات') },
    { href: '/learn', label: t(lang, 'Learning center', 'مركز التعلم') },
    { href: '/about', label: t(lang, 'About', 'عنّا') },
  ];
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link href="/" className="brand" data-testid="link-brand"><Mark small /><span>Cours<span>Nest</span></span></Link>
        <nav className={`main-nav ${menu ? 'is-open' : ''}`} aria-label="Main navigation">
          {nav.map((item) => <Link key={item.href} href={item.href} onClick={() => setMenu(false)} className={location === item.href ? 'active' : ''} data-testid={`link-nav-${item.href.slice(1)}`}>{item.label}</Link>)}
        </nav>
        <div className="header-actions">
          <button className="language-button" type="button" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} data-testid="button-language"><Globe2 size={16} /> {lang === 'en' ? 'العربية' : 'English'}</button>
          <Link href="/courses" className="header-cta" data-testid="link-start-learning">{t(lang, 'Start learning', 'ابدأ التعلم')} <ArrowRight size={15} /></Link>
          <button className="menu-button" type="button" onClick={() => setMenu(!menu)} aria-label="Open navigation" data-testid="button-menu">{menu ? <X size={21} /> : <Menu size={21} />}</button>
        </div>
      </div>
    </header>
  );
}

function Footer({ lang }: { lang: Lang }) {
  return <footer className="site-footer"><div className="wrap footer-grid">
    <div><Link href="/" className="brand footer-brand"><Mark small /><span>Cours<span>Nest</span></span></Link><p>{t(lang, 'Practical learning, freely shared.', 'تعلم عملي، متاح للجميع.')}</p></div>
    <div><p className="footer-label">{t(lang, 'Explore', 'استكشف')}</p><Link href="/courses">{t(lang, 'All courses', 'كل الدورات')}</Link><Link href="/learn">{t(lang, 'Learning center', 'مركز التعلم')}</Link><Link href="/about">{t(lang, 'About CoursNest', 'عن كورس نست')}</Link></div>
    <div><p className="footer-label">{t(lang, 'Good to know', 'معلومات مهمة')}</p><Link href="/contact">{t(lang, 'Contact', 'تواصل')}</Link><Link href="/privacy">{t(lang, 'Privacy policy', 'الخصوصية')}</Link><Link href="/terms">{t(lang, 'Terms', 'الشروط')}</Link></div>
    <div className="footer-note"><span className="eyebrow">© 2024 CoursNest</span><p>{t(lang, 'No subscriptions. No accounts. No catch.', 'بلا اشتراكات. بلا حسابات. بلا شروط خفية.')}</p></div>
  </div></footer>;
}

function Shell({ children, lang, setLang }: { children: ReactNode; lang: Lang; setLang: (lang: Lang) => void }) {
  return <div className="app-shell"><Header lang={lang} setLang={setLang} />{children}<Footer lang={lang} /></div>;
}

function Home({ lang }: { lang: Lang }) {
  const featured = courses.slice(0, 6);
  return <main>
    <section className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow"><span className="eyebrow-dot" /> Free learning for useful lives</p>
          <h1>{lang === 'ar' ? <>تعلّم أكثر.<br />ادفع لا شيء.</> : <>Learn more.<br />Pay nothing.</>}</h1>
          <p className="hero-lede">{t(lang, 'Practical courses for the things you want to do next — clear enough to start, useful enough to keep.', 'دورات عملية للأشياء التي تريد القيام بها لاحقاً — واضحة بما يكفي لتبدأ، ومفيدة بما يكفي لتستمر.')}</p>
          <div className="hero-actions"><Link href="/courses" className="button button-gold" data-testid="link-hero-courses">{t(lang, 'Browse all courses', 'تصفح كل الدورات')} <ArrowRight size={17} /></Link><Link href="/about" className="text-link light" data-testid="link-hero-story">{t(lang, 'Why CoursNest?', 'لماذا كورس نست؟')} <ChevronRight size={16} /></Link></div>
          <div className="hero-proof"><div className="proof-avatars"><span>LM</span><span>SA</span><span>RK</span></div><span>{t(lang, 'Made for curious people everywhere', 'صُممت للفضوليين في كل مكان')}</span></div>
        </div>
        <div className="hero-art" aria-label="A growing learning path illustration">
          <div className="art-caption">LEARNING / 01</div>
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="art-sun" /><div className="art-stem stem-one" /><div className="art-stem stem-two" />
          <div className="art-leaf leaf-one" /><div className="art-leaf leaf-two" /><div className="art-leaf leaf-three" />
          <div className="art-note note-one">a useful<br />beginning</div><div className="art-note note-two">keep<br />going →</div>
          <span className="art-index">30</span><span className="art-index-label">courses / always free</span>
        </div>
      </div>
      <div className="hero-ticker"><div className="ticker-track"><span>MARKETING</span><i>✦</i><span>MONEY & FINANCE</span><i>✦</i><span>BUSINESS</span><i>✦</i><span>DIGITAL SKILLS</span><i>✦</i><span>PERSONAL DEVELOPMENT</span><i>✦</i></div></div>
    </section>
    <section className="section intro-section"><div className="wrap intro-grid"><div><p className="eyebrow">The CoursNest way</p><h2>Useful beats impressive.</h2></div><div className="intro-copy"><p>We make short, practical learning for the moment you are in. No account to create. No paywall waiting at the end. Just a good place to begin.</p><Link href="/about" className="text-link" data-testid="link-intro-about">Read our approach <ArrowRight size={16} /></Link></div></div></section>
    <section className="section course-preview"><div className="wrap"><div className="section-heading"><div><p className="eyebrow">Start somewhere good</p><h2>Thirty ways forward.</h2></div><Link href="/courses" className="text-link" data-testid="link-see-all">See all courses <ArrowRight size={16} /></Link></div><div className="course-grid">{featured.map((course, index) => <CourseCard key={course.slug} course={course} index={index} />)}</div></div></section>
    <section className="deep-callout"><div className="wrap callout-inner"><div className="callout-number">30</div><div><p className="eyebrow">A growing library</p><h2>One good lesson<br /><em>can change a week.</em></h2><p>Learn the thing that helps you move today. Come back for the thing that helps tomorrow.</p><Link href="/courses" className="button button-cream" data-testid="link-callout-courses">Find your next course <ArrowRight size={17} /></Link></div></div></section>
    <section className="section categories-section"><div className="wrap"><div className="section-heading"><div><p className="eyebrow">Follow your curiosity</p><h2>Pick a direction.</h2></div></div><div className="category-list">{categories.map((category) => <Link href={`/category/${category.slug}`} key={category.slug} className="category-row" style={{ '--category-color': category.color } as React.CSSProperties} data-testid={`link-category-${category.slug}`}><span className="category-mark">{category.mark}</span><span className="category-name">{category.name}</span><span className="category-blurb">{category.blurb}</span><ArrowRight size={19} /></Link>)}</div></div></section>
  </main>;
}

function CourseCard({ course, index = 0 }: { course: Course; index?: number }) {
  return <Link href={`/course/${course.slug}`} className="course-card" style={{ '--card-accent': course.accent, animationDelay: `${index * 70}ms` } as React.CSSProperties} data-testid={`card-course-${course.slug}`}>
    <div className="card-top"><span className="course-accent" /><span className="course-level">{course.level}</span><span className="course-arrow"><ArrowUpRightIcon /></span></div>
    <div className="card-illustration"><div className="illustration-ring" /><div className="illustration-dot" /><span>{course.category === 'Technology & Digital Skills' ? '⌘' : course.category === 'Money & Finance' ? '₊' : course.category === 'Personal Development' ? '∿' : '✦'}</span></div>
    <p className="course-category">{course.category}</p><h3>{course.title}</h3><p className="course-description">{course.description}</p><div className="course-meta"><span><Clock3 size={14} /> {course.minutes} min</span><span><Layers3 size={14} /> {course.lessons} lessons</span></div>
  </Link>;
}

function ArrowUpRightIcon() { return <ArrowRight size={16} className="arrow-up-right" />; }

function Courses({ lang }: { lang: Lang }) {
  const [query, setQuery] = useState(''); const [selected, setSelected] = useState<Category | 'All'>('All');
  const filtered = useMemo(() => courses.filter((course) => (selected === 'All' || course.category === selected) && `${course.title} ${course.description}`.toLowerCase().includes(query.toLowerCase())), [query, selected]);
  return <main className="page-main"><section className="page-intro"><div className="wrap page-intro-inner"><p className="eyebrow">The full library / 30 courses</p><h1>{t(lang, 'Find a useful next step.', 'اعثر على خطوتك المفيدة التالية.')}</h1><p>{t(lang, 'Choose a course by what you want to make, understand, or change.', 'اختر دورة حسب ما تريد صنعه أو فهمه أو تغييره.')}</p></div></section><section className="wrap library-section"><div className="library-tools"><label className="search-field"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t(lang, 'Search courses…', 'ابحث في الدورات…')} aria-label="Search courses" data-testid="input-search-courses" />{query && <button type="button" onClick={() => setQuery('')} data-testid="button-clear-search"><X size={16} /></button>}</label><div className="filter-wrap"><Filter size={16} /><select value={selected} onChange={(event) => setSelected(event.target.value as Category | 'All')} aria-label="Filter by category" data-testid="select-category-filter"><option value="All">{t(lang, 'All topics', 'كل المواضيع')}</option>{categories.map((category) => <option value={category.name} key={category.name}>{category.name}</option>)}</select></div></div><p className="result-count" data-testid="text-course-count">{filtered.length} {t(lang, 'courses to explore', 'دورة للاستكشاف')}</p>{filtered.length ? <div className="course-grid full-grid">{filtered.map((course, index) => <CourseCard key={course.slug} course={course} index={index} />)}</div> : <div className="empty-state"><BookOpen size={30} /><h2>No courses found.</h2><p>Try a different phrase or clear the topic filter.</p><button className="button button-dark" onClick={() => { setQuery(''); setSelected('All'); }} type="button" data-testid="button-reset-courses">Reset search <X size={15} /></button></div>}</section></main>;
}

function CategoryPage({ lang }: { lang: Lang }) {
  const { slug } = useParams<{ slug: string }>(); const category = categories.find((item) => item.slug === slug);
  if (!category) return <NotFound lang={lang} />;
  const list = courses.filter((course) => course.category === category.name);
  return <main className="page-main"><section className="category-hero" style={{ '--category-color': category.color } as React.CSSProperties}><div className="wrap category-hero-inner"><Link href="/courses" className="back-link" data-testid="link-back-courses"><ChevronLeft size={16} /> All courses</Link><p className="eyebrow">Topic / {category.mark}</p><h1>{category.name}</h1><p>{category.blurb} {t(lang, 'Take one lesson, then make it real.', 'خذ درساً واحداً، ثم اجعله واقعاً.')}</p></div></section><section className="wrap category-courses"><div className="section-heading"><div><p className="eyebrow">{list.length} focused courses</p><h2>Start with what calls you.</h2></div></div><div className="course-grid">{list.map((course, index) => <CourseCard key={course.slug} course={course} index={index} />)}</div></section></main>;
}

function CourseDetail({ lang, progress, toggleLesson }: { lang: Lang; progress: Record<string, number[]>; toggleLesson: (slug: string, lesson: number) => void }) {
  const { slug } = useParams<{ slug: string }>(); const course = courses.find((item) => item.slug === slug); const [active, setActive] = useState(0); const [quizOpen, setQuizOpen] = useState(false); const [answer, setAnswer] = useState<number | null>(null);
  if (!course) return <NotFound lang={lang} />;
  const done = progress[course.slug] || []; const percent = Math.round((done.length / course.lessons) * 100); const isDone = done.includes(active);
  return <main className="lesson-page"><section className="lesson-header" style={{ '--card-accent': course.accent } as React.CSSProperties}><div className="wrap"><Link href="/courses" className="back-link light-back" data-testid="link-course-back"><ChevronLeft size={16} /> {t(lang, 'Back to all courses', 'العودة إلى كل الدورات')}</Link><div className="lesson-title-row"><div><p className="eyebrow">{course.category} / {course.level}</p><h1>{lang === 'ar' ? course.arabicTitle : course.title}</h1><p>{course.description}</p></div><div className="course-badge"><GraduationCap size={25} /><span>{course.lessons} lessons<br /><small>{course.minutes} minutes</small></span></div></div></div></section><section className="wrap lesson-layout"><aside className="lesson-sidebar"><div className="progress-label"><span>Your progress</span><strong>{percent}%</strong></div><div className="progress-track"><span style={{ width: `${percent}%` }} /></div><div className="lesson-list">{Array.from({ length: course.lessons }, (_, index) => <button type="button" key={index} className={`lesson-item ${index === active ? 'current' : ''} ${done.includes(index) ? 'completed' : ''}`} onClick={() => { setActive(index); setQuizOpen(false); }} data-testid={`button-lesson-${index + 1}`}><span className="lesson-number">{done.includes(index) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span>{lessonNames[index] || `Lesson ${index + 1}`}</span>{index === active && <ChevronRight size={15} />}</button>)}</div>{percent === 100 && <button className="certificate-button" type="button" onClick={() => window.print()} data-testid="button-print-certificate"><Printer size={16} /> Print certificate</button>}</aside><article className="lesson-content"><div className="lesson-kicker"><span>LESSON {String(active + 1).padStart(2, '0')}</span><span>{course.title}</span></div><h2>{lessonNames[active] || `Lesson ${active + 1}`}</h2><p className="lesson-lede">{lessonCopy[active % lessonCopy.length]}</p><div className="lesson-reading"><p>Learning gets useful when it leaves the page. For <strong>{course.title.toLowerCase()}</strong>, start by naming what you already know, then notice the one place where a little more clarity would change your next decision.</p><div className="pull-quote"><Sparkles size={18} /><p>“Small, honest progress is still progress.”</p></div><p>Keep the scope kind. A good first attempt gives you something to respond to; it does not need to prove everything at once. Use the prompt below, then take a breath before moving on.</p></div><div className="practice-card"><p className="eyebrow">Try this now</p><h3>{course.outcome}</h3><textarea placeholder="Write a note for yourself…" aria-label="Practice note" data-testid="textarea-practice-note" /></div><div className="lesson-actions"><button className={`button ${isDone ? 'button-outline' : 'button-dark'}`} type="button" onClick={() => toggleLesson(course.slug, active)} data-testid="button-mark-complete">{isDone ? <CheckCircle2 size={17} /> : <Check size={17} />}{isDone ? 'Completed' : 'Mark lesson complete'}</button>{active < course.lessons - 1 ? <button className="next-button" type="button" onClick={() => { if (!isDone) toggleLesson(course.slug, active); setActive(active + 1); }} data-testid="button-next-lesson">Next lesson <ArrowRight size={16} /></button> : <button className="next-button" type="button" onClick={() => setQuizOpen(true)} data-testid="button-open-quiz">Take the optional quiz <ArrowRight size={16} /></button>}</div>{quizOpen && <div className="quiz-card"><p className="eyebrow">Optional reflection</p><h3>Which approach makes learning more likely to stick?</h3><div className="quiz-options">{['Wait for a perfect block of time', 'Connect one idea to a real next action', 'Collect as many resources as possible'].map((option, index) => <button type="button" key={option} className={answer === index ? (index === 1 ? 'correct' : 'wrong') : ''} onClick={() => setAnswer(index)} data-testid={`button-quiz-option-${index}`}>{String.fromCharCode(65 + index)}. {option}{answer === index && (index === 1 ? <Check size={16} /> : <X size={16} />)}</button>)}</div>{answer !== null && <p className="quiz-feedback">{answer === 1 ? 'That is it. Give the idea somewhere real to land.' : 'Not quite. Try choosing the option that turns an idea into action.'}</p>}</div>}</article></section></main>;
}

function Learn({ lang }: { lang: Lang }) {
  const articles = [
    ['A small system for learning after work', 'You do not need an empty calendar to make progress. Try this 20-minute loop.', '6 min read'],
    ['What to do when a goal feels too large', 'Shrink the starting line until the next action feels almost obvious.', '4 min read'],
    ['The quiet power of writing things down', 'A clear note can be a second brain, a promise, and a place to begin again.', '5 min read'],
  ];
  return <main className="page-main"><section className="page-intro learn-intro"><div className="wrap page-intro-inner"><p className="eyebrow">The learning center</p><h1>Ideas for the<br /><em>in-between.</em></h1><p>Short reads for the days when a course is too much and a useful thought is exactly enough.</p></div></section><section className="wrap articles-section"><div className="article-feature"><div className="feature-shape"><span>FIELD<br />NOTE<br />01</span></div><div><p className="eyebrow">Featured field note</p><h2>Learning is a place you can return to.</h2><p>There is no single right pace. Build a small ritual, make one idea tangible, and let your curiosity do the rest.</p><Link href="/learn/learning-is-a-place" className="text-link" data-testid="link-feature-article">Read the field note <ArrowRight size={16} /></Link></div></div><div className="article-list">{articles.map(([title, desc, meta], index) => <Link href={`/learn/article-${index + 1}`} key={title} className="article-row" data-testid={`link-article-${index + 1}`}><span className="article-index">0{index + 2}</span><div><p className="eyebrow">{meta}</p><h3>{title}</h3><p>{desc}</p></div><ArrowUpRightIcon /></Link>)}</div></section></main>;
}

function ArticleDetail({ lang }: { lang: Lang }) {
  return <main className="page-main article-detail"><div className="wrap narrow"><Link href="/learn" className="back-link" data-testid="link-back-learn"><ChevronLeft size={16} /> Learning center</Link><p className="eyebrow">Field note / 6 min read</p><h1>Learning is a place you can return to.</h1><p className="article-dek">A useful learning practice is less about speed and more about leaving a door open for your future self.</p><div className="article-body"><p>Some days, learning arrives as a deliberate hour. Other days it is five minutes while the kettle boils, a sentence underlined on a train, or a question you write down before sleep.</p><h2>Make the doorway small</h2><p>The best learning system is the one that still works when your life is full. Choose a time, place, or cue you already have. Put one lesson there. Remove the ceremony.</p><blockquote>Keep one promise small enough that you can keep it on a difficult day.</blockquote><p>Then make the idea leave the page. Explain it to someone. Use it in a spreadsheet. Change one line of an email. Learning becomes yours when it meets a real surface.</p><h2>Return without starting over</h2><p>You are allowed to come back. Progress is not erased by a missed week; it is made more durable by the way you return. Save the next question. Let it wait for you.</p></div><Link href="/courses" className="button button-dark" data-testid="link-article-courses">Find a course to begin <ArrowRight size={16} /></Link></div></main>;
}

function About({ lang }: { lang: Lang }) {
  return <main className="page-main"><section className="about-hero"><div className="wrap about-hero-inner"><p className="eyebrow">About CoursNest</p><h1>Learning should feel<br /><em>like a light left on.</em></h1><p>We are building a generous corner of the internet for practical skills — in English and Arabic, without the subscription-shaped door.</p></div></section><section className="wrap values-section"><div className="values-intro"><p className="eyebrow">Our promise</p><h2>Learn more.<br /><span>Pay nothing.</span></h2></div><div className="values-list"><div><span>01</span><h3>Useful over impressive</h3><p>Every course is made to help with a real decision, task, or conversation.</p></div><div><span>02</span><h3>Open by default</h3><p>No account, tracking maze, or payment step stands between you and a lesson.</p></div><div><span>03</span><h3>Human pace</h3><p>Short, clear, and kind to the life you already have.</p></div></div></section><section className="deep-callout about-callout"><div className="wrap"><p className="eyebrow">A note from the nest</p><h2>Bring your questions.<br /><em>Leave with a next step.</em></h2><Link href="/courses" className="button button-cream" data-testid="link-about-courses">Explore the library <ArrowRight size={16} /></Link></div></section></main>;
}

function Contact({ lang }: { lang: Lang }) {
  const [sent, setSent] = useState(false);
  return <main className="page-main"><section className="page-intro contact-intro"><div className="wrap page-intro-inner"><p className="eyebrow">Say hello</p><h1>Good questions<br /><em>welcome here.</em></h1><p>Found a rough edge, have an idea for a course, or simply want to tell us what helped? We read every note.</p></div></section><section className="wrap contact-section"><div className="contact-details"><p className="eyebrow">Contact</p><h2>We are listening.</h2><p>Send a note through the form. For collaboration and accessibility questions, include a little context so we can make a useful reply.</p><p className="contact-email">hello@coursnest.example</p></div>{sent ? <div className="success-card"><CheckCircle2 size={35} /><h2>Note received.</h2><p>Thank you for making this little corner better.</p><button type="button" className="button button-dark" onClick={() => setSent(false)} data-testid="button-send-another">Send another note</button></div> : <form className="contact-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}><label>Your name<input required placeholder="How should we address you?" data-testid="input-contact-name" /></label><label>Your email<input required type="email" placeholder="you@example.com" data-testid="input-contact-email" /></label><label>Your message<textarea required placeholder="What is on your mind?" data-testid="textarea-contact-message" /></label><button className="button button-dark" type="submit" data-testid="button-submit-contact">Send note <Send size={16} /></button></form>}</section></main>;
}

function Legal({ title, intro, sections }: { title: string; intro: string; sections: [string, string][] }) {
  return <main className="page-main legal-page"><div className="wrap narrow"><p className="eyebrow">CoursNest / {title}</p><h1>{title}</h1><p className="legal-intro">{intro}</p>{sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}</div></main>;
}

function NotFound({ lang }: { lang: Lang }) {
  return <main className="page-main not-found"><div className="wrap"><div className="not-found-mark">404</div><p className="eyebrow">A little off the path</p><h1>This page took<br /><em>a different turn.</em></h1><p>Nothing is lost. There are thirty useful places to begin.</p><Link href="/courses" className="button button-dark" data-testid="link-404-courses">Browse courses <ArrowRight size={16} /></Link></div></main>;
}

function RouterView({ lang, setLang }: { lang: Lang; setLang: (lang: Lang) => void }) {
  const progressApi = useLocalProgress();
  return <Shell lang={lang} setLang={setLang}><Switch>
    <Route path="/" component={() => <Home lang={lang} />} />
    <Route path="/courses" component={() => <Courses lang={lang} />} />
    <Route path="/category/:slug" component={() => <CategoryPage lang={lang} />} />
    <Route path="/course/:slug" component={() => <CourseDetail lang={lang} progress={progressApi.completed} toggleLesson={progressApi.toggleLesson} />} />
    <Route path="/learn" component={() => <Learn lang={lang} />} />
    <Route path="/learn/:slug" component={() => <ArticleDetail lang={lang} />} />
    <Route path="/about" component={() => <About lang={lang} />} />
    <Route path="/contact" component={() => <Contact lang={lang} />} />
    <Route path="/privacy" component={() => <Legal title="Privacy policy" intro="CoursNest is designed to be useful without knowing who you are. This is the short version of how the site works." sections={[['No account, no profile', 'You can browse every course and read every lesson without creating an account. We do not sell personal information or build advertising profiles.'], ['Local progress', 'Course completion and language preferences are stored in your browser using local storage. Clearing your browser data clears that progress.'], ['Questions', 'If you contact us, we use the details you share only to reply to your message and improve CoursNest.']]} />} />
    <Route path="/privacy-policy" component={() => <Legal title="Privacy policy" intro="CoursNest is designed to be useful without knowing who you are. This is the short version of how the site works." sections={[['No account, no profile', 'You can browse every course and read every lesson without creating an account. We do not sell personal information or build advertising profiles.'], ['Local progress', 'Course completion and language preferences are stored in your browser using local storage. Clearing your browser data clears that progress.'], ['Questions', 'If you contact us, we use the details you share only to reply to your message and improve CoursNest.']]} />} />
    <Route path="/terms" component={() => <Legal title="Terms of use" intro="CoursNest is free to use. These plain-language terms help keep it a generous, respectful place." sections={[['Use the lessons well', 'Our courses are educational starting points, not professional financial, legal, medical, or career advice. Make decisions with the right qualified support when the stakes are high.'], ['Share with care', 'You may link to and talk about CoursNest. Please do not copy, resell, or present our course material as your own.'], ['The simple version', 'Use CoursNest respectfully, keep your own notes safe, and tell us when something needs fixing.']]} />} />
    <Route path="/terms-of-use" component={() => <Legal title="Terms of use" intro="CoursNest is free to use. These plain-language terms help keep it a generous, respectful place." sections={[['Use the lessons well', 'Our courses are educational starting points, not professional financial, legal, medical, or career advice. Make decisions with the right qualified support when the stakes are high.'], ['Share with care', 'You may link to and talk about CoursNest. Please do not copy, resell, or present our course material as your own.'], ['The simple version', 'Use CoursNest respectfully, keep your own notes safe, and tell us when something needs fixing.']]} />} />
    <Route path="/cookies" component={() => <Legal title="Cookie policy" intro="A cookie is not required to learn here. We keep this page simple because the site is simple." sections={[['What we use', 'CoursNest does not require advertising cookies, login cookies, or tracking pixels. Local storage remembers your language choice and lesson progress on your own device.'], ['Your choice', 'You can remove local storage at any time through your browser settings. The site remains available without it.']]} />} />
    <Route path="/cookie-policy" component={() => <Legal title="Cookie policy" intro="A cookie is not required to learn here. We keep this page simple because the site is simple." sections={[['What we use', 'CoursNest does not require advertising cookies, login cookies, or tracking pixels. Local storage remembers your language choice and lesson progress on your own device.'], ['Your choice', 'You can remove local storage at any time through your browser settings. The site remains available without it.']]} />} />
    <Route path="/disclaimer" component={() => <Legal title="Disclaimer" intro="CoursNest lessons are practical education, not a substitute for advice tailored to your situation." sections={[['Use your judgment', 'Ideas about money, business, technology, and personal development should be tested against your context. We aim to make a useful beginning, not promise a particular result.'], ['Keep asking', 'If a topic affects your health, finances, legal position, or safety, speak with an appropriately qualified professional.']]} />} />
    <Route component={() => <NotFound lang={lang} />} />
  </Switch></Shell>;
}

function App() {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('coursnest-language') as Lang) || 'en');
  useEffect(() => { document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = lang; localStorage.setItem('coursnest-language', lang); }, [lang]);
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><RoutedErrorBoundary><RouterView lang={lang} setLang={setLang} /></RoutedErrorBoundary></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

export default App;