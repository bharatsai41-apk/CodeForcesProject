import { useState, useCallback } from 'react'
import { Zap } from 'lucide-react'
import { fetchUserProfile } from './api/client'
import { parseUserProfile } from './utils/profileParser'
import SearchBar from './components/SearchBar'
import ProfileHero from './components/ProfileHero'
import StatsPanel, { BreakdownPanel } from './components/StatsPanel'
import SubmissionsTable from './components/SubmissionsTable'
import UserDetailsPanel from './components/UserDetailsPanel'
import TabNav, { EmptyLanding } from './components/TabNav'
import './App.css'

export default function App() {
  const [handle, setHandle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  const loadProfile = useCallback(async (userName) => {
    const trimmed = userName.trim()
    if (trimmed.length < 3) {
      setError('Handle must be at least 3 characters.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const raw = await fetchUserProfile(trimmed)
      const parsed = parseUserProfile(raw)
      if (!parsed.user) {
        throw new Error('User not found or invalid response from API.')
      }
      setProfile(parsed)
      setActiveTab('overview')
    } catch (err) {
      setProfile(null)
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    loadProfile(handle)
  }

  return (
    <div className="app">
      <header className="top-nav">
        <div className="brand">
          <span className="brand-icon"><Zap size={20} /></span>
          <div>
            <strong>CF Analytics</strong>
            <span>Codeforces profile explorer</span>
          </div>
        </div>
        <SearchBar
          value={handle}
          onChange={setHandle}
          onSubmit={handleSubmit}
          loading={loading}
          error={null}
        />
      </header>

      <main className="main-content">
        {error && !profile && (
          <div className="banner banner-error" role="alert">{error}</div>
        )}

        {!profile && !loading && <EmptyLanding />}

        {loading && (
          <div className="loading-state">
            <div className="loading-ring" aria-hidden="true" />
            <p>Fetching profile data from API...</p>
          </div>
        )}

        {profile && !loading && (
          <>
            {error && <div className="banner banner-error" role="alert">{error}</div>}
            <ProfileHero user={profile.user} stats={profile.stats} />
            <TabNav active={activeTab} onChange={setActiveTab} />

            {activeTab === 'overview' && (
              <div className="tab-panel">
                <StatsPanel stats={profile.stats} />
                <BreakdownPanel breakdowns={profile.breakdowns} stats={profile.stats} />
              </div>
            )}

            {activeTab === 'submissions' && (
              <div className="tab-panel">
                <SubmissionsTable submissions={profile.submissions} />
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="tab-panel">
                <UserDetailsPanel userFields={profile.userFields} />
              </div>
            )}
          </>
        )}
      </main>

      <footer className="site-footer">
        <span>Codeforces data via backend proxy</span>
        {profile?.meta && (
          <span>
            API status: info={profile.meta.infoStatus}, status={profile.meta.statusStatus}
          </span>
        )}
      </footer>
    </div>
  )
}
