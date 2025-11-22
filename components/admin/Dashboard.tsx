'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import './dashboard.css'

// Brand colors - using CSS variable values for consistency
const BRAND_COLORS = {
  primary: 'var(--primary)',      // #4cbb17
  light: 'var(--primary-light)',  // #60e421
} as const

interface CollectionStats {
  slug: string
  name: string
  count: number
  icon: string
  color: string
}

const collections = [
  { name: 'Services', icon: '🚗', slug: 'services', color: BRAND_COLORS.primary },
  { name: 'Vehicles', icon: '🚙', slug: 'vehicles', color: BRAND_COLORS.light },
  { name: 'Partners', icon: '🤝', slug: 'partners', color: BRAND_COLORS.primary },
  { name: 'Testimonials', icon: '⭐', slug: 'testimonials', color: BRAND_COLORS.light },
  { name: 'Products', icon: '🛍️', slug: 'products', color: BRAND_COLORS.primary },
  { name: 'Gift Cards', icon: '🎁', slug: 'gift-cards', color: BRAND_COLORS.light },
  { name: 'Orders', icon: '📦', slug: 'orders', color: BRAND_COLORS.primary },
  { name: 'Blog Posts', icon: '📝', slug: 'blog-posts', color: BRAND_COLORS.light },
  { name: 'Pages', icon: '📄', slug: 'pages', color: BRAND_COLORS.primary },
  { name: 'Media', icon: '🖼️', slug: 'media', color: BRAND_COLORS.light },
  { name: 'Users', icon: '👥', slug: 'users', color: BRAND_COLORS.primary },
]

interface SyncStatus {
  configured: boolean
  lastSync?: string
  totalGoogleReviews?: number
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<CollectionStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [syncMessage, setSyncMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch counts for all collections in parallel
        const promises = collections.map(async (collection) => {
          try {
            const response = await fetch(
              `/api/${collection.slug}?limit=0&depth=0`,
              {
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )

            if (!response.ok) {
              console.warn(`Failed to fetch ${collection.slug}:`, response.status)
              return {
                ...collection,
                count: 0,
              }
            }

            const data = await response.json()
            return {
              ...collection,
              count: data.totalDocs || 0,
            }
          } catch (err) {
            console.warn(`Error fetching ${collection.slug}:`, err)
            return {
              ...collection,
              count: 0,
            }
          }
        })

        const results = await Promise.all(promises)
        setStats(results)
      } catch (err) {
        console.error('Error fetching dashboard stats:', err)
        setError('Failed to load dashboard statistics')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  useEffect(() => {
    const fetchSyncStatus = async () => {
      try {
        const response = await fetch('/api/sync-google-reviews', {
          credentials: 'include',
        })
        if (response.ok) {
          const data = await response.json()
          setSyncStatus(data)
        }
      } catch (err) {
        console.warn('Failed to fetch sync status:', err)
      }
    }

    fetchSyncStatus()
  }, [])

  const handleSyncGoogleReviews = async () => {
    setSyncing(true)
    setSyncMessage(null)

    try {
      const response = await fetch('/api/sync-google-reviews', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        setSyncMessage(`✅ ${data.message} (Created: ${data.stats.created}, Updated: ${data.stats.updated}, Skipped: ${data.stats.skipped})`)
        // Refresh stats
        window.location.reload()
      } else {
        setSyncMessage(`❌ ${data.error || 'Sync failed'}`)
      }
    } catch (err) {
      setSyncMessage(`❌ Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">Lake Ride Pros Admin Dashboard</h1>
          <p className="dashboard-subtitle">Manage your luxury transportation business</p>
        </div>
        <div className="dashboard-header-actions">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="dashboard-btn dashboard-btn-outline"
          >
            View Website
          </a>
        </div>
      </div>

      {/* Quick Stats Overview */}
      {!loading && !error && (
        <div className="dashboard-stats-overview">
          <div className="stat-card">
            <div className="stat-icon">🚀</div>
            <div className="stat-content">
              <div className="stat-value">
                {stats.find(s => s.slug === 'services')?.count || 0}
              </div>
              <div className="stat-label">Active Services</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚙</div>
            <div className="stat-content">
              <div className="stat-value">
                {stats.find(s => s.slug === 'vehicles')?.count || 0}
              </div>
              <div className="stat-label">Total Vehicles</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <div className="stat-value">
                {stats.find(s => s.slug === 'orders')?.count || 0}
              </div>
              <div className="stat-label">Total Orders</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🛍️</div>
            <div className="stat-content">
              <div className="stat-value">
                {stats.find(s => s.slug === 'products')?.count || 0}
              </div>
              <div className="stat-label">Products Listed</div>
            </div>
          </div>
        </div>
      )}

      {/* Google Reviews Sync Section */}
      {syncStatus && (
        <div className="dashboard-section">
          <h2 className="section-title">Google Business Profile Integration</h2>
          <div className="sync-card">
            <div className="sync-header">
              <div className="sync-icon">⭐</div>
              <div>
                <h3 className="sync-title">Google Reviews Sync</h3>
                <p className="sync-description">
                  Automatically import reviews from your Google Business Profile
                </p>
              </div>
            </div>

            <div className="sync-status">
              {syncStatus.configured ? (
                <>
                  <div className="sync-stat">
                    <span className="sync-stat-label">Status:</span>
                    <span className="sync-stat-value status-active">✅ Configured</span>
                  </div>
                  <div className="sync-stat">
                    <span className="sync-stat-label">Google Reviews:</span>
                    <span className="sync-stat-value">{syncStatus.totalGoogleReviews || 0}</span>
                  </div>
                  {syncStatus.lastSync && (
                    <div className="sync-stat">
                      <span className="sync-stat-label">Last Sync:</span>
                      <span className="sync-stat-value" suppressHydrationWarning>
                        {new Date(syncStatus.lastSync).toLocaleString()}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="sync-stat">
                  <span className="sync-stat-label">Status:</span>
                  <span className="sync-stat-value status-inactive">⚠️ Not Configured</span>
                </div>
              )}
            </div>

            {syncMessage && (
              <div className={`sync-message ${syncMessage.includes('✅') ? 'success' : 'error'}`}>
                {syncMessage}
              </div>
            )}

            <div className="sync-actions">
              <button
                onClick={handleSyncGoogleReviews}
                disabled={!syncStatus.configured || syncing}
                className="dashboard-btn dashboard-btn-primary"
              >
                {syncing ? '⏳ Syncing...' : '🔄 Sync Reviews Now'}
              </button>
              {!syncStatus.configured && (
                <p className="sync-help-text">
                  Configure Google API credentials in environment variables to enable sync.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Collections Grid */}
      <div className="dashboard-section">
        <h2 className="section-title">Collections</h2>

        {loading && (
          <div className="dashboard-loading">
            <div className="loading-spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        )}

        {error && (
          <div className="dashboard-error">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="dashboard-btn dashboard-btn-primary"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="collections-grid">
            {stats.map((collection) => (
              <Link
                key={collection.slug}
                href={`/admin/collections/${collection.slug}`}
                className="collection-card"
                style={{ '--card-color': collection.color } as React.CSSProperties}
              >
                <div className="collection-card-header">
                  <div className="collection-icon">{collection.icon}</div>
                  <h3 className="collection-name">{collection.name}</h3>
                </div>

                <div className="collection-stats">
                  <div className="collection-count">{collection.count}</div>
                  <div className="collection-count-label">
                    {collection.count === 1 ? 'item' : 'items'}
                  </div>
                </div>

                <div className="collection-actions">
                  <Link
                    href={`/admin/collections/${collection.slug}`}
                    className="collection-btn collection-btn-view"
                  >
                    View All
                  </Link>
                  <Link
                    href={`/admin/collections/${collection.slug}/create`}
                    className="collection-btn collection-btn-create"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Create New
                  </Link>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
