# SkillSync

**Find the Right Skill. Find the Right Person. Build the Right Career.**

An AI-powered skill development network for students — presented as a **frontend-only, interactive product
prototype**. No backend, no authentication, no database, no API keys, no external services.

> SkillSync helps students identify skill gaps, connect with the right peers, exchange skills and progress
> toward their career goals.

---

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (default `http://localhost:5173`).

> [!IMPORTANT]
> **Previewing inside a sandboxed workspace?** Snapshots exclude `node_modules/`, `dist/` and
> `.cache/`, and background processes are stopped between sessions — so a dev server will not
> survive, and `npm install` must be re-run each session.
>
> Two options that do survive:
>
> 1. **Open `SkillSync-demo.html`** — a fully self-contained build (inline CSS + JS, hash routing,
>   no network). It needs no install and no server.
> 2. **Run the zero-dependency server**, which serves that same file:
>
> ```bash
> node scripts/serve-single.mjs 5173     # → http://0.0.0.0:5173
> ```
>
> To regenerate the single file after changing source:
> `npm run build:single && npm run check:single`

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build |
| `npm run check` | Run all four verification suites below |
| `npm run check:data` | Verify every deck figure is present and correctly labelled |
| `npm run check:render` | Server-render all 27 routes and fail on any render error |
| `npm run check:content` | Assert no page renders `undefined`, `NaN`, `[object Object]` or thin content |
| `npm run check:interactions` | Drive the real app in jsdom and assert 42 interactions |

There is **no login or signup**. Landing on the site and pressing **Explore SkillSync** opens the demo
dashboard directly.

---

## Tech stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3** (custom design tokens, dark mode via `class`)
- **React Router 6** (client-side routing, 21 routes)
- **Recharts** for all charts
- **Lucide React** for icons (via a name-keyed registry, `src/components/ui/Icon.jsx`)
- All data is local mock data; demo state persists to **`localStorage`**

---

## Pages

**Public site** (top navigation + footer)

| Route | Page |
| --- | --- |
| `/` | Landing page — hero, problem, why SkillSync, how it works, product tour, impact & business teasers |
| `/about` | About SkillSync — team, principles, roadmap, full data ledger |

**Product** (sidebar dashboard shell)

| Route | Page |
| --- | --- |
| `/dashboard` | Student dashboard |
| `/profile` | Skill profile (teach / learn / career goal / availability) |
| `/gap-analysis` | AI skill-gap analysis + simulated path generation |
| `/matching` | Peer matching with filters, sorting and match-score breakdown |
| `/peer/:id` | Peer profile (6 seeded peers) |
| `/learning-path` | 7-step learning path with completion tracking |
| `/practice` | 20-minute practice activities with a working countdown timer |
| `/exchange` | Skill exchange — I teach / I want to learn |
| `/progress` | Progress dashboard (7 / 30 / 90-day windows) |
| `/proof` | Skill proof — certificates and verified practice |
| `/community` | Community — discussions, challenges, workshops |
| `/impact` | Social impact |
| `/pricing` | Business model |
| `/market` | Market opportunity (TAM / SAM / SOM) |
| `/unit-economics` | Unit economics |
| `/go-to-market` | Go-to-market |
| `/financials` | Three-year financial projections |
| `/funding` | Funding ask, valuation and use of funds |

Unknown routes render an in-product 404 that lists every available page.

---

## Interactive features

- Sidebar navigation with active states, plus a mobile drawer and a 5-tab bottom bar
- Global search (`⌘K` / `Ctrl+K`) across pages, peers, skills and activities
- Skill, career-goal, availability, level and learning-preference filters, plus match-score sorting
- Match-score rings with factor breakdowns on matching and peer-profile pages
- Working 20-minute practice timer (Start / Pause / Reset / Complete) that writes progress back
- Mark learning-path steps complete; readiness, progress and completion counters recompute live
- Save a match, simulate a connection, schedule an activity, set up a skill exchange
- Community likes, comments and saves backed by local state
- Dark / light mode toggle
- Toast notifications, modal dialogs, tooltips, animated counters, progress bars, skeletons,
  hover states, empty states, breadcrumbs and error-safe fallbacks
- **Demo Mode** banner with **Reset Demo Data** to restore the starting state

Demo state is stored under the `skillsync.demo.v1` key; theme under `skillsync.theme.v1`.

---

## Data integrity

Every number on the site is tagged as one of five categories, and the About page publishes the
complete ledger:

| Tag | Meaning | Examples |
| --- | --- | --- |
| **Source data** | Published third-party statistics | AISHE 2021–22: 4.33 crore students, 28.4% GER · India Skills Report 2025: 54.81% employability |
| **Illustrative** | Product examples and modelled projections | 94% match score, skill levels, progress %, three-year financials, market pool |
| **Future target** | Goals, not traction | 100 campuses, 25 partnerships, 5,000 → 1,500 → 500 funnel, social-impact targets |
| **Proposed** | Founder proposals | ₹99/month pricing, 10% commission, ₹25 lakh raise at 10% equity |
| **Planning assumption** | To be validated through pilot | ₹1,188 ARPU, ₹240 variable cost, ₹2,370 LTV, ₹450 CAC, 5.3× LTV/CAC |

**SOM correction:** the original ₹41.6 crore headline is inconsistent with the stated calculation.
35,000 × ₹1,188 = **₹4.158 crore**, and that is the value used everywhere in this prototype. The
discrepancy is called out explicitly on the market page.

`npm run check:data` asserts that all 62 required figures are present and correctly labelled, and that
the ₹41.6 crore figure never appears as a SOM value.

---

## Project structure

```
skillsync/
├── index.html
├── tailwind.config.js          # design tokens, keyframes, animations
├── scripts/
│   ├── data-check.mjs          # 62 data-integrity assertions
│   ├── ssr-check.jsx           # renders all routes on the server
│   ├── content-check.jsx       # guards against undefined/NaN in rendered output
│   └── interaction-check.jsx   # 42 jsdom interaction assertions
└── src/
    ├── main.jsx
    ├── App.jsx                 # routes + error boundary + toasts
    ├── index.css               # design system (@layer base/components/utilities)
    ├── context/AppContext.jsx  # reducer, localStorage persistence, theme, toasts
    ├── data/
    │   ├── mockData.js         # single source of truth, provenance-tagged
    │   └── nav.js              # navigation, mobile tabs
    ├── components/
    │   ├── ui/                 # Icon, Kit (primitives), Charts (Recharts wrappers)
    │   ├── layout/             # SiteLayout, AppLayout, Footer, Brand, SearchOverlay
    │   ├── landing/            # HeroNetwork (animated SVG flow)
    │   └── ErrorBoundary.jsx
    └── pages/                  # 21 page components
```

---

## Honest limitations

- No live AI. Matching and skill-gap analysis are deterministic functions of seeded data. The analysis
  page shows a **simulated in-browser trace**, and says so.
- No messaging, payments, emails or file downloads. Every one of those interactions is simulated and
  labelled as such in its toast or modal.
- No traction. There are no users, no revenue and no partnerships. Every projection is illustrative.
- The `SkillSync_Numeric_Data.xlsx` deck figures were transcribed into `src/data/mockData.js` and are
  asserted by `npm run check:data`; the spreadsheet itself is not bundled.

---

## Accessibility

Semantic landmarks and headings, skip-to-content links, `aria-*` on tabs / switches / progress bars /
dialogs, focus trapping and `Esc` handling in modals, keyboard navigation in the search overlay and
mobile drawer, visible `focus-visible` rings, and `prefers-reduced-motion` support that disables
animations.

---

© 2026 SkillSync — Demo Prototype | Frontend Only
