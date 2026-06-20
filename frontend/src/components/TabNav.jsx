import { Code2, BarChart3, List, UserRound } from 'lucide-react'

export default function TabNav({ active, onChange }) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'submissions', label: 'Submissions', icon: List },
    { id: 'profile', label: 'Raw Profile', icon: UserRound },
  ]

  return (
    <nav className="tab-nav" aria-label="Dashboard sections">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          className={active === id ? 'active' : ''}
          onClick={() => onChange(id)}
        >
          <Icon size={16} />
          {label}
        </button>
      ))}
    </nav>
  )
}

export function EmptyLanding() {
  return (
    <section className="empty-landing">
      <div className="empty-icon">
        <Code2 size={40} />
      </div>
      <h2>Codeforces Profile Explorer</h2>
      <p>
        Enter a Codeforces handle to view ratings, solved problems,
        submissions, and language stats.
      </p>
      <ul className="feature-list">
        <li>Profile and rating stats</li>
        <li>Submission table with filters</li>
        <li>Verdict, language, and tag breakdowns</li>
        <li>Full profile field view</li>
      </ul>
    </section>
  )
}
