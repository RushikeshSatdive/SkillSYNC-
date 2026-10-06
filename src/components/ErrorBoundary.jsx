import { Component } from 'react'
import Icon from './ui/Icon'
import { Button } from './ui/Kit'

/**
 * Keeps the demo usable if any page throws — no white screen, no dead navigation.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Local demo: log to the console so a presenter can see what happened.
    // eslint-disable-next-line no-console
    console.error('SkillSync demo error:', error, info?.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-rose-500/10 text-rose-500">
          <Icon name="AlertTriangle" size={26} />
        </span>
        <h1 className="mt-6 font-display text-2xl font-extrabold text-ink-900 dark:text-white">Something broke in the demo</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-500 dark:text-ink-300">
          SkillSync is a frontend-only prototype, so this is a rendering error rather than a server or network problem. Resetting the demo
          data and reloading clears state stored in your browser.
        </p>
        <pre className="mt-5 max-h-40 w-full overflow-auto rounded-xl bg-ink-900 p-4 text-left font-mono text-[11px] leading-relaxed text-rose-300">
          {String(this.state.error?.message || this.state.error)}
        </pre>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            variant="primary"
            icon="RotateCcw"
            onClick={() => {
              try {
                localStorage.removeItem('skillsync.demo.v1')
              } catch {
                /* ignore */
              }
              window.location.href = '/'
            }}
          >
            Reset demo & reload
          </Button>
          <Button variant="ghost" icon="RefreshCw" onClick={() => this.setState({ error: null })}>
            Try again
          </Button>
        </div>
      </div>
    )
  }
}
