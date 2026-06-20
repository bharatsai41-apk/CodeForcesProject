import { useMemo, useState } from 'react'
import { Filter, ChevronDown } from 'lucide-react'
import {
  formatBytes,
  formatDateTime,
  getVerdictClass,
  getVerdictLabel,
} from '../utils/format'

const VERDICT_OPTIONS = ['ALL', 'OK', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'COMPILATION_ERROR']
const PAGE_SIZE = 15

export default function SubmissionsTable({ submissions }) {
  const [verdictFilter, setVerdictFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    return submissions.filter((s) => {
      const matchesVerdict = verdictFilter === 'ALL' || s.verdict === verdictFilter
      const query = search.trim().toLowerCase()
      const matchesSearch =
        !query ||
        s.problem.name?.toLowerCase().includes(query) ||
        s.problem.label?.toLowerCase().includes(query) ||
        s.programmingLanguage?.toLowerCase().includes(query) ||
        s.problem.tags?.some((t) => t.toLowerCase().includes(query))
      return matchesVerdict && matchesSearch
    })
  }, [submissions, verdictFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const handleFilterChange = (value) => {
    setVerdictFilter(value)
    setPage(0)
  }

  const handleSearchChange = (value) => {
    setSearch(value)
    setPage(0)
  }

  return (
    <section className="submissions-section">
      <div className="section-header">
        <div>
          <h2>Recent Submissions</h2>
          <p className="section-subtitle">{filtered.length} submissions</p>
        </div>
        <div className="table-controls">
          <label className="filter-input">
            <Filter size={15} />
            <input
              type="search"
              placeholder="Filter problems, tags, language..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </label>
          <label className="filter-select">
            <span>Verdict</span>
            <select value={verdictFilter} onChange={(e) => handleFilterChange(e.target.value)}>
              {VERDICT_OPTIONS.map((v) => (
                <option key={v} value={v}>{v === 'ALL' ? 'All Verdicts' : getVerdictLabel(v)}</option>
              ))}
            </select>
            <ChevronDown size={14} className="select-chevron" aria-hidden="true" />
          </label>
        </div>
      </div>

      <div className="table-wrap">
        <table className="submissions-table">
          <thead>
            <tr>
              <th>When</th>
              <th>Problem</th>
              <th>Tags</th>
              <th>Lang</th>
              <th>Verdict</th>
              <th>Runtime</th>
              <th>Memory</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-row">No submissions match your filters.</td>
              </tr>
            ) : (
              pageItems.map((s) => (
                <tr key={s.id}>
                  <td className="cell-time">{formatDateTime(s.creationTimeSeconds)}</td>
                  <td className="cell-problem">
                    <a
                      href={`https://codeforces.com/contest/${s.problem.contestId}/problem/${s.problem.index}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="problem-id">{s.problem.label}</span>
                      <span className="problem-name">{s.problem.name}</span>
                    </a>
                    {s.problem.points != null && (
                      <span className="problem-points">{s.problem.points} pts</span>
                    )}
                  </td>
                  <td className="cell-tags">
                    <div className="tag-list">
                      {(s.problem.tags ?? []).slice(0, 3).map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="cell-lang">{s.programmingLanguage ?? '—'}</td>
                  <td>
                    <span className={`verdict-pill ${getVerdictClass(s.verdict)}`}>
                      {getVerdictLabel(s.verdict)}
                    </span>
                  </td>
                  <td className="cell-mono">{s.timeConsumedMillis ?? '—'} ms</td>
                  <td className="cell-mono">{formatBytes(s.memoryConsumedBytes)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > PAGE_SIZE && (
        <div className="pagination">
          <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <span>Page {page + 1} of {totalPages}</span>
          <button type="button" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}
    </section>
  )
}
