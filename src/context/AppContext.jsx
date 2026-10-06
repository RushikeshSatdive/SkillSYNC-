import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { ACTIVITIES, DEMO_STUDENT, LEARNING_PATH, PROGRESS } from '../data/mockData'

const STORAGE_KEY = 'skillsync.demo.v1'
const THEME_KEY = 'skillsync.theme.v1'

/* ------------------------------------------------------------------ *
 * Initial demo state — mirrors the deck numbers on first load.
 * ------------------------------------------------------------------ */
export const getInitialState = () => ({
  version: 1,
  student: {
    name: DEMO_STUDENT.firstName,
    careerGoal: DEMO_STUDENT.careerGoal,
    teach: [...DEMO_STUDENT.teach],
    learn: [...DEMO_STUDENT.learn],
    progress: DEMO_STUDENT.progress,
    streakDays: DEMO_STUDENT.streakDays,
    skillsCompleted: DEMO_STUDENT.skillsCompleted,
    hoursLearned: DEMO_STUDENT.hoursLearned,
    sessions: DEMO_STUDENT.sessions,
    proofs: DEMO_STUDENT.proofs,
  },
  pathStatus: LEARNING_PATH.steps.reduce((acc, s) => {
    acc[s.id] = s.status
    return acc
  }, {}),
  pathProgress: LEARNING_PATH.steps.reduce((acc, s) => {
    acc[s.id] = s.status === 'completed' ? 100 : s.status === 'in-progress' ? 55 : 0
    return acc
  }, {}),
  completedActivities: [], // [{ id, title, completedAt, minutes }]
  activityDrafts: {}, // id -> { secondsLeft, state }
  savedPeers: ['aarav'],
  connections: [],
  sessionRequests: [],
  skillProgress: PROGRESS.skillProgress.map((s) => ({ ...s })),
  community: {
    likes: [],
    saved: [],
    comments: {
      p1: [
        { id: 'c1', author: 'Meera Iyer', initials: 'MI', text: 'Hard-coding is the real signal. Rebuild the same model with every input on one sheet — it forces structure.', at: '1h ago' },
        { id: 'c2', author: 'Priya Shah', initials: 'PS', text: 'Try the Excel Dashboard Challenge here; doing it three times removed all my hard-codes.', at: '40m ago' },
      ],
      p3: [{ id: 'c3', author: 'Ananya Deshmukh', initials: 'AD', text: 'In for the mocks. I can bring the scoring rubric we used in my cohort.', at: '3h ago' }],
    },
  },
  readiness: PROGRESS.careerReadiness,
  toastsSeen: [],
  lastAction: null,
})

const mergeState = (base, incoming) => {
  if (!incoming || typeof incoming !== 'object') return base
  return {
    ...base,
    ...incoming,
    student: { ...base.student, ...(incoming.student || {}) },
    community: {
      ...base.community,
      ...(incoming.community || {}),
      comments: { ...base.community.comments, ...((incoming.community || {}).comments || {}) },
    },
    pathStatus: { ...base.pathStatus, ...(incoming.pathStatus || {}) },
    pathProgress: { ...base.pathProgress, ...(incoming.pathProgress || {}) },
    activityDrafts: { ...base.activityDrafts, ...(incoming.activityDrafts || {}) },
  }
}

const loadState = () => {
  const base = getInitialState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return base
    return mergeState(base, JSON.parse(raw))
  } catch {
    return base
  }
}

/* ------------------------------------------------------------------ *
 * Reducer
 * ------------------------------------------------------------------ */
const reducer = (state, action) => {
  switch (action.type) {
    case 'RESET':
      return getInitialState()

    case 'TOGGLE_SAVE_PEER': {
      const has = state.savedPeers.includes(action.id)
      return {
        ...state,
        savedPeers: has ? state.savedPeers.filter((p) => p !== action.id) : [...state.savedPeers, action.id],
        lastAction: { kind: has ? 'unsave-peer' : 'save-peer', id: action.id, at: Date.now() },
      }
    }

    case 'CONNECT_PEER': {
      if (state.connections.includes(action.id)) return state
      return {
        ...state,
        connections: [...state.connections, action.id],
        lastAction: { kind: 'connect', id: action.id, at: Date.now() },
      }
    }

    case 'REQUEST_SESSION': {
      const exists = state.sessionRequests.some((r) => r.peerId === action.peerId && r.activity === action.activity)
      if (exists) return state
      return {
        ...state,
        sessionRequests: [
          ...state.sessionRequests,
          { id: `sr-${Date.now()}`, peerId: action.peerId, activity: action.activity, when: action.when, at: Date.now() },
        ],
        lastAction: { kind: 'session-request', id: action.peerId, at: Date.now() },
      }
    }

    case 'SET_PATH_STEP': {
      const nextStatus = action.status
      const pathStatus = { ...state.pathStatus, [action.id]: nextStatus }
      const pathProgress = {
        ...state.pathProgress,
        [action.id]: nextStatus === 'completed' ? 100 : nextStatus === 'in-progress' ? (action.progress ?? (state.pathProgress[action.id] || 50)) : 0,
      }
      const completedCount = Object.values(pathStatus).filter((s) => s === 'completed').length
      const readiness = Math.min(100, Math.round(52 + completedCount * 4.5 + state.completedActivities.length * 1.1))
      return {
        ...state,
        pathStatus,
        pathProgress,
        readiness,
        student: {
          ...state.student,
          progress: Math.max(state.student.progress, Math.round((completedCount / LEARNING_PATH.steps.length) * 40 + readiness * 0.6)),
          skillsCompleted: Math.max(state.student.skillsCompleted, 4 + completedCount + Math.floor(state.completedActivities.length / 2)),
        },
        lastAction: { kind: 'path-step', id: action.id, status: nextStatus, at: Date.now() },
      }
    }

    case 'COMPLETE_ACTIVITY': {
      const activity = ACTIVITIES.find((a) => a.id === action.id)
      if (!activity) return state
      const already = state.completedActivities.filter((a) => a.id === action.id).length
      const completedActivities = [
        ...state.completedActivities,
        { id: action.id, title: activity.title, minutes: activity.duration, at: Date.now() },
      ]
      const hours = +(state.student.hoursLearned + activity.duration / 60).toFixed(1)
      return {
        ...state,
        completedActivities,
        activityDrafts: { ...state.activityDrafts, [action.id]: { secondsLeft: activity.duration * 60, state: 'idle' } },
        student: {
          ...state.student,
          hoursLearned: hours,
          sessions: state.student.sessions + (already === 0 ? 1 : 0),
          skillsCompleted: state.student.skillsCompleted + (already === 0 ? 1 : 0),
          streakDays: state.student.streakDays + (already === 0 ? 1 : 0),
        },
        skillProgress: state.skillProgress.map((s) =>
          s.name === activity.skill ? { ...s, value: Math.min(s.target, s.value + 5), delta: s.delta + 5 } : s,
        ),
        readiness: Math.min(100, state.readiness + (already === 0 ? 2 : 1)),
        lastAction: { kind: 'activity-complete', id: action.id, at: Date.now() },
      }
    }

    case 'SET_ACTIVITY_DRAFT':
      return {
        ...state,
        activityDrafts: { ...state.activityDrafts, [action.id]: { ...state.activityDrafts[action.id], ...action.patch } },
      }

    case 'TOGGLE_LIKE': {
      const has = state.community.likes.includes(action.id)
      return {
        ...state,
        community: {
          ...state.community,
          likes: has ? state.community.likes.filter((i) => i !== action.id) : [...state.community.likes, action.id],
        },
      }
    }

    case 'TOGGLE_SAVE_POST': {
      const has = state.community.saved.includes(action.id)
      return {
        ...state,
        community: {
          ...state.community,
          saved: has ? state.community.saved.filter((i) => i !== action.id) : [...state.community.saved, action.id],
        },
      }
    }

    case 'ADD_COMMENT': {
      const list = state.community.comments[action.postId] || []
      return {
        ...state,
        community: {
          ...state.community,
          comments: {
            ...state.community.comments,
            [action.postId]: [...list, { id: `c-${Date.now()}`, author: state.student.name, initials: 'SJ', text: action.text, at: 'just now', isMine: true }],
          },
        },
      }
    }

    case 'SET_CAREER_GOAL':
      return { ...state, student: { ...state.student, careerGoal: action.goal } }

    case 'ADD_SKILL': {
      const key = action.kind === 'teach' ? 'teach' : 'learn'
      const list = state.student[key]
      if (list.includes(action.skill)) return state
      if (action.kind === 'teach' && state.student.learn.includes(action.skill)) return state
      return { ...state, student: { ...state.student, [key]: [...list, action.skill] } }
    }

    case 'REMOVE_SKILL': {
      const key = action.kind === 'teach' ? 'teach' : 'learn'
      return { ...state, student: { ...state.student, [key]: state.student[key].filter((s) => s !== action.skill) } }
    }

    default:
      return state
  }
}

/* ------------------------------------------------------------------ *
 * Context
 * ------------------------------------------------------------------ */
const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || 'light'
    } catch {
      return 'light'
    }
  })
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  // Persist demo state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable — demo still works in-memory */
    }
  }, [state])

  // Persist + apply theme
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  const dismissToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
    if (timers.current[id]) {
      clearTimeout(timers.current[id])
      delete timers.current[id]
    }
  }, [])

  const toast = useCallback(
    ({ title, body, tone = 'brand', icon = 'CheckCircle2', duration = 3800 }) => {
      const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      setToasts((t) => [...t.slice(-3), { id, title, body, tone, icon }])
      timers.current[id] = setTimeout(() => dismissToast(id), duration)
      return id
    },
    [dismissToast],
  )

  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), [])

  const resetDemo = useCallback(() => {
    dispatch({ type: 'RESET' })
    setToasts([])
    toast({
      title: 'Demo data restored',
      body: 'Sakshi\u2019s profile, progress and saved matches are back to the starting state.',
      tone: 'teal',
      icon: 'RotateCcw',
    })
  }, [toast])

  const value = useMemo(
    () => ({ state, dispatch, theme, setTheme, toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), toast, toasts, dismissToast, resetDemo }),
    [state, theme, toast, toasts, dismissToast, resetDemo],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}

/* ------------------------------------------------------------------ *
 * Derived helpers shared by pages
 * ------------------------------------------------------------------ */
export const useDerived = () => {
  const { state } = useApp()
  return useMemo(() => {
    const steps = LEARNING_PATH.steps
    const completedSteps = steps.filter((s) => state.pathStatus[s.id] === 'completed').length
    const pathPercent = Math.round(
      steps.reduce((acc, s) => acc + (state.pathProgress[s.id] || 0), 0) / steps.length,
    )
    const totalMinutes = state.completedActivities.reduce((acc, a) => acc + a.minutes, 0)
    const readiness = state.readiness ?? PROGRESS.careerReadiness
    return {
      steps,
      completedSteps,
      pathPercent,
      totalMinutes,
      readiness,
      completedActivityIds: state.completedActivities.map((a) => a.id),
      uniqueActivitiesDone: new Set(state.completedActivities.map((a) => a.id)).size,
    }
  }, [state])
}
