import { Database } from 'lucide-react'

export default function UserDetailsPanel({ userFields }) {
  if (!userFields.length) return null

  return (
    <section className="details-section">
      <div className="section-header compact">
        <div>
          <h2><Database size={18} /> Profile Data</h2>
          <p className="section-subtitle">Profile fields from Codeforces</p>
        </div>
      </div>
      <div className="details-grid">
        {userFields.map(({ key, label, value, raw }) => (
          <div key={key} className="detail-item">
            <span className="detail-label">{label}</span>
            {typeof raw === 'string' && raw.startsWith('http') ? (
              <a href={raw} target="_blank" rel="noreferrer" className="detail-link">
                View asset
              </a>
            ) : (
              <span className="detail-value">{value}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
