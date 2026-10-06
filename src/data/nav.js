export const NAV_GROUPS = [
  {
    id: 'product',
    label: 'Product',
    items: [
      { to: '/dashboard', label: 'Student Dashboard', icon: 'LayoutDashboard', hint: 'Your goal, gap, match and progress at a glance' },
      { to: '/profile', label: 'Skill Profile', icon: 'UserRoundPlus', hint: 'Teach list, learn list and career goal' },
      { to: '/gap-analysis', label: 'AI Skill Gap Analysis', icon: 'ScanSearch', hint: 'Current level vs. role benchmark' },
      { to: '/matching', label: 'Peer Matching', icon: 'Sparkles', hint: 'Find the right person, ranked by match score' },
      { to: '/exchange', label: 'Skill Exchange', icon: 'Repeat', hint: 'I teach / I want to learn' },
      { to: '/learning-path', label: 'Learning Path', icon: 'Route', hint: 'A 7-step sequence toward the goal' },
      { to: '/practice', label: 'Practice Activities', icon: 'Timer', hint: '20-minute skill reps with a live timer' },
      { to: '/progress', label: 'Progress & Proof', icon: 'TrendingUp', hint: 'Charts, hours, milestones' },
      { to: '/proof', label: 'Skill Proof', icon: 'BadgeCheck', hint: 'Certificates and verified practice' },
    ],
  },
  {
    id: 'community',
    label: 'Community & Impact',
    items: [
      { to: '/community', label: 'Community', icon: 'MessagesSquare', hint: 'Discussions, challenges, workshops' },
      { to: '/impact', label: 'Social Impact', icon: 'HeartHandshake', hint: 'Turning skills into opportunity' },
    ],
  },
  {
    id: 'business',
    label: 'Business & Investor',
    items: [
      { to: '/pricing', label: 'Business Model', icon: 'CreditCard', hint: 'Free, Premium and commission' },
      { to: '/market', label: 'Market Opportunity', icon: 'Globe', hint: 'TAM, SAM, SOM' },
      { to: '/unit-economics', label: 'Unit Economics', icon: 'Gauge', hint: 'Contribution, LTV, CAC' },
      { to: '/go-to-market', label: 'Go-To-Market', icon: 'Rocket', hint: 'Channels and funnel targets' },
      { to: '/financials', label: 'Financial Projections', icon: 'BarChart3', hint: 'Three-year model' },
      { to: '/funding', label: 'Funding', icon: 'Coins', hint: 'Ask, valuation and use of funds' },
    ],
  },
  {
    id: 'company',
    label: 'Company',
    items: [
      { to: '/about', label: 'About SkillSync', icon: 'Info', hint: 'Team, principles and roadmap' },
      { to: '/', label: 'Landing Page', icon: 'Globe', hint: 'Back to the public site', exact: true },
    ],
  },
]

export const SITE_NAV = [
  { to: '/', label: 'Home', exact: true },
  { to: '/#how', label: 'How It Works', hash: '#how' },
  { to: '/#why', label: 'Why SkillSync', hash: '#why' },
  { to: '/#problem', label: 'Problem', hash: '#problem' },
  { to: '/impact', label: 'Social Impact' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
]

export const MOBILE_TABS = [
  { to: '/dashboard', label: 'Home', icon: 'LayoutDashboard' },
  { to: '/gap-analysis', label: 'AI Gap', icon: 'ScanSearch' },
  { to: '/matching', label: 'Match', icon: 'Sparkles' },
  { to: '/learning-path', label: 'Path', icon: 'Route' },
  { to: '/practice', label: 'Practice', icon: 'Timer' },
]

export const ALL_PAGES = NAV_GROUPS.flatMap((g) => g.items.map((i) => ({ ...i, group: g.label })))
