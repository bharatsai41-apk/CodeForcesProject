import { Search, Loader2 } from 'lucide-react'

export default function SearchBar({ value, onChange, onSubmit, loading, error }) {
  return (
    <form className="search-bar" onSubmit={onSubmit}>
      <div className={`search-input-wrap ${error ? 'has-error' : ''}`}>
        <Search size={18} className="search-icon" aria-hidden="true" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter Codeforces handle (e.g. tourist)"
          spellCheck={false}
          autoComplete="off"
          minLength={3}
          maxLength={50}
          aria-label="Codeforces handle"
        />
        <button type="submit" disabled={loading || value.trim().length < 3}>
          {loading ? (
            <>
              <Loader2 size={16} className="spin" aria-hidden="true" />
              Loading
            </>
          ) : (
            'Analyze'
          )}
        </button>
      </div>
      {error && <p className="search-error" role="alert">{error}</p>}
    </form>
  )
}
