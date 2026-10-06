import Icon from '../components/ui/Icon'
import { Breadcrumbs, Button, Card, EmptyState } from '../components/ui/Kit'
import { ALL_PAGES } from '../data/nav'

export default function NotFound() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'SkillSync', to: '/dashboard' }, { label: 'Page not found' }]} />

      <EmptyState
        icon="Compass"
        title="That page does not exist in this prototype"
        body="The route you followed is not part of the SkillSync demo. Everything reachable is listed below."
        action={<Button variant="primary" icon="LayoutDashboard" to="/dashboard">Back to the dashboard</Button>}
      />

      <Card>
        <h2 className="font-display text-base font-bold text-ink-900 dark:text-white">All pages in this demo</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_PAGES.map((p) => (
            <li key={p.to}>
              <Button variant="ghost" to={p.to} icon={p.icon} className="w-full justify-start">
                {p.label}
              </Button>
            </li>
          ))}
        </ul>
        <p className="mt-5 flex items-center gap-2 text-xs text-ink-400">
          <Icon name="Info" size={13} /> There is no backend in this prototype, so an unknown route simply returns this view.
        </p>
      </Card>
    </div>
  )
}
