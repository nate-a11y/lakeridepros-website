'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import './dashboard.css'

interface CollectionStats {
  slug: string
  name: string
  count: number
  icon: string
  color: string
}

const collections = [
  { name: 'Services', icon: '🚗', slug: 'services', color: '#4cbb17' },
  { name: 'Vehicles', icon: '🚙', slug: 'vehicles', color: '#60e421' },
  { name: 'Partners', icon: '🤝', slug: 'partners', color: '#4cbb17' },
  { name: 'Testimonials', icon: '⭐', slug: 'testimonials', color: '#60e421' },
  { name: 'Products', icon: '🛍️', slug: 'products', color: '#4cbb17' },
  { name: 'Gift Cards', icon: '🎁', slug: 'gift-cards', color: '#60e421' },
  { name: 'Orders', icon: '📦', slug: 'orders', color: '#4cbb17' },
  { name: 'Blog Posts', icon: '📝', slug: 'blog-posts', color: '#60e421' },
  { name: 'Pages', icon: '📄', slug: 'pages', color: '#4cbb17' },
  { name: 'Media', icon: '🖼️', slug: 'media', color: '#60e421' },
  { name: 'Users', icon: '👥', slug: 'users', color: '#4cbb17' },
]

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<CollectionStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
