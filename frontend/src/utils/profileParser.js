import { problemKey } from './format'

function countBy(items, keyFn) {
  const counts = {}
  for (const item of items) {
    const key = keyFn(item)
    if (!key) continue
    counts[key] = (counts[key] ?? 0) + 1
  }
  return Object.entries(counts)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
}

function uniqueBy(items, keyFn) {
  const seen = new Set()
  const result = []
  for (const item of items) {
    const key = keyFn(item)
    if (seen.has(key)) continue
    seen.add(key)
    result.push(item)
  }
  return result
}

export function parseUserProfile(raw) {
  const infoPayload = raw?.info ?? {}
  const statusPayload = raw?.status ?? {}

  const user = infoPayload?.result?.[0] ?? null
  const submissions = Array.isArray(statusPayload?.result) ? statusPayload.result : []

  const accepted = submissions.filter((s) => s.verdict === 'OK')
  const solvedProblems = uniqueBy(
    accepted,
    (s) => problemKey(s.problem),
  )

  const verdictBreakdown = countBy(submissions, (s) => s.verdict ?? 'UNKNOWN')
  const languageBreakdown = countBy(submissions, (s) => s.programmingLanguage ?? 'Unknown')
  const tagBreakdown = countBy(
    submissions.flatMap((s) => s.problem?.tags ?? []),
    (tag) => tag,
  )

  const totalPoints = accepted.reduce((sum, s) => sum + (s.problem?.points ?? 0), 0)
  const avgTimeMs =
    submissions.length > 0
      ? Math.round(
          submissions.reduce((sum, s) => sum + (s.timeConsumedMillis ?? 0), 0) / submissions.length,
        )
      : 0

  const userFields = user
    ? Object.entries(user).map(([key, value]) => ({
        key,
        label: formatFieldLabel(key),
        value: formatFieldValue(key, value),
        raw: value,
      }))
    : []

  return {
    meta: {
      infoStatus: infoPayload?.status ?? 'UNKNOWN',
      statusStatus: statusPayload?.status ?? 'UNKNOWN',
    },
    user,
    userFields,
    submissions: submissions.map(mapSubmission),
    stats: {
      totalSubmissions: submissions.length,
      acceptedCount: accepted.length,
      acceptanceRate: submissions.length ? (accepted.length / submissions.length) * 100 : 0,
      solvedCount: solvedProblems.length,
      totalPoints,
      avgTimeMs,
      contribution: user?.contribution ?? 0,
      friendOfCount: user?.friendOfCount ?? 0,
      rating: user?.rating ?? null,
      maxRating: user?.maxRating ?? null,
    },
    breakdowns: {
      verdicts: verdictBreakdown,
      languages: languageBreakdown.slice(0, 8),
      tags: tagBreakdown.slice(0, 12),
    },
  }
}

function mapSubmission(submission) {
  const problem = submission.problem ?? {}
  return {
    id: submission.id,
    contestId: submission.contestId ?? problem.contestId,
    creationTimeSeconds: submission.creationTimeSeconds,
    relativeTimeSeconds: submission.relativeTimeSeconds,
    verdict: submission.verdict,
    programmingLanguage: submission.programmingLanguage,
    testset: submission.testset,
    passedTestCount: submission.passedTestCount,
    timeConsumedMillis: submission.timeConsumedMillis,
    memoryConsumedBytes: submission.memoryConsumedBytes,
    problem: {
      contestId: problem.contestId,
      index: problem.index,
      name: problem.name,
      type: problem.type,
      points: problem.points,
      rating: problem.rating,
      tags: problem.tags ?? [],
      key: problemKey(problem),
      label: problem.contestId && problem.index ? `${problem.contestId}${problem.index}` : '—',
    },
    author: submission.author,
  }
}

function formatFieldLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/Seconds$/, '')
    .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatFieldValue(key, value) {
  if (value === null || value === undefined || value === '') return '—'
  if (key.endsWith('Seconds') && typeof value === 'number') {
    return new Date(value * 1000).toLocaleString()
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'number') return value.toLocaleString()
  if (typeof value === 'string' && value.startsWith('http')) return value
  return String(value)
}
