import {
  Target,
  CheckCircle2,
  Send,
  Trophy,
  Timer,
  TrendingUp,
} from 'lucide-react'
import { formatPercent } from '../utils/format'

const STAT_CARDS = [
  { key: 'solvedCount', label: 'Problems Solved', icon: Target, accent: 'cyan' },
  { key: 'totalSubmissions', label: 'Total Submissions', icon: Send, accent: 'violet' },
  { key: 'acceptedCount', label: 'Accepted', icon: CheckCircle2, accent: 'green' },
  { key: 'acceptanceRate', label: 'Accept Rate', icon: TrendingUp, accent: 'amber', format: (v) => `${v.toFixed(1)}%` },
  { key: 'totalPoints', label: 'Points Earned', icon: Trophy, accent: 'orange' },
  { key: 'avgTimeMs', label: 'Avg Runtime', icon: Timer, accent: 'blue', format: (v) => `${v} ms` },
]

export default function StatsPanel({ stats }) {
  return (
    <section className="stats-panel">
      {STAT_CARDS.map(({ key, label, icon: Icon, accent, format }) => {
        const raw = stats[key]
        const display = format ? format(raw) : (typeof raw === 'number' ? raw.toLocaleString() : raw ?? '—')
        return (
          <article key={key} className={`stat-card stat-${accent}`}>
            <div className="stat-icon">
              <Icon size={18} />
            </div>
            <div className="stat-body">
              <span className="stat-value">{display}</span>
              <span className="stat-label">{label}</span>
            </div>
          </article>
        )
      })}
    </section>
  )
}

export function BreakdownPanel({ breakdowns, stats }) {
  return (
    <div className="breakdown-grid">
      <BreakdownCard title="Verdict Distribution" items={breakdowns.verdicts} total={stats.totalSubmissions} />
      <BreakdownCard title="Top Languages" items={breakdowns.languages} total={stats.totalSubmissions} />
      <BreakdownCard title="Popular Tags" items={breakdowns.tags} total={stats.totalSubmissions} wide />
    </div>
  )
}

function BreakdownCard({ title, items, total, wide }) {
  return (
    <article className={`breakdown-card ${wide ? 'wide' : ''}`}>
      <h3>{title}</h3>
      {items.length === 0 ? (
        <p className="muted">No data available</p>
      ) : (
        <ul className="breakdown-list">
          {items.map(({ key, count }) => (
            <li key={key}>
              <div className="breakdown-row">
                <span className="breakdown-key">{key.replace(/_/g, ' ')}</span>
                <span className="breakdown-count">{count}</span>
              </div>
              <div className="breakdown-bar">
                <span style={{ width: formatPercent(count, total) }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
