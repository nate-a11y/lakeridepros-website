'use client';

import { useState, useEffect, useCallback, FormEvent } from 'react';
import { BridalShowRegistration } from '@/lib/supabase/bridal-show';

export default function BridalShowAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [registrations, setRegistrations] = useState<BridalShowRegistration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [winner, setWinner] = useState<BridalShowRegistration | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinningName, setSpinningName] = useState<string>('');

  const fetchData = useCallback(async (pwd: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/bridal-show-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd }),
      });
      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          setAuthError('Session expired. Please log in again.');
        } else {
          setError(result.error || 'Failed to fetch registrations');
        }
        return;
      }

      setRegistrations(result.registrations || []);
      setError(null);
    } catch (err) {
      setError('Failed to load registrations. Please try again.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const response = await fetch('/api/bridal-show-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();

      if (!response.ok) {
        setAuthError(result.error || 'Invalid password');
        return;
      }

      setIsAuthenticated(true);
      setRegistrations(result.registrations || []);
      // Store password in session for subsequent requests
      sessionStorage.setItem('bridal_admin_pwd', password);
    } catch (err) {
      setAuthError('Network error. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const storedPwd = sessionStorage.getItem('bridal_admin_pwd');
    if (storedPwd) {
      setPassword(storedPwd);
      setIsAuthenticated(true);
      fetchData(storedPwd);
    }
  }, [fetchData]);

  const selectRandomWinner = () => {
    if (registrations.length === 0) return;

    setIsSpinning(true);
    setWinner(null);

    // Animate through names for visual effect
    let iterations = 0;
    const totalIterations = 20;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * registrations.length);
      setSpinningName(registrations[randomIndex].name);
      iterations++;

      if (iterations >= totalIterations) {
        clearInterval(interval);
        // Final random selection
        const winnerIndex = Math.floor(Math.random() * registrations.length);
        const selectedWinner = registrations[winnerIndex];
        setWinner(selectedWinner);
        setSpinningName('');
        setIsSpinning(false);
      }
    }, 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const handleLogout = () => {
    sessionStorage.removeItem('bridal_admin_pwd');
    setIsAuthenticated(false);
    setPassword('');
    setRegistrations([]);
    setWinner(null);
  };

  // Password Modal
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg-primary flex items-center justify-center p-4">
        <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl p-8 max-w-md w-full border border-neutral-200 dark:border-dark-border">
          <div className="text-center mb-6">
            <svg
              className="h-12 w-12 text-primary mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Admin Access
            </h1>
            <p className="text-lrp-text-secondary dark:text-dark-text-secondary mt-2">
              Enter the admin password to view registrations
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                className="w-full px-4 py-3 border border-neutral-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-neutral-900 dark:text-lrp-black bg-white dark:bg-dark-bg-primary transition-colors"
                placeholder="Enter admin password"
              />
            </div>

            {authError && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800 text-sm">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading || !password}
              className="w-full bg-primary hover:bg-primary-dark text-lrp-black font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {authLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                'Access Admin'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading && registrations.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg-primary flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-primary mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-neutral-600 dark:text-dark-text-secondary">Loading registrations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg-primary flex items-center justify-center p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md w-full text-center">
          <svg
            className="h-12 w-12 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Error</h2>
          <p className="text-red-600 dark:text-red-300">{error}</p>
          <button
            onClick={() => fetchData(password)}
            className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg-primary">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="font-boardson text-3xl sm:text-4xl font-bold mb-2">Bridal Show Admin</h1>
            <p className="text-white/90">
              Total Registrations: <span className="font-bold">{registrations.length}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Winner Selection Section */}
        <section className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-lg p-6 mb-8 border border-neutral-200 dark:border-dark-border">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
            Giveaway Winner Selection
          </h2>

          {registrations.length === 0 ? (
            <p className="text-lrp-text-secondary dark:text-dark-text-secondary">
              No registrations yet. Check back later!
            </p>
          ) : (
            <div className="text-center">
              {isSpinning && (
                <div className="mb-6">
                  <div className="text-3xl font-bold text-primary animate-pulse py-8 bg-neutral-100 dark:bg-dark-bg-primary rounded-lg">
                    {spinningName}
                  </div>
                </div>
              )}

              {winner && !isSpinning && (
                <div className="mb-6 p-6 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-lg border-2 border-primary">
                  <p className="text-sm text-primary font-semibold mb-2">WINNER!</p>
                  <p className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                    {winner.name}
                  </p>
                  <p className="text-lrp-text-secondary dark:text-dark-text-secondary">
                    {winner.email}
                  </p>
                  <p className="text-lrp-text-secondary dark:text-dark-text-secondary">
                    {formatPhoneNumber(winner.phone)}
                  </p>
                </div>
              )}

              <button
                onClick={selectRandomWinner}
                disabled={isSpinning || registrations.length === 0}
                className="bg-primary hover:bg-primary-dark text-lrp-black font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {isSpinning ? 'Selecting...' : winner ? 'Select Another Winner' : 'Select Random Winner'}
              </button>
            </div>
          )}
        </section>

        {/* Registrations Table */}
        <section className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-lg border border-neutral-200 dark:border-dark-border overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-dark-border">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              All Registrations
            </h2>
          </div>

          {registrations.length === 0 ? (
            <div className="p-6 text-center text-lrp-text-secondary dark:text-dark-text-secondary">
              No registrations yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-100 dark:bg-dark-bg-primary">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-dark-text-secondary uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-dark-text-secondary uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-dark-text-secondary uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-dark-text-secondary uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-dark-text-secondary uppercase tracking-wider">
                      Transportation Needs
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-dark-text-secondary uppercase tracking-wider">
                      Registered
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-dark-border">
                  {registrations.map((registration, index) => (
                    <tr
                      key={registration.id}
                      className={`hover:bg-neutral-50 dark:hover:bg-dark-bg-primary transition-colors ${
                        winner?.id === registration.id ? 'bg-primary/10 dark:bg-primary/20' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-dark-text-secondary">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-neutral-900 dark:text-white">
                            {registration.name}
                          </span>
                          {winner?.id === registration.id && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary text-lrp-black">
                              Winner
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-dark-text-secondary">
                        <a
                          href={`mailto:${registration.email}`}
                          className="text-primary hover:text-primary-dark"
                        >
                          {registration.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-dark-text-secondary">
                        <a
                          href={`tel:${registration.phone.replace(/\D/g, '')}`}
                          className="text-primary hover:text-primary-dark"
                        >
                          {formatPhoneNumber(registration.phone)}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-dark-text-secondary max-w-xs truncate">
                        <span title={registration.transportation_needs}>
                          {registration.transportation_needs}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-dark-text-secondary">
                        {formatDate(registration.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Export Section */}
        {registrations.length > 0 && (
          <section className="mt-8 text-center">
            <button
              onClick={() => {
                const csv = [
                  ['Name', 'Email', 'Phone', 'Transportation Needs', 'Registered At'].join(','),
                  ...registrations.map(r => [
                    `"${r.name.replace(/"/g, '""')}"`,
                    r.email,
                    r.phone,
                    `"${r.transportation_needs.replace(/"/g, '""')}"`,
                    r.created_at
                  ].join(','))
                ].join('\n');

                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `bridal-show-registrations-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="inline-flex items-center px-4 py-2 border border-neutral-300 dark:border-dark-border rounded-lg text-sm font-medium text-neutral-700 dark:text-dark-text-secondary bg-white dark:bg-dark-bg-secondary hover:bg-neutral-50 dark:hover:bg-dark-bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export to CSV
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
