import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import {
  Avatar, Breadcrumbs, Button, Card, EmptyState, Modal, Note, ProgressBar, ProvenanceTag, SectionHeading,
  Tabs, Tag, Tooltip, cx,
} from '../components/ui/Kit'
import { useApp } from '../context/AppContext'
import { CHALLENGES, POPULAR_GOALS, POSTS, TRENDING_SKILLS, WORKSHOPS } from '../data/mockData'

const toneBar = {
  brand: 'from-brand-500 to-violet-500',
  violet: 'from-violet-500 to-brand-500',
  teal: 'from-teal-400 to-teal-600',
  amberx: 'from-amberx-400 to-amberx-500',
  sky: 'from-sky-400 to-brand-500',
  rose: 'from-rose-400 to-rose-500',
}

function PostCard({ post }) {
  const { state, dispatch, toast } = useApp()
  const [openComments, setOpenComments] = useState(false)
  const [draft, setDraft] = useState('')

  const liked = state.community.likes.includes(post.id)
  const saved = state.community.saved.includes(post.id)
  const comments = state.community.comments[post.id] || []
  const likes = post.likes + (liked ? 1 : 0)

  const submitComment = (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    dispatch({ type: 'ADD_COMMENT', postId: post.id, text })
    setDraft('')
    setOpenComments(true)
    toast({ title: 'Comment posted', body: 'Stored locally in your browser — the community feed is simulated.', tone: 'brand', icon: 'MessageCircle' })
  }

  return (
    <li className="card card-hover">
      <div className="flex items-start gap-3">
        <Avatar initials={post.initials} tone={post.tone} size={42} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-sm font-bold text-ink-900 dark:text-white">{post.author}</p>
            <span className="text-[11px] text-ink-400">· {post.campus} · {post.time}</span>
          </div>
          <p className="mt-2 font-display text-base font-bold leading-snug text-ink-900 dark:text-white">{post.title}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-500 dark:text-ink-300">{post.body}</p>
          <div className="mt-3">
            <Tag tone="brand" icon="Sparkles">{post.tag}</Tag>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-ink-100 pt-3 dark:border-white/10">
            <Button
              size="sm"
              variant={liked ? 'soft' : 'plain'}
              icon="ThumbsUp"
              aria-pressed={liked}
              onClick={() => dispatch({ type: 'TOGGLE_LIKE', id: post.id })}
            >
              <span className="tnum">{likes}</span>
            </Button>
            <Button size="sm" variant={openComments ? 'soft' : 'plain'} icon="MessageCircle" onClick={() => setOpenComments((o) => !o)}>
              <span className="tnum">{comments.length + post.comments}</span>
            </Button>
            <Button
              size="sm"
              variant={saved ? 'soft' : 'plain'}
              icon={saved ? 'BookmarkCheck' : 'Bookmark'}
              aria-pressed={saved}
              onClick={() => {
                dispatch({ type: 'TOGGLE_SAVE_POST', id: post.id })
                toast({
                  title: saved ? 'Post removed from saved' : 'Post saved',
                  body: saved ? 'It is no longer in your saved list.' : 'Find it again under the Saved tab.',
                  tone: saved ? 'amber' : 'brand',
                  icon: saved ? 'Bookmark' : 'BookmarkCheck',
                })
              }}
            >
              {saved ? 'Saved' : 'Save'}
            </Button>
            <Tooltip label="Copy a link to this discussion (demo)">
              <Button
                size="sm"
                variant="plain"
                icon="Share2"
                aria-label="Share post"
                onClick={() => {
                  navigator.clipboard?.writeText(`${window.location.origin}/community#${post.id}`).catch(() => {})
                  toast({ title: 'Link copied', body: 'Community links stay inside this demo.', tone: 'violet', icon: 'Link2' })
                }}
              />
            </Tooltip>
          </div>

          {openComments ? (
            <div className="mt-4 animate-fade-in space-y-3 rounded-2xl bg-ink-50 p-4 dark:bg-white/5">
              {comments.length === 0 ? (
                <p className="text-[12.5px] text-ink-400">No comments yet — be the first to answer.</p>
              ) : (
                <ul className="space-y-3">
                  {comments.map((c) => (
                    <li key={c.id} className="flex items-start gap-3">
                      <Avatar initials={c.initials} size={32} tone={c.isMine ? 'from-teal-500 to-brand-600' : 'from-ink-400 to-ink-600'} />
                      <div className="min-w-0 flex-1 rounded-xl bg-white p-3 dark:bg-ink-900">
                        <p className="flex items-center gap-2 text-[11px]">
                          <span className="font-bold text-ink-800 dark:text-white">{c.author}</span>
                          <span className="text-ink-400">{c.at}</span>
                          {c.isMine ? <span className="label-badge bg-teal-50 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300">You</span> : null}
                        </p>
                        <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-600 dark:text-ink-200">{c.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <form onSubmit={submitComment} className="flex items-end gap-2">
                <label htmlFor={`c-${post.id}`} className="sr-only">Write a comment</label>
                <textarea
                  id={`c-${post.id}`}
                  rows={1}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Write a helpful reply…"
                  className="input resize-none"
                />
                <Button type="submit" variant="primary" size="sm" icon="Send" disabled={!draft.trim()}>Post</Button>
              </form>
            </div>
          ) : null}
        </div>
      </div>
    </li>
  )
}

export default function Community() {
  const { state, toast } = useApp()
  const [tab, setTab] = useState('all')
  const [q, setQ] = useState('')
  const [workshop, setWorkshop] = useState(null)

  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    return POSTS.filter((p) => {
      if (tab === 'saved' && !state.community.saved.includes(p.id)) return false
      if (tab === 'mine') return (state.community.comments[p.id] || []).some((c) => c.isMine) && (!term || p.title.toLowerCase().includes(term))
      if (term && !(`${p.title} ${p.body} ${p.tag} ${p.author}`.toLowerCase().includes(term))) return false
      return true
    })
  }, [tab, q, state.community.saved, state.community.comments])

  const maxPosts = Math.max(...TRENDING_SKILLS.map((t) => t.posts))

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'SkillSync', to: '/dashboard' }, { label: 'Community' }]} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Community"
          title={<>The campus network, <span className="grad-text">seeded</span> with students</>}
          lede="Discussions, challenges and workshops. Likes, comments and saves are stored locally so the feed behaves like a real product."
          className="!max-w-2xl"
        />
        <ProvenanceTag kind="illustrative" />
      </div>

      {/* trending */}
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Tag tone="brand" icon="TrendingUp">Trending skills</Tag>
              <span className="text-[11px] font-semibold text-ink-400">Last 30 days · demo activity</span>
            </div>
            <Button size="sm" variant="ghost" icon="Sparkles" to="/matching">Match on a skill</Button>
          </div>
          <ul className="mt-5 space-y-4">
            {TRENDING_SKILLS.map((s) => (
              <li key={s.name}>
                <div className="flex items-baseline justify-between gap-3">
                  <Link to={`/matching?skill=${encodeURIComponent(s.name)}`} className="text-[13px] font-bold text-ink-800 transition hover:text-brand-600 dark:text-white dark:hover:text-brand-300">
                    {s.name}
                  </Link>
                  <span className="tnum text-[11px] font-semibold text-ink-400">
                    {s.posts} posts · <span className="text-teal-600 dark:text-teal-300">+{s.growth}%</span>
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-white/10">
                  <div className={cx('h-full rounded-full bg-gradient-to-r', toneBar[s.tone])} style={{ width: `${(s.posts / maxPosts) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-4">
          <Card>
            <Tag tone="violet" icon="Target">Popular career goals</Tag>
            <ul className="mt-4 space-y-2.5">
              {POPULAR_GOALS.map((g, i) => (
                <li key={g.name} className="flex items-center gap-3">
                  <span className="tnum grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-ink-100 text-[11px] font-bold text-ink-500 dark:bg-white/10 dark:text-ink-200">{i + 1}</span>
                  <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink-700 dark:text-ink-100">{g.name}</span>
                  <span className="tnum text-[11px] font-bold text-ink-400">{g.students.toLocaleString('en-IN')}</span>
                </li>
              ))}
            </ul>
            <Note className="mt-4">Student counts are seeded demo values representing community interest, not platform users.</Note>
          </Card>

          <Card>
            <Tag tone="teal" icon="Swords">Skill challenges</Tag>
            <ul className="mt-4 space-y-3">
              {CHALLENGES.map((c) => (
                <li key={c.id} className="rounded-2xl border border-ink-100 p-3.5 dark:border-white/10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className={cx('grid h-8 w-8 shrink-0 place-items-center rounded-lg', {
                        teal: 'bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300',
                        brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-200',
                        violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-300',
                      }[c.tone])}>
                        <Icon name={c.icon} size={15} />
                      </span>
                      <div>
                        <p className="text-[13px] font-bold text-ink-900 dark:text-white">{c.title}</p>
                        <p className="mt-0.5 text-[11px] text-ink-400">{c.goal}</p>
                      </div>
                    </div>
                    <span className="tnum shrink-0 rounded-lg bg-amberx-500/10 px-2 py-1 text-[10px] font-bold text-amberx-500">{c.daysLeft}d left</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="tnum text-[11px] font-semibold text-ink-400">{c.participants.toLocaleString('en-IN')} joined</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      icon="Swords"
                      onClick={() => toast({ title: `Joined ${c.title}`, body: 'Challenge participation is a local demo action.', tone: 'teal', icon: 'Trophy' })}
                    >
                      Join
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* workshops */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Tag tone="sky" icon="Presentation">Upcoming workshops</Tag>
            <h3 className="mt-3 font-display text-lg font-bold text-ink-900 dark:text-white">Live sessions hosted by peers</h3>
          </div>
          <Note className="!mt-0">Seat counts are seeded demo values.</Note>
        </div>
        <ul className="mt-5 grid gap-4 lg:grid-cols-3">
          {WORKSHOPS.map((w) => (
            <li key={w.id} className="rounded-2xl border border-ink-100 p-4 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft dark:border-white/10">
              <div className="flex items-center justify-between gap-2">
                <Tag tone="sky">{w.tag}</Tag>
                <span className="tnum text-[11px] font-bold text-ink-400">{w.filled}/{w.seats} seats</span>
              </div>
              <p className="mt-3 text-[14px] font-bold leading-snug text-ink-900 dark:text-white">{w.title}</p>
              <p className="mt-1.5 text-[11.5px] text-ink-400">{w.host} · {w.when}</p>
              <ProgressBar value={w.filled} max={w.seats} tone="sky" className="mt-3" />
              <Button size="sm" variant="primary" className="mt-4 w-full" icon="CalendarCheck" onClick={() => setWorkshop(w)}>
                Register
              </Button>
            </li>
          ))}
        </ul>
      </Card>

      {/* discussions */}
      <Card className="!p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Tabs
            size="sm"
            value={tab}
            onChange={setTab}
            tabs={[
              { id: 'all', label: 'Discussions', icon: 'MessagesSquare', count: POSTS.length },
              { id: 'saved', label: 'Saved', icon: 'Bookmark', count: state.community.saved.length },
              { id: 'mine', label: 'Commented', icon: 'MessageCircle', count: POSTS.filter((p) => (state.community.comments[p.id] || []).some((c) => c.isMine)).length },
            ]}
          />
          <div className="relative">
            <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search discussions…"
              aria-label="Search discussions"
              className="input !py-2 pl-9 text-sm lg:w-72"
            />
          </div>
        </div>
      </Card>

      {list.length === 0 ? (
        <EmptyState
          icon="MessagesSquare"
          title={tab === 'saved' ? 'No saved discussions' : tab === 'mine' ? 'You have not commented yet' : 'No discussions match your search'}
          body={tab === 'saved' ? 'Tap Save on any post and it will appear here.' : tab === 'mine' ? 'Open a discussion, write a reply and it will show up in this tab.' : 'Try a different keyword such as “valuation”, “Excel” or “interview”.'}
          action={<Button variant="primary" icon="RotateCcw" onClick={() => { setTab('all'); setQ('') }}>Show all discussions</Button>}
        />
      ) : (
        <ul className="grid gap-4">
          {list.map((p) => <PostCard key={p.id} post={p} />)}
        </ul>
      )}

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300">
              <Icon name="HeartHandshake" size={18} />
            </span>
            <div>
              <p className="text-sm font-bold text-ink-900 dark:text-white">Community hours count toward social impact</p>
              <p className="mt-0.5 text-[13px] text-ink-500 dark:text-ink-300">Volunteer teaching sessions are logged in the same profile as skill proof.</p>
            </div>
          </div>
          <Button variant="primary" size="sm" icon="HeartHandshake" to="/impact">Open social impact</Button>
        </div>
      </Card>

      <Modal
        open={!!workshop}
        onClose={() => setWorkshop(null)}
        title={workshop ? `Register for ${workshop.title}` : ''}
        subtitle={workshop ? `${workshop.host} · ${workshop.when}` : ''}
        icon="CalendarCheck"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setWorkshop(null)}>Cancel</Button>
            <Button
              variant="primary"
              icon="Check"
              onClick={() => {
                toast({ title: 'Registration simulated', body: `A seat would be reserved for ${workshop.title}. No email is sent in this prototype.`, tone: 'teal', icon: 'CalendarCheck' })
                setWorkshop(null)
              }}
            >
              Confirm seat
            </Button>
          </>
        }
      >
        {workshop ? (
          <div className="space-y-3">
            <div className="rounded-2xl bg-ink-50 p-4 dark:bg-white/5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Seats</p>
              <p className="tnum mt-1 text-sm font-bold text-ink-900 dark:text-white">{workshop.filled} of {workshop.seats} filled</p>
              <ProgressBar value={workshop.filled} max={workshop.seats} tone="sky" className="mt-3" />
            </div>
            <Note>Registration is simulated and stored locally. No backend or email service is used.</Note>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
