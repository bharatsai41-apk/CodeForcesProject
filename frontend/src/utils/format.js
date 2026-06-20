const RANK_COLORS = {
  'newbie': '#808080',
  'pupil': '#008000',
  'specialist': '#03a89e',
  'expert': '#0000ff',
  'candidate master': '#aa00aa',
  'master': '#ff8c00',
  'international master': '#ff8c00',
  'grandmaster': '#ff0000',
  'international grandmaster': '#ff0000',
  'legendary grandmaster': '#ff0000',
  tourist: '#ff0000',
}

export function formatDate(seconds) {
  if (!seconds) return '—'
  return new Date(seconds * 1000).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(seconds) {
  if (!seconds) return '—'
  return new Date(seconds * 1000).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelativeTime(seconds) {
  if (!seconds) return '—'
  const diff = Date.now() - seconds * 1000
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return formatDate(seconds)
}

export function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function formatPercent(value, total) {
  if (!total) return '0%'
  return `${((value / total) * 100).toFixed(1)}%`
}

export function getRankColor(rank) {
  if (!rank) return '#94a3b8'
  return RANK_COLORS[rank.toLowerCase()] ?? '#94a3b8'
}

export function getVerdictClass(verdict) {
  switch (verdict) {
    case 'OK':
      return 'verdict-accepted'
    case 'WRONG_ANSWER':
    case 'RUNTIME_ERROR':
    case 'TIME_LIMIT_EXCEEDED':
    case 'MEMORY_LIMIT_EXCEEDED':
    case 'COMPILATION_ERROR':
      return 'verdict-rejected'
    default:
      return 'verdict-pending'
  }
}

export function getVerdictLabel(verdict) {
  if (!verdict) return 'Unknown'
  return verdict.replace(/_/g, ' ')
}

export function titleCase(value) {
  if (!value) return ''
  return value
    .split(/[\s_-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export function problemKey(problem) {
  if (!problem) return ''
  return `${problem.contestId ?? ''}${problem.index ?? ''}`
}
