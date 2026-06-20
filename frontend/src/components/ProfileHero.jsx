import { ExternalLink, MapPin, Building2, Users, Star } from 'lucide-react'
import {
  formatRelativeTime,
  getRankColor,
  titleCase,
} from '../utils/format'

export default function ProfileHero({ user, stats }) {
  if (!user) return null

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.handle
  const rankColor = getRankColor(user.rank)
  const location = [user.city, user.country].filter(Boolean).join(', ')

  return (
    <section className="profile-hero">
      <div className="profile-hero-bg" aria-hidden="true" />
      <div className="profile-hero-inner">
        <div className="profile-avatar-wrap">
          <img
            src={user.avatar}
            alt={`${user.handle} avatar`}
            className="profile-avatar"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.handle)}&background=1e293b&color=38bdf8&size=128`
            }}
          />
          <span className="profile-rank-badge" style={{ borderColor: rankColor, color: rankColor }}>
            {titleCase(user.rank)}
          </span>
        </div>

        <div className="profile-identity">
          <div className="profile-handle-row">
            <h1>{user.handle}</h1>
            <a
              href={`https://codeforces.com/profile/${user.handle}`}
              target="_blank"
              rel="noreferrer"
              className="profile-link"
              aria-label={`Open ${user.handle} on Codeforces`}
            >
              <ExternalLink size={16} />
            </a>
          </div>
          <p className="profile-name">{fullName}</p>

          <div className="profile-meta">
            {location && (
              <span><MapPin size={14} /> {location}</span>
            )}
            {user.organization && (
              <span><Building2 size={14} /> {user.organization}</span>
            )}
            <span><Users size={14} /> {stats.friendOfCount.toLocaleString()} friends</span>
            <span><Star size={14} /> {stats.contribution} contribution</span>
          </div>

          <p className="profile-last-seen">
            Last online {formatRelativeTime(user.lastOnlineTimeSeconds)}
          </p>
        </div>

        <div className="profile-rating-block">
          <div className="rating-current" style={{ color: rankColor }}>
            <span className="rating-value">{stats.rating ?? '—'}</span>
            <span className="rating-label">Current Rating</span>
          </div>
          <div className="rating-max">
            <span className="rating-value">{stats.maxRating ?? '—'}</span>
            <span className="rating-label">Max ({titleCase(user.maxRank)})</span>
          </div>
        </div>
      </div>
    </section>
  )
}
