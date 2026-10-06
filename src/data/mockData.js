/**
 * SkillSync — single source of truth for all demo data.
 *
 * Values mirror the SkillSync_Numeric_Data.xlsx deck (slides referenced below).
 * Each dataset carries a `provenance` tag so the UI can honestly distinguish:
 *
 *  'source'      → published third-party data (AISHE 2021–22, India Skills Report 2025)
 *  'illustrative'→ product examples / modelled assumptions, NOT validated outcomes
 *  'target'      → future goals, NOT current traction
 *  'proposed'    → founder proposals, NOT committed terms
 *  'modelled'    → planning assumptions, to be validated through pilot
 */

export const PROVENANCE = {
  source: {
    id: 'source',
    label: 'Source data',
    tone: 'teal',
    note: 'Published third-party statistics.',
  },
  illustrative: {
    id: 'illustrative',
    label: 'Illustrative',
    tone: 'violet',
    note: 'Product example — not a validated outcome.',
  },
  target: {
    id: 'target',
    label: 'Future target',
    tone: 'amber',
    note: 'Future goal — not current traction.',
  },
  proposed: {
    id: 'proposed',
    label: 'Proposed',
    tone: 'brand',
    note: 'Founder proposal — not a committed term.',
  },
  modelled: {
    id: 'modelled',
    label: 'Planning assumption',
    tone: 'ink',
    note: 'Planning assumption — to be validated through pilot.',
  },
}

/* ------------------------------------------------------------------ *
 * BRAND
 * ------------------------------------------------------------------ */
export const BRAND = {
  name: 'SkillSync',
  tagline: 'Find the Right Skill. Find the Right Person. Build the Right Career.',
  taglineLines: ['Find the Right Skill.', 'Find the Right Person.', 'Build the Right Career.'],
  supporting:
    'An AI-powered skill development network that helps students identify skill gaps, connect with the right peers, exchange skills and progress toward their career goals.',
  year: '2026',
}

/* ------------------------------------------------------------------ *
 * LANDING — PROBLEM (Slide 2)
 * ------------------------------------------------------------------ */
export const PROBLEMS = [
  {
    id: 'career-goal',
    icon: 'Target',
    title: 'A career goal without a map',
    short: 'Career goal',
    body:
      'Students pick a destination — investment banking, product, brand marketing — but never get a step-by-step route from where they are today.',
    stat: 'Goal set, plan missing',
  },
  {
    id: 'skill-gap',
    icon: 'Compass',
    title: 'The skill gap is invisible',
    short: 'Unknown skill gap',
    body:
      'Without a benchmark against real role requirements, students cannot tell which two of twelve skills actually decide the outcome.',
    stat: 'No benchmark',
  },
  {
    id: 'cost',
    icon: 'Wallet',
    title: 'Courses are expensive or generic',
    short: 'Expensive or generic courses',
    body:
      'Paid programmes cost more than a student can justify, while free content is broad and impersonal — rarely mapped to one career goal.',
    stat: 'High cost, low specificity',
  },
  {
    id: 'matching',
    icon: 'Users',
    title: 'Hard to find the right person',
    short: 'Hard to find the right person',
    body:
      'The classmate who already knows financial modelling is three rows away — and there is no structured way to find and pair with them.',
    stat: 'Matching not discovery',
  },
  {
    id: 'exposure',
    icon: 'FlaskConical',
    title: 'Low practical exposure',
    short: 'Low practical exposure',
    body:
      'Theory-heavy learning leaves students without the reps: no live cases, no critique, no practice under realistic constraints.',
    stat: 'Theory over reps',
  },
  {
    id: 'proof',
    icon: 'BadgeCheck',
    title: 'Weak skill proof',
    short: 'Weak skill proof',
    body:
      'Certificates list course names, not capability. Recruiters cannot verify what a student can actually build or analyse.',
    stat: 'Courses, not capability',
  },
]

/** Slide 2 — AISHE 2021–22 + India Skills Report 2025 */
export const PROBLEM_STATS = [
  {
    id: 'students',
    value: 4.33,
    decimals: 2,
    suffix: ' crore',
    label: 'Enrolled higher-education students',
    source: 'AISHE 2021–22',
    provenance: 'source',
  },
  {
    id: 'ger',
    value: 28.4,
    decimals: 1,
    suffix: '%',
    label: 'Gross Enrolment Ratio',
    source: 'AISHE 2021–22',
    provenance: 'source',
  },
  {
    id: 'employability',
    value: 54.81,
    decimals: 2,
    suffix: '%',
    label: 'Graduates expected to be employable',
    source: 'India Skills Report 2025',
    provenance: 'source',
  },
]

/* ------------------------------------------------------------------ *
 * WHY SKILLSYNC (Slide 4)
 * ------------------------------------------------------------------ */
export const LANDSCAPE = [
  {
    id: 'content',
    category: 'CONTENT',
    product: 'YouTube / Coursera / Udemy',
    gives: 'Information',
    detail:
      'Deep catalogue and video libraries. Excellent at scale — the gap is personalisation to a single career goal and a specific student.',
    icon: 'PlayCircle',
    tone: 'rose',
  },
  {
    id: 'mentorship',
    category: 'MENTORSHIP',
    product: 'Experienced people',
    gives: 'Guidance',
    detail:
      'Senior practitioners give direction. Availability is scarce, and access is unevenly distributed across campuses.',
    icon: 'GraduationCap',
    tone: 'amber',
  },
  {
    id: 'social',
    category: 'SOCIAL NETWORKS',
    product: 'LinkedIn',
    gives: 'Connections',
    detail:
      'Professional reach and visibility. Optimised for discovery of people, not for structured skill development.',
    icon: 'Network',
    tone: 'sky',
  },
  {
    id: 'peer',
    category: 'SKILL EXCHANGE',
    product: 'Peer platforms',
    gives: 'Exchange',
    detail:
      'Structured swapping of skills with peers. Typically lacks skill-gap diagnosis and progress proof.',
    icon: 'Repeat',
    tone: 'teal',
  },
]

export const WHY_SKILLSYNC = {
  category: 'SKILLSYNC',
  product: 'SkillSync',
  gives: 'Personalized skill development across Discovery + Matching + Progress',
  pillars: [
    {
      id: 'discovery',
      title: 'Discovery',
      icon: 'Compass',
      body: 'Map a career goal to the exact skills employers expect, then score your current level against that benchmark.',
    },
    {
      id: 'matching',
      title: 'Matching',
      icon: 'Sparkles',
      body: 'Recommend the peers whose teach-skills close your gap and who need what you already know.',
    },
    {
      id: 'progress',
      title: 'Progress',
      icon: 'TrendingUp',
      body: 'Turn practice into trackable progress, and progress into verifiable skill proof.',
    },
  ],
  note:
    'SkillSync positioning thesis. SkillSync is not positioned as a replacement for content libraries, mentors or professional networks — it is positioned as the layer that sequences them toward one career goal for one student.',
}

/* ------------------------------------------------------------------ *
 * HOW IT WORKS (Slide 5) — 8 steps
 * ------------------------------------------------------------------ */
export const JOURNEY = [
  {
    id: 1,
    title: 'Create skill profile',
    icon: 'UserRoundPlus',
    body: 'Two minutes to a working profile: year of study, target function, current level. No résumé upload required.',
    output: 'Profile',
  },
  {
    id: 2,
    title: 'Add skills I can teach',
    icon: 'Presentation',
    body: 'Anything from formula-level Excel to a Canva portfolio. Peers validate it through sessions.',
    output: 'Teach list',
  },
  {
    id: 3,
    title: 'Add skills I want to learn',
    icon: 'BookOpenCheck',
    body: 'Pick from a taxonomy of role-relevant skills rather than free-text tags, so matching stays precise.',
    output: 'Learn list',
  },
  {
    id: 4,
    title: 'Define career goal',
    icon: 'Target',
    body: 'One goal at a time. The goal becomes the benchmark for every recommendation that follows.',
    output: 'Benchmark',
  },
  {
    id: 5,
    title: 'AI identifies skill gaps',
    icon: 'ScanSearch',
    body: 'Current level versus the target level for the role, expressed as a ranked gap list.',
    output: 'Gap report',
  },
  {
    id: 6,
    title: 'AI recommends peers',
    icon: 'Sparkles',
    body: 'Matching weighs skill compatibility, career alignment, learning preference and availability.',
    output: 'Match list',
  },
  {
    id: 7,
    title: 'Learn + practice',
    icon: 'FlaskConical',
    body: 'Structured 20-minute activities and peer sessions — built for a hostel timetable, not a lecture hall.',
    output: 'Activity log',
  },
  {
    id: 8,
    title: 'Track progress + build skill proof',
    icon: 'BadgeCheck',
    body: 'Every completed activity and peer session accrues to a portable proof record.',
    output: 'Skill proof',
  },
]

/* ------------------------------------------------------------------ *
 * DEMO STUDENT — Slide 3 / 6 / 7
 * ------------------------------------------------------------------ */
export const DEMO_STUDENT = {
  id: 'sakshi',
  name: 'Sakshi Jadhav',
  firstName: 'Sakshi',
  initials: 'SJ',
  avatarTone: 'from-brand-600 to-violet-600',
  year: 'Final year · BBA',
  campus: 'Symbiosis Institute, Pune',
  careerGoal: 'Investment Banking',
  headline: 'Building toward an investment banking analyst role through peer exchange.',
  teach: ['Financial Analysis'],
  learn: ['Digital Marketing'],
  teachDetail: [
    { name: 'Financial Analysis', level: 'Advanced', sessions: 9 },
  ],
  learnDetail: [
    { name: 'Digital Marketing', level: 'Beginner', target: 'Intermediate' },
  ],
  gapSkills: ['Financial Modelling', 'Valuation', 'Advanced Excel'],
  matchScore: 94,
  progress: 68,
  streakDays: 12,
  skillsCompleted: 6,
  rating: 4.7,
  exchanges: 6,
  hoursLearned: 18.5,
  sessions: 12,
  proofs: 5,
}

/* ------------------------------------------------------------------ *
 * SKILL TAXONOMY
 * ------------------------------------------------------------------ */
export const SKILLS = [
  'Financial Analysis', 'Financial Modelling', 'Valuation', 'Advanced Excel', 'Excel',
  'Business Analysis', 'Digital Marketing', 'SEO', 'Social Media Marketing', 'Performance Marketing',
  'Content Strategy', 'Canva', 'Graphic Design', 'Brand Management', 'Consumer Insights',
  'Python', 'SQL', 'Data Analytics', 'Data Visualisation', 'Tableau', 'Power BI',
  'Product Management', 'Product Analytics', 'User Research', 'Roadmapping', 'Agile / Scrum',
  'Public Speaking', 'Communication', 'Negotiation', 'Leadership', 'Case Interviewing',
  'Statistics', 'Machine Learning', 'UI/UX Design', 'Figma', 'Copywriting', 'Project Management',
]

export const CAREER_GOALS = [
  'Investment Banking', 'Brand Management', 'Product Management', 'Data Analytics',
  'Management Consulting', 'Equity Research', 'Digital Marketing', 'Business Development',
  'Entrepreneurship', 'Risk & Compliance',
]

export const AVAILABILITY_OPTIONS = ['Weekdays', 'Weekends', 'Evenings', 'Flexible']
export const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced']
export const LEARNING_PREFERENCES = ['Hands-on', 'Case-based', 'Reading-first', 'Project-based', 'Discussion-led']

/* ------------------------------------------------------------------ *
 * SKILL-GAP ANALYSIS (Slide 3 / 6)
 * ------------------------------------------------------------------ */
export const SKILL_GAP = {
  career: 'Investment Banking',
  benchmarkNote:
    'Target levels reflect the illustrative benchmark used in this prototype for an entry-level investment banking analyst profile.',
  currentSkills: [
    { name: 'Financial Analysis', level: 78, note: 'Strongest asset — validated by 9 peer sessions.' },
    { name: 'Excel', level: 70, note: 'Comfortable with formulas, short on modelling shortcuts.' },
    { name: 'Business Analysis', level: 66, note: 'Good structuring instinct, thin on industry frameworks.' },
  ],
  gapSkills: [
    {
      name: 'Financial Modelling',
      current: 45,
      target: 85,
      priority: 'Critical',
      why: 'Core deliverable of the role — three-statement models and DCF builds.',
      weeks: 4,
    },
    {
      name: 'Valuation',
      current: 35,
      target: 80,
      priority: 'Critical',
      why: 'Comparable companies and precedent transactions come up in every interview round.',
      weeks: 3,
    },
    {
      name: 'Advanced Excel',
      current: 55,
      target: 90,
      priority: 'High',
      why: 'Speed in Excel is the difference between finishing and not finishing a live case.',
      weeks: 2,
    },
  ],
  /** Simulated frontend "reasoning" trace — not a real model call. */
  analysisTrace: [
    'Reading career goal: Investment Banking',
    'Loading illustrative role benchmark (14 skills, 3 critical)',
    'Comparing current levels against benchmark target levels',
    'Ranking gaps by interview impact',
    'Selecting peer matches with teach-skills that close the top 3 gaps',
    'Sequencing 7-step learning path',
  ],
}

/* ------------------------------------------------------------------ *
 * PEERS (Slides 6 / 7 / 8)
 * ------------------------------------------------------------------ */
export const PEERS = [
  {
    id: 'aarav',
    name: 'Aarav Mehta',
    initials: 'AM',
    avatarTone: 'from-violet-500 to-brand-600',
    year: 'MBA · Year 2',
    campus: 'IIM, Indore',
    teach: ['Digital Marketing', 'SEO', 'Social Media Marketing'],
    learn: ['Financial Analysis'],
    careerGoal: 'Brand Management',
    availability: 'Weekdays',
    availabilitySlots: '7 PM – 9 PM',
    learningPreference: 'Hands-on',
    level: 'Advanced',
    rating: 4.8,
    reviews: 31,
    exchanges: 8,
    sessions: 24,
    matchScore: 94,
    scoreLabel: 'Top Match',
    breakdown: { skillCompatibility: 95, careerAlignment: 92, learningPreference: 90, availability: 88 },
    reasons: [
      'Complementary teaching and learning skills',
      'Aligned learning preferences',
      'Compatible availability',
    ],
    bio: 'Brand management aspirant who has run three campus campaigns and two freelanced SEO projects. Teaches by making you ship a real campaign, not by walking through slides.',
    teachingStyle: 'Live teardowns + a 7-day campaign sprint at the end of every module.',
    proof: ['SEO Fundamentals', 'Meta Ads — 12 live campaigns', 'Peer Teaching — 8 sessions'],
    badges: ['Top Match', 'Quick responder', 'Verified practice'],
  },
  {
    id: 'priya',
    name: 'Priya Shah',
    initials: 'PS',
    avatarTone: 'from-teal-500 to-brand-500',
    year: 'B.Com · Year 3',
    campus: 'St. Xavier\u2019s, Mumbai',
    teach: ['Advanced Excel', 'Data Visualisation'],
    learn: ['Financial Modelling'],
    careerGoal: 'Equity Research',
    availability: 'Weekends',
    availabilitySlots: '10 AM – 1 PM',
    learningPreference: 'Project-based',
    level: 'Advanced',
    rating: 4.9,
    reviews: 44,
    exchanges: 11,
    sessions: 37,
    matchScore: 91,
    scoreLabel: 'Strong Match',
    breakdown: { skillCompatibility: 93, careerAlignment: 95, learningPreference: 86, availability: 82 },
    reasons: [
      'Teaches the exact Excel depth your gap list needs',
      'Adjacent career goal — shared equity research vocabulary',
      'Ships a finished dashboard per session',
    ],
    bio: 'Equity research track, obsessed with clean models and dashboards that load in under a second. Has built 40+ dashboards for student competitions.',
    teachingStyle: 'One dashboard, start to finish, in every session.',
    proof: ['Advanced Excel — 37 sessions', 'Tableau Public portfolio', 'Peer Teaching — 11 sessions'],
    badges: ['Verified practice', 'Top rated', 'Streak 40 days'],
  },
  {
    id: 'rahul',
    name: 'Rahul Kulkarni',
    initials: 'RK',
    avatarTone: 'from-amberx-400 to-violet-600',
    year: 'B.Tech · Final year',
    campus: 'COEP, Pune',
    teach: ['Python', 'SQL', 'Data Analytics'],
    learn: ['Business Analysis'],
    careerGoal: 'Data Analytics',
    availability: 'Flexible',
    availabilitySlots: 'Late evenings',
    learningPreference: 'Hands-on',
    level: 'Advanced',
    rating: 4.6,
    reviews: 22,
    exchanges: 5,
    sessions: 18,
    matchScore: 86,
    scoreLabel: 'Good Match',
    breakdown: { skillCompatibility: 84, careerAlignment: 88, learningPreference: 91, availability: 84 },
    reasons: [
      'Strong complement on analytical tooling',
      'Flexible availability across your timetable',
      'Same hands-on learning preference',
    ],
    bio: 'Analytics engineer in the making. Runs the COEP data club and teaches SQL through live query debugging rather than syntax drills.',
    teachingStyle: 'Live query debugging, then a mini analytics brief.',
    proof: ['Python for Analytics', 'SQL — 500+ problems', 'Peer Teaching — 5 sessions'],
    badges: ['Club lead', 'Verified practice'],
  },
  {
    id: 'ananya',
    name: 'Ananya Deshmukh',
    initials: 'AD',
    avatarTone: 'from-rose-400 to-violet-600',
    year: 'MBA · Year 1',
    campus: 'Symbiosis, Pune',
    teach: ['Product Management', 'User Research', 'Case Interviewing'],
    learn: ['Valuation'],
    careerGoal: 'Product Management',
    availability: 'Weekdays',
    availabilitySlots: '6 PM – 8 PM',
    learningPreference: 'Case-based',
    level: 'Intermediate',
    rating: 4.7,
    reviews: 19,
    exchanges: 6,
    sessions: 21,
    matchScore: 83,
    scoreLabel: 'Good Match',
    breakdown: { skillCompatibility: 80, careerAlignment: 85, learningPreference: 84, availability: 86 },
    reasons: [
      'Case-interview reps that transfer to finance rounds',
      'Same evening study window',
      'Wants valuation — your teach list covers the fundamentals',
    ],
    bio: 'Product intern turned peer teacher. Believes every interview answer is a structured argument, and drills that until it is automatic.',
    teachingStyle: 'Mock interview, recorded, then a line-by-line critique.',
    proof: ['Product Management', 'Mock interviews — 21', 'Peer Teaching — 6 sessions'],
    badges: ['Top rated', 'Night owl'],
  },
  {
    id: 'rohan',
    name: 'Rohan Patel',
    initials: 'RP',
    avatarTone: 'from-sky-400 to-teal-500',
    year: 'BBA · Year 2',
    campus: 'NMIMS, Mumbai',
    teach: ['Brand Management', 'Consumer Insights', 'Copywriting'],
    learn: ['Financial Analysis', 'Communication'],
    careerGoal: 'Brand Management',
    availability: 'Weekends',
    availabilitySlots: '3 PM – 6 PM',
    learningPreference: 'Discussion-led',
    level: 'Intermediate',
    rating: 4.5,
    reviews: 14,
    exchanges: 4,
    sessions: 11,
    matchScore: 79,
    scoreLabel: 'Exploratory',
    breakdown: { skillCompatibility: 76, careerAlignment: 82, learningPreference: 74, availability: 80 },
    reasons: [
      'Deep brand-side context for your marketing goal',
      'Discussion-led style balances your hands-on preference',
      'Available on your lighter weekend slots',
    ],
    bio: 'Copywriter and brand enthusiast. Teaches consumer insight through live ad teardowns and a two-page brand audit.',
    teachingStyle: 'Ad teardown, then write the alternative campaign yourself.',
    proof: ['Copywriting portfolio', 'Consumer Insights', 'Peer Teaching — 4 sessions'],
    badges: ['Creative track'],
  },
  {
    id: 'meera',
    name: 'Meera Iyer',
    initials: 'MI',
    avatarTone: 'from-teal-400 to-brand-600',
    year: 'M.Com · Final year',
    campus: 'Christ University, Bengaluru',
    teach: ['Valuation', 'Financial Modelling', 'Statistics'],
    learn: ['Public Speaking'],
    careerGoal: 'Investment Banking',
    availability: 'Weeknights',
    availabilitySlots: '8 PM – 10 PM',
    learningPreference: 'Case-based',
    level: 'Advanced',
    rating: 4.9,
    reviews: 38,
    exchanges: 9,
    sessions: 29,
    matchScore: 92,
    scoreLabel: 'Strong Match',
    breakdown: { skillCompatibility: 96, careerAlignment: 98, learningPreference: 88, availability: 85 },
    reasons: [
      'Teaches two of your three critical gap skills',
      'Identical career goal — same interview preparation arc',
      'Case-based rhythm matches your practice style',
    ],
    bio: 'Two internships deep in sell-side research. Builds DCFs for fun and teaches valuation through a single company, tracked end to end.',
    teachingStyle: 'One company, one model, one valuation — every week.',
    proof: ['Financial Modelling — 29 sessions', 'Valuation', 'Peer Teaching — 9 sessions'],
    badges: ['Top rated', 'Verified practice', 'Mentor pick'],
  },
]

/* ------------------------------------------------------------------ *
 * LEARNING PATH (Slide 6 / 9)
 * ------------------------------------------------------------------ */
export const LEARNING_PATH = {
  career: 'Investment Banking',
  totalWeeks: 12,
  steps: [
    {
      id: 'lp1',
      title: 'Advanced Excel',
      weeks: 2,
      hours: '12 hrs',
      status: 'completed',
      practice: 'Excel Dashboard Challenge',
      outcome: 'Keyboard-first speed, dynamic arrays, clean model structure.',
      milestone: 'Build a 3-sheet dashboard in under 40 minutes.',
    },
    {
      id: 'lp2',
      title: 'Financial Modelling',
      weeks: 4,
      hours: '26 hrs',
      status: 'in-progress',
      practice: 'Financial Modelling',
      outcome: 'Three-statement model built from a raw annual report.',
      milestone: 'Driver-based model with zero hard-coded outputs.',
    },
    {
      id: 'lp3',
      title: 'Valuation',
      weeks: 3,
      hours: '18 hrs',
      status: 'in-progress',
      practice: 'Marketing Case Breakdown',
      outcome: 'DCF, comparable companies and precedent transactions.',
      milestone: 'Defend your WACC assumptions in a 10-minute review.',
    },
    {
      id: 'lp4',
      title: 'Financial Statement Analysis',
      weeks: 2,
      hours: '10 hrs',
      status: 'not-started',
      practice: 'Excel Dashboard Challenge',
      outcome: 'Read a balance sheet for risk, not for completeness.',
      milestone: 'Spot two red flags in an unfamiliar annual report.',
    },
    {
      id: 'lp5',
      title: 'Case Practice',
      weeks: 2,
      hours: '14 hrs',
      status: 'not-started',
      practice: 'Pitch Your Product',
      outcome: 'Structured answers under 3-minute interview constraints.',
      milestone: 'Complete 5 timed cases with peer scoring above 4/5.',
    },
    {
      id: 'lp6',
      title: 'Peer Review',
      weeks: 1,
      hours: '6 hrs',
      status: 'not-started',
      practice: 'Marketing Case Breakdown',
      outcome: 'Receive and act on critique from a matched peer.',
      milestone: 'One reviewed deliverable with a written improvement note.',
    },
    {
      id: 'lp7',
      title: 'Skill Proof',
      weeks: 1,
      hours: '4 hrs',
      status: 'not-started',
      practice: 'Pitch Your Product',
      outcome: 'Portable proof record for the recruiter conversation.',
      milestone: 'Three verified proofs attached to the profile.',
    },
  ],
}

/* ------------------------------------------------------------------ *
 * PRACTICE ACTIVITIES (Slide 8) — 20 minutes each
 * ------------------------------------------------------------------ */
export const ACTIVITIES = [
  {
    id: 'act-fm',
    title: 'Financial Modelling',
    duration: 20,
    level: 'Intermediate',
    difficulty: 'Intermediate',
    icon: 'LineChart',
    tone: 'brand',
    skill: 'Financial Modelling',
    summary: 'Build a driver-based revenue forecast from a raw annual report extract.',
    brief: [
      'Open the provided 3-year revenue extract.',
      'Identify the two true drivers — not the accounting lines.',
      'Build the forecast with zero hard-coded outputs.',
      'Write one sentence defending your growth assumption.',
    ],
    deliverable: 'A driver-based forecast sheet + one-line assumption note.',
    completes: 'Step 2 · Financial Modelling',
  },
  {
    id: 'act-dm',
    title: 'Digital Marketing Audit',
    duration: 20,
    level: 'Beginner',
    difficulty: 'Beginner',
    icon: 'Megaphone',
    tone: 'violet',
    skill: 'Digital Marketing',
    summary: 'Audit a real college brand\u2019s presence across three channels in 20 minutes.',
    brief: [
      'Pick any campus brand with an active page.',
      'Score their funnel: awareness, interest, conversion.',
      'Find the single weakest link.',
      'Write three fixes, ranked by effort-to-impact.',
    ],
    deliverable: 'A one-page audit with three ranked fixes.',
    completes: 'Skill exchange with Aarav Mehta',
  },
  {
    id: 'act-excel',
    title: 'Excel Dashboard Challenge',
    duration: 20,
    level: 'Intermediate',
    difficulty: 'Intermediate',
    icon: 'Table2',
    tone: 'teal',
    skill: 'Advanced Excel',
    summary: 'Turn a messy 5,000-row sales file into one decision-ready dashboard.',
    brief: [
      'Clean the raw export — no manual edits.',
      'Build a pivot with the two questions that matter.',
      'Add a chart a manager can read in 5 seconds.',
      'Keep the file under 2 MB.',
    ],
    deliverable: 'A one-screen dashboard file.',
    completes: 'Step 1 · Advanced Excel',
  },
  {
    id: 'act-case',
    title: 'Marketing Case Breakdown',
    duration: 20,
    level: 'Advanced',
    difficulty: 'Advanced',
    icon: 'Puzzle',
    tone: 'amberx',
    skill: 'Brand Management',
    summary: 'Crack a two-page case and defend your recommendation in 3 minutes.',
    brief: [
      'Read the case once, skim the exhibits twice.',
      'State the core problem in one sentence.',
      'Size the opportunity with stated assumptions.',
      'Recommend one option and name its biggest risk.',
    ],
    deliverable: 'A 3-minute recorded answer.',
    completes: 'Step 3 · Valuation',
  },
  {
    id: 'act-pitch',
    title: 'Pitch Your Product',
    duration: 20,
    level: 'Beginner',
    difficulty: 'Beginner',
    icon: 'Rocket',
    tone: 'rose',
    skill: 'Communication',
    summary: 'Pitch any product you love and have a peer rip the argument apart.',
    brief: [
      'Pick a product you actually use.',
      'Structure: problem, wedge, evidence, ask.',
      'Record a 90-second pitch without notes.',
      'Send it to one matched peer for critique.',
    ],
    deliverable: 'A 90-second pitch + peer critique note.',
    completes: 'Step 5 · Case Practice',
  },
]

/* ------------------------------------------------------------------ *
 * PROGRESS — 7/30/90 day windows (Slide 8)
 * ------------------------------------------------------------------ */
export const PROGRESS = {
  careerReadiness: 72,
  practiceHours: 18.5,
  sessions: 12,
  proofs: 5,
  skillProgress: [
    { name: 'Financial Modelling', value: 60, target: 85, delta: 15 },
    { name: 'Valuation', value: 45, target: 80, delta: 10 },
    { name: 'Advanced Excel', value: 80, target: 90, delta: 25 },
  ],
  series: {
    7: {
      activity: [
        { label: 'Mon', hours: 1.5, activities: 1 },
        { label: 'Tue', hours: 0.5, activities: 1 },
        { label: 'Wed', hours: 2.0, activities: 2 },
        { label: 'Thu', hours: 1.0, activities: 1 },
        { label: 'Fri', hours: 2.5, activities: 2 },
        { label: 'Sat', hours: 3.0, activities: 3 },
        { label: 'Sun', hours: 1.5, activities: 1 },
      ],
      sessions: [
        { label: 'Mon', completed: 1, scheduled: 0 },
        { label: 'Tue', completed: 0, scheduled: 1 },
        { label: 'Wed', completed: 2, scheduled: 0 },
        { label: 'Thu', completed: 1, scheduled: 0 },
        { label: 'Fri', completed: 2, scheduled: 1 },
        { label: 'Sat', completed: 2, scheduled: 0 },
        { label: 'Sun', completed: 1, scheduled: 1 },
      ],
      improvement: [
        { label: 'Modelling', start: 40, now: 60 },
        { label: 'Valuation', start: 30, now: 45 },
        { label: 'Excel', start: 55, now: 80 },
      ],
      readiness: [
        { label: 'Mon', value: 62 },
        { label: 'Tue', value: 63 },
        { label: 'Wed', value: 66 },
        { label: 'Thu', value: 66 },
        { label: 'Fri', value: 69 },
        { label: 'Sat', value: 70 },
        { label: 'Sun', value: 72 },
      ],
    },
    30: {
      activity: [
        { label: 'W1', hours: 6.5, activities: 5 },
        { label: 'W2', hours: 8.0, activities: 7 },
        { label: 'W3', hours: 5.0, activities: 4 },
        { label: 'W4', hours: 9.5, activities: 8 },
      ],
      sessions: [
        { label: 'W1', completed: 2, scheduled: 1 },
        { label: 'W2', completed: 4, scheduled: 0 },
        { label: 'W3', completed: 2, scheduled: 2 },
        { label: 'W4', completed: 4, scheduled: 1 },
      ],
      improvement: [
        { label: 'Modelling', start: 25, now: 60 },
        { label: 'Valuation', start: 18, now: 45 },
        { label: 'Excel', start: 40, now: 80 },
      ],
      readiness: [
        { label: 'W1', value: 54 },
        { label: 'W2', value: 61 },
        { label: 'W3', value: 66 },
        { label: 'W4', value: 72 },
      ],
    },
    90: {
      activity: [
        { label: 'M1', hours: 22, activities: 18 },
        { label: 'M2', hours: 29, activities: 24 },
        { label: 'M3', hours: 36, activities: 31 },
      ],
      sessions: [
        { label: 'M1', completed: 7, scheduled: 2 },
        { label: 'M2', completed: 11, scheduled: 3 },
        { label: 'M3', completed: 14, scheduled: 3 },
      ],
      improvement: [
        { label: 'Modelling', start: 10, now: 60 },
        { label: 'Valuation', start: 8, now: 45 },
        { label: 'Excel', start: 30, now: 80 },
      ],
      readiness: [
        { label: 'M1', value: 41 },
        { label: 'M2', value: 58 },
        { label: 'M3', value: 72 },
      ],
    },
  },
}

/* ------------------------------------------------------------------ *
 * SKILL PROOF (Slide 9)
 * ------------------------------------------------------------------ */
export const PROOFS = [
  {
    id: 'pf1',
    title: 'Financial Analysis',
    status: 'Completed',
    type: 'Skill certificate',
    date: '12 Aug 2026',
    issuer: 'SkillSync peer review',
    detail: '9 peer sessions · 4 practice activities · 1 reviewed deliverable',
    tone: 'teal',
    icon: 'BadgeCheck',
  },
  {
    id: 'pf2',
    title: 'Advanced Excel',
    status: 'Verified Practice',
    type: 'Practice verification',
    date: '28 Aug 2026',
    issuer: 'Peer-verified (Priya Shah)',
    detail: 'Excel Dashboard Challenge completed 3× · avg. score 4.6/5',
    tone: 'brand',
    icon: 'Table2',
  },
  {
    id: 'pf3',
    title: 'Peer Teaching',
    status: '5 Sessions',
    type: 'Contribution record',
    date: 'Ongoing',
    issuer: 'SkillSync session log',
    detail: '5 teaching sessions delivered · 4.7/5 average learner rating',
    tone: 'violet',
    icon: 'Presentation',
  },
  {
    id: 'pf4',
    title: 'Financial Modelling',
    status: 'In Progress',
    type: 'Skill certificate',
    date: 'Target: 22 Oct 2026',
    issuer: '—',
    detail: '60% of the required practice hours logged · 2 reviews pending',
    tone: 'amberx',
    icon: 'LineChart',
    progress: 60,
  },
  {
    id: 'pf5',
    title: 'Communication',
    status: 'Completed',
    type: 'Practice record',
    date: '02 Jul 2026',
    issuer: 'SkillSync peer review',
    detail: '6 pitch activities · 2 peer critiques incorporated',
    tone: 'teal',
    icon: 'Mic',
  },
  {
    id: 'pf6',
    title: 'Digital Marketing',
    status: 'In Progress',
    type: 'Skill certificate',
    date: 'Target: 30 Nov 2026',
    issuer: '—',
    detail: 'Exchange in progress with Aarav Mehta · 2 of 6 modules',
    tone: 'amberx',
    icon: 'Megaphone',
    progress: 30,
  },
]

/* ------------------------------------------------------------------ *
 * COMMUNITY
 * ------------------------------------------------------------------ */
export const TRENDING_SKILLS = [
  { name: 'Financial Modelling', posts: 342, growth: 38, tone: 'brand' },
  { name: 'Product Management', posts: 288, growth: 31, tone: 'violet' },
  { name: 'Data Analytics', posts: 265, growth: 24, tone: 'teal' },
  { name: 'Digital Marketing', posts: 214, growth: 19, tone: 'amberx' },
  { name: 'Valuation', posts: 176, growth: 16, tone: 'sky' },
  { name: 'UI/UX Design', posts: 158, growth: 12, tone: 'rose' },
]

export const POPULAR_GOALS = [
  { name: 'Investment Banking', students: 1840 },
  { name: 'Product Management', students: 1620 },
  { name: 'Data Analytics', students: 1395 },
  { name: 'Brand Management', students: 980 },
  { name: 'Management Consulting', students: 870 },
]

export const CHALLENGES = [
  {
    id: 'ch1',
    title: '7-Day Excel Sprint',
    participants: 1284,
    daysLeft: 3,
    goal: 'One dashboard a day for seven days.',
    tone: 'teal',
    icon: 'Table2',
  },
  {
    id: 'ch2',
    title: 'Model a Listed Company',
    participants: 612,
    daysLeft: 6,
    goal: 'Full three-statement model + valuation note.',
    tone: 'brand',
    icon: 'LineChart',
  },
  {
    id: 'ch3',
    title: 'Teach One Skill This Week',
    participants: 908,
    daysLeft: 4,
    goal: 'Deliver one peer session and log the proof.',
    tone: 'violet',
    icon: 'Presentation',
  },
]

export const WORKSHOPS = [
  { id: 'w1', title: 'DCF from Scratch — Live Build', host: 'Meera Iyer', when: 'Sat, 11 Oct · 7:00 PM', seats: 40, filled: 34, tag: 'Finance' },
  { id: 'w2', title: 'Product Teardown: Quick Commerce', host: 'Ananya Deshmukh', when: 'Sun, 12 Oct · 5:00 PM', seats: 60, filled: 51, tag: 'Product' },
  { id: 'w3', title: 'SEO Audit Live Clinic', host: 'Aarav Mehta', when: 'Wed, 15 Oct · 8:00 PM', seats: 30, filled: 12, tag: 'Marketing' },
]

export const POSTS = [
  {
    id: 'p1',
    author: 'Rohit Sharma',
    initials: 'RS',
    tone: 'from-sky-400 to-brand-600',
    campus: 'IIM Indore',
    time: '2h ago',
    tag: 'Financial Modelling',
    title: 'Best resources to learn financial modelling?',
    body:
      'I can build a basic three-statement model but my outputs are hard-coded and it breaks the moment I change an assumption. What actually helped you get to driver-based modelling?',
    likes: 128,
    comments: 24,
  },
  {
    id: 'p2',
    author: 'Neha Verma',
    initials: 'NV',
    tone: 'from-rose-400 to-violet-600',
    campus: 'NMIMS Mumbai',
    time: '5h ago',
    tag: 'Skill Exchange',
    title: 'I can teach Canva. Looking to learn Excel.',
    body:
      'I design for three campus clubs and can teach Canva properly — brand kits, templates, the lot. I want to get comfortable with Excel formulas and pivot tables. Weekend sessions work best.',
    likes: 96,
    comments: 18,
  },
  {
    id: 'p3',
    author: 'Karthik Rao',
    initials: 'KR',
    tone: 'from-teal-400 to-brand-500',
    campus: 'Christ University',
    time: '8h ago',
    tag: 'Product Management',
    title: 'Anyone preparing for product management interviews?',
    body:
      'Starting a peer group for PM case prep — two mocks a week, recorded and critiqued. I have done 14 mocks so far and can share my structure template with whoever joins.',
    likes: 173,
    comments: 41,
  },
  {
    id: 'p4',
    author: 'Divya Nair',
    initials: 'DN',
    tone: 'from-amberx-400 to-rose-500',
    campus: 'St. Xavier\u2019s Mumbai',
    time: '1d ago',
    tag: 'Valuation',
    title: 'How do you defend a WACC assumption in an interview?',
    body:
      'Every time I get asked why I chose 12% I freeze. Looking for how others frame the beta and risk-free rate choice without over-explaining.',
    likes: 84,
    comments: 29,
  },
  {
    id: 'p5',
    author: 'Aditya Bhosale',
    initials: 'AB',
    tone: 'from-brand-600 to-teal-500',
    campus: 'COEP Pune',
    time: '1d ago',
    tag: 'Data Analytics',
    title: 'SQL practice partner for 20-minute daily drills?',
    body:
      'I have a 90-problem list graded by difficulty. Looking for one accountability partner — 20 minutes a day, we compare approaches after each set.',
    likes: 61,
    comments: 15,
  },
]

/* ------------------------------------------------------------------ *
 * SOCIAL IMPACT (Slide 6)
 * ------------------------------------------------------------------ */
export const IMPACT = {
  heading: 'Turning Skills Into Opportunity',
  lede:
    'SkillSync connects people who can teach with children who need accessible educational support. Student volunteers teach what they already know — children gain academic support, new skills and early career awareness.',
  metrics: [
    { id: 'm1', label: 'Children', value: 500, suffix: '+', icon: 'Users', tone: 'brand' },
    { id: 'm2', label: 'Educators', value: 100, suffix: '+', icon: 'GraduationCap', tone: 'violet' },
    { id: 'm3', label: 'Teaching Hours', value: 2000, suffix: '+', icon: 'Clock', tone: 'teal' },
    { id: 'm4', label: 'Sessions', value: 1000, suffix: '+', icon: 'CalendarCheck', tone: 'amberx' },
  ],
  forChildren: [
    { title: 'Academic support', body: 'Subject help matched to the child\u2019s syllabus and pace, delivered by a volunteer who recently studied the same material.' },
    { title: 'New skills', body: 'Basic computing, spoken English, art and design — skills the school timetable does not reach.' },
    { title: 'Career awareness', body: 'Sessions that show what a career in finance, design or technology actually involves, from someone two steps ahead.' },
  ],
  forVolunteers: [
    { title: 'Verified certificate', body: 'A SkillSync certificate naming the teaching hours delivered and the supervisor who verified them.' },
    { title: 'Contribution record', body: 'A permanent record of sessions, hours and learner feedback on the volunteer profile.' },
    { title: 'Portfolio credential', body: 'Teaching and mentoring proof that sits alongside skill proof in the same profile a recruiter sees.' },
  ],
  governance: [
    { title: 'NGO partners', icon: 'Handshake', body: 'Delivery runs through established NGO partners with existing school relationships — SkillSync does not place volunteers directly.' },
    { title: 'Screening', icon: 'ShieldCheck', body: 'Identity and background verification before any volunteer is assigned to a children\u2019s programme.' },
    { title: 'Safeguarding', icon: 'Lock', body: 'Supervised sessions, a code of conduct and a two-adult rule for every in-person or online class.' },
    { title: 'Data privacy', icon: 'EyeOff', body: 'No child photographs, no personal identifiers, and parental consent recorded before a child joins a session.' },
  ],
}

/* ------------------------------------------------------------------ *
 * BUSINESS MODEL / PRICING (Slide 10) — PROPOSED
 * ------------------------------------------------------------------ */
export const PRICING = {
  plans: [
    {
      id: 'free',
      name: 'FREE',
      price: '₹0',
      cadence: 'forever',
      blurb: 'Everything a student needs to start exchanging skills on campus.',
      features: ['Profile', 'Basic matching', 'Peer discovery', 'Basic skill exchange'],
      cta: 'Start on Free',
      highlighted: false,
    },
    {
      id: 'premium',
      name: 'PREMIUM',
      price: '₹99',
      cadence: 'per month',
      blurb: 'For students who want the gap analysis and the sequencing, not just the discovery.',
      features: [
        'Advanced AI matching',
        'Skill-gap analysis',
        'Personalized recommendations',
        'Enhanced progress tracking',
        'Verified profile',
      ],
      cta: 'Choose Premium',
      highlighted: true,
      badge: 'Recommended',
    },
  ],
  secondary: {
    rate: '10%',
    label: 'commission on paid expert sessions and workshops',
    detail:
      'Peer exchange stays free. When a student books a paid expert session or a workshop, SkillSync takes a 10% platform commission on the transaction.',
    split: [
      { label: 'Expert receives', value: 90 },
      { label: 'SkillSync commission', value: 10 },
    ],
  },
  note: 'Proposed pricing.',
}

/* ------------------------------------------------------------------ *
 * MARKET OPPORTUNITY (Slide 9) — revenue pool assumptions
 * ------------------------------------------------------------------ */
export const MARKET = {
  tam: {
    id: 'tam',
    label: 'TAM',
    sub: 'Total addressable market',
    value: '₹5,144 crore',
    math: '4.33 crore students × ₹1,188/year',
    pill: 5144,
  },
  sam: {
    id: 'sam',
    label: 'SAM',
    sub: 'Serviceable addressable market',
    value: '₹1,029 crore',
    math: '86.6 lakh students · 20% reachable at launch',
    pill: 1029,
  },
  som: {
    id: 'som',
    label: 'SOM — Year 3',
    sub: 'Serviceable obtainable market',
    value: '₹4.158 crore',
    math: '35,000 paying users × ₹1,188/year',
    pill: 4.158,
  },
  reconciliation:
    'The original ₹41.6 crore headline is inconsistent with the stated calculation; 35,000 × ₹1,188 = ₹4.158 crore.',
  note: 'Revenue pool assumptions / illustrative projections.',
  noteDetail:
    'Illustrative revenue pool modelling built on published enrolment data. Pricing is proposed, not observed, so the pool size moves with the price point.',
  funnelOfPool: [
    { label: 'Students (AISHE)', value: '4.33 crore', width: 100, tone: 'brand' },
    { label: 'Reachable at launch (20% of SAM base)', value: '86.6 lakh', width: 62, tone: 'violet' },
    { label: 'Year-3 paying users', value: '35,000', width: 22, tone: 'teal' },
  ],
}

/* ------------------------------------------------------------------ *
 * UNIT ECONOMICS (Slide 11) — planning assumptions
 * ------------------------------------------------------------------ */
export const UNIT_ECONOMICS = {
  annualRevenue: 1188,
  variableCost: 240,
  contribution: 948,
  ltv: 2370,
  cac: 450,
  ltvCac: 5.3,
  contributionPct: 79.8,
  cacPaybackMonths: 4.5,
  note: 'Planning assumptions – to be validated through pilot.',
  detail: [
    { label: 'Annual revenue per paying user', value: '₹1,188', note: '₹99 × 12 months, proposed pricing.' },
    { label: 'Variable cost per user / year', value: '₹240', note: 'Hosting, content delivery, support and payment fees.' },
    { label: 'Annual contribution per user', value: '₹948', note: '₹1,188 − ₹240 = ₹948 (79.8% contribution margin).' },
    { label: 'LTV', value: '₹2,370', note: 'Contribution × 2.5-year illustrative retention.' },
    { label: 'CAC', value: '₹450', note: 'Blended campus acquisition cost at pilot scale.' },
    { label: 'LTV / CAC', value: '5.3×', note: '₹2,370 ÷ ₹450 = 5.27×, rounded to 5.3×.' },
  ],
  ltvCacBands: [
    { label: 'Below 3×', tone: 'rose', body: 'Acquisition is not yet paying back fast enough to scale spend.' },
    { label: '3× – 5×', tone: 'amberx', body: 'Viable, but the channel mix needs tightening before scaling.' },
    { label: '5× +', tone: 'teal', body: 'Planning target. Each rupee of CAC returns over five.' },
  ],
}

/* ------------------------------------------------------------------ *
 * GO-TO-MARKET (Slide 12) — future targets
 * ------------------------------------------------------------------ */
export const GTM = {
  channels: [
    { id: 'ambassadors', name: 'Campus Ambassadors', icon: 'Users', reach: 'Student-led, one per campus', effort: 'High touch', tone: 'brand' },
    { id: 'clubs', name: 'Clubs', icon: 'Flag', reach: 'Finance, marketing, coding and entrepreneurship clubs', effort: 'Medium', tone: 'violet' },
    { id: 'placement', name: 'Placement Cells', icon: 'Building2', reach: 'Credibility with recruiters and students', effort: 'Medium', tone: 'teal' },
    { id: 'workshops', name: 'Workshops', icon: 'Presentation', reach: 'Live skill sessions as the acquisition hook', effort: 'High', tone: 'amberx' },
    { id: 'competitions', name: 'Inter-college Competitions', icon: 'Trophy', reach: 'Multi-campus reach in a single event', effort: 'Medium', tone: 'rose' },
    { id: 'referrals', name: 'Referrals', icon: 'Share2', reach: 'Existing users bring their own batchmates', effort: 'Low', tone: 'sky' },
    { id: 'invites', name: 'Peer Invitations', icon: 'UserPlus', reach: 'Exchange partners invite partners', effort: 'Low', tone: 'brand' },
    { id: 'challenges', name: 'Skill Challenges', icon: 'Swords', reach: 'Weekly cohort loops that drive repeat usage', effort: 'Medium', tone: 'violet' },
  ],
  funnel: [
    { stage: 'Registered', value: 5000, tone: 'brand', note: 'Campus workshops + ambassador sign-ups' },
    { stage: 'Active', value: 1500, tone: 'violet', note: 'Completed one exchange or activity in 30 days' },
    { stage: 'Paying', value: 500, tone: 'teal', note: 'Converted to Premium at ₹99/month' },
  ],
  targets: [
    { label: 'Campuses reached', value: 100, suffix: '', icon: 'Building2' },
    { label: 'Partnerships', value: 25, suffix: '', icon: 'Handshake' },
  ],
  note: 'Future targets, not current traction.',
}

/* ------------------------------------------------------------------ *
 * FINANCIAL PROJECTIONS (Slide 14) — illustrative
 * ------------------------------------------------------------------ */
export const FINANCIALS = {
  years: [
    {
      id: 'y1',
      year: 'Year 1',
      payingUsers: 5000,
      revenue: 59,
      expenses: 75,
      netIncome: -15.6,
      netMargin: -26.3,
      revenueLabel: '₹59 lakh',
      expenseLabel: '₹75 lakh',
      netLabel: '-₹15.6 lakh',
      marginLabel: '-26.3%',
    },
    {
      id: 'y2',
      year: 'Year 2',
      payingUsers: 15000,
      revenue: 178,
      expenses: 127,
      netIncome: 51.2,
      netMargin: 28.7,
      revenueLabel: '₹178 lakh',
      expenseLabel: '₹127 lakh',
      netLabel: '₹51.2 lakh',
      marginLabel: '28.7%',
    },
    {
      id: 'y3',
      year: 'Year 3',
      payingUsers: 35000,
      revenue: 416,
      expenses: 203,
      netIncome: 212.8,
      netMargin: 51.2,
      revenueLabel: '₹416 lakh',
      expenseLabel: '₹203 lakh',
      netLabel: '₹212.8 lakh',
      marginLabel: '51.2%',
    },
  ],
  note: 'Illustrative projections, not actual results.',
  noteDetail:
    'Modelled on the proposed ₹1,188 annual revenue per paying user and a campus-led acquisition mix. Costs grow slower than revenue from Year 2 as fixed product spend is amortised across a larger user base.',
}

/* ------------------------------------------------------------------ *
 * FUNDING (Slide 15) — founder-proposed
 * ------------------------------------------------------------------ */
export const FUNDING = {
  sought: '₹25 lakh',
  equity: '10%',
  postMoney: '₹2.5 crore',
  preMoney: '₹2.25 crore',
  useOfFunds: [
    { id: 'product', label: 'Product', value: 30, icon: 'Boxes', tone: 'brand' },
    { id: 'acquisition', label: 'Acquisition', value: 35, icon: 'Megaphone', tone: 'violet' },
    { id: 'pilot', label: 'Pilot', value: 15, icon: 'FlaskConical', tone: 'teal' },
    { id: 'pmf', label: 'PMF validation', value: 12, icon: 'Target', tone: 'amberx' },
    { id: 'scale', label: 'Scale', value: 8, icon: 'TrendingUp', tone: 'sky' },
  ],
  productPlusAcquisition: 65,
  note: 'Founder-proposed fundraising assumption.',
  detail: [
    { label: 'Funding sought', value: '₹25 lakh' },
    { label: 'Equity offered', value: '10%' },
    { label: 'Implied post-money valuation', value: '₹2.5 crore' },
    { label: 'Implied pre-money valuation', value: '₹2.25 crore' },
  ],
}

/* ------------------------------------------------------------------ *
 * TEAM
 * ------------------------------------------------------------------ */
export const TEAM = [
  {
    id: 'sakshi',
    name: 'Sakshi Jadhav',
    initials: 'SJ',
    role: 'Founder',
    tone: 'from-brand-600 to-violet-600',
    focus: ['Vision', 'Product Direction', 'Marketing Strategy', 'Business Development'],
    bio: 'Set the SkillSync thesis after watching capable classmates lose opportunities to invisible skill gaps. Owns the product direction and the campus conversation.',
  },
  {
    id: 'ishaan',
    name: 'Ishaan Shukla',
    initials: 'IS',
    role: 'Co-Founder',
    tone: 'from-teal-500 to-brand-600',
    focus: ['Finance', 'Market Research', 'Business Planning'],
    bio: 'Built the market sizing, unit economics and three-year projection model, and pressure-tests every assumption before it reaches the deck.',
  },
]

export const ABOUT = {
  mission:
    'SkillSync exists to make skill development legible. Most students are not short of effort — they are short of information about which skill matters, who can teach it, and whether they are actually improving.',
  principles: [
    { title: 'Honest about data', body: 'Every number in this prototype is labelled source, illustrative, target or proposed. No traction is implied where none exists.', icon: 'ShieldCheck' },
    { title: 'Peers before purchases', body: 'The cheapest, fastest learning resource is usually sitting in the next classroom. Matching it is the product.', icon: 'Users' },
    { title: 'Proof over participation', body: 'Progress should be evidenced by verified practice and reviewed deliverables, not by attendance.', icon: 'BadgeCheck' },
    { title: 'Built for one goal', body: 'One career goal at a time, sequenced end to end — not an endless catalogue of everything.', icon: 'Target' },
  ],
  roadmap: [
    { phase: 'Now', title: 'Frontend prototype', body: 'Working product surface: matching, gap analysis, learning path, progress and skill proof.', status: 'done' },
    { phase: 'Pilot', title: '5 campuses, 1 city', body: 'Validate matching quality and 20-minute activity completion with a single-city cohort.', status: 'next' },
    { phase: 'Build', title: 'Matching engine v1', body: 'Move from rule-based scoring to a learned compatibility model on pilot interaction data.', status: 'planned' },
    { phase: 'Scale', title: '100 campuses + NGO programme', body: 'Ambassador-led expansion alongside the social impact teaching programme.', status: 'planned' },
  ],
  disclaimer:
    'SkillSync is presented here as a frontend-only demonstration prototype. There is no backend, no authentication, no database and no live AI service. All matching, analysis and progress numbers are simulated locally in the browser.',
}

/* ------------------------------------------------------------------ *
 * DEMO MODE
 * ------------------------------------------------------------------ */
export const DEMO_MODE = {
  title: 'DEMO MODE',
  subtitle: 'Frontend-only interactive prototype',
  detail:
    'Every interaction below runs locally in your browser. State is saved to localStorage so a refresh does not reset your progress.',
}
