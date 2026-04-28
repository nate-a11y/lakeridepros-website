'use client';

import { useState, useEffect, useCallback, FormEvent } from 'react';
import { Giveaway, GiveawayEntry, GiveawayWithCount } from '@/lib/supabase/giveaways';

const STORAGE_KEY = 'giveaway_admin_pwd';

type View = 'list' | 'edit' | 'entries';

interface FormState {
  slug: string;
  title: string;
  description: string;
  prize_description: string;
  social_post_url: string;
  start_date: string;
  end_date: string;
  active: boolean;
}

const emptyForm: FormState = {
  slug: '',
  title: '',
  description: '',
  prize_description: '',
  social_post_url: '',
  start_date: '',
  end_date: '',
  active: true,
};

export default function GiveawaysAdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [view, setView] = useState<View>('list');
  const [giveaways, setGiveaways] = useState<GiveawayWithCount[]>([]);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [editing, setEditing] = useState<Giveaway | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSaving, setFormSaving] = useState(false);

  const [activeGiveaway, setActiveGiveaway] = useState<GiveawayWithCount | null>(null);
  const [entries, setEntries] = useState<GiveawayEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(false);
  const [winner, setWinner] = useState<GiveawayEntry | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinningName, setSpinningName] = useState('');

  const callApi = useCallback(
    async (payload: Record<string, unknown>) => {
      const res = await fetch('/api/giveaways-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, password: pwd }),
      });
      const json = await res.json();
      if (res.status === 401) {
        sessionStorage.removeItem(STORAGE_KEY);
        setAuthed(false);
        setAuthError('Session expired. Please log in again.');
        throw new Error('unauthorized');
      }
      if (!res.ok) {
        throw new Error(json.error || 'Request failed');
      }
      return json;
    },
    [pwd]
  );

  const loadGiveaways = useCallback(async () => {
    setLoading(true);
    setGlobalError(null);
    try {
      const json = await callApi({ action: 'list_giveaways' });
      setGiveaways(json.giveaways || []);
    } catch (err) {
      if (err instanceof Error && err.message !== 'unauthorized') {
        setGlobalError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [callApi]);

  // Restore session
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      setPwd(stored);
      setAuthed(true);
    }
  }, []);

  // Load list once authed and pwd is set
  useEffect(() => {
    if (authed && pwd && view === 'list') {
      loadGiveaways();
    }
  }, [authed, pwd, view, loadGiveaways]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/giveaways-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'auth', password: pwd }),
      });
      const json = await res.json();
      if (!res.ok) {
        setAuthError(json.error || 'Invalid password');
        return;
      }
      sessionStorage.setItem(STORAGE_KEY, pwd);
      setAuthed(true);
    } catch {
      setAuthError('Network error. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
    setPwd('');
    setGiveaways([]);
    setView('list');
    setActiveGiveaway(null);
    setEditing(null);
  };

  const startCreate = () => {
    setEditing(null);
    const now = new Date();
    const oneWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    setForm({
      ...emptyForm,
      start_date: toLocalInput(now),
      end_date: toLocalInput(oneWeek),
    });
    setFormError(null);
    setView('edit');
  };

  const startEdit = (g: Giveaway) => {
    setEditing(g);
    setForm({
      slug: g.slug,
      title: g.title,
      description: g.description || '',
      prize_description: g.prize_description || '',
      social_post_url: g.social_post_url || '',
      start_date: toLocalInput(new Date(g.start_date)),
      end_date: toLocalInput(new Date(g.end_date)),
      active: g.active,
    });
    setFormError(null);
    setView('edit');
  };

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSaving(true);
    try {
      const payload = {
        slug: form.slug.trim().toLowerCase(),
        title: form.title.trim(),
        description: form.description.trim(),
        prize_description: form.prize_description.trim(),
        social_post_url: form.social_post_url.trim(),
        start_date: new Date(form.start_date).toISOString(),
        end_date: new Date(form.end_date).toISOString(),
        active: form.active,
      };

      if (editing) {
        await callApi({ action: 'update_giveaway', id: editing.id, data: payload });
      } else {
        await callApi({ action: 'create_giveaway', data: payload });
      }

      setView('list');
      setEditing(null);
      await loadGiveaways();
    } catch (err) {
      if (err instanceof Error && err.message !== 'unauthorized') {
        setFormError(err.message);
      }
    } finally {
      setFormSaving(false);
    }
  };

  const handleDelete = async (g: Giveaway) => {
    if (!confirm(`Delete "${g.title}" and all its entries? This cannot be undone.`)) return;
    try {
      await callApi({ action: 'delete_giveaway', id: g.id });
      await loadGiveaways();
    } catch (err) {
      if (err instanceof Error && err.message !== 'unauthorized') {
        setGlobalError(err.message);
      }
    }
  };

  const openEntries = async (g: GiveawayWithCount) => {
    setActiveGiveaway(g);
    setView('entries');
    setEntries([]);
    setWinner(null);
    setEntriesLoading(true);
    try {
      const json = await callApi({ action: 'list_entries', giveaway_id: g.id });
      const list: GiveawayEntry[] = json.entries || [];
      setEntries(list);
      const existingWinner = list.find((e) => e.is_winner);
      if (existingWinner) setWinner(existingWinner);
    } catch (err) {
      if (err instanceof Error && err.message !== 'unauthorized') {
        setGlobalError(err.message);
      }
    } finally {
      setEntriesLoading(false);
    }
  };

  const pickWinner = async () => {
    if (!activeGiveaway || entries.length === 0 || isSpinning) return;
    setIsSpinning(true);
    setWinner(null);

    let iterations = 0;
    const totalIterations = 25;
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * entries.length);
      setSpinningName(entries[idx].name);
      iterations++;
      if (iterations >= totalIterations) clearInterval(interval);
    }, 100);

    try {
      const json = await callApi({
        action: 'select_winner',
        giveaway_id: activeGiveaway.id,
      });
      // Wait for the visual spin to finish
      await new Promise((r) => setTimeout(r, totalIterations * 100));
      setWinner(json.winner);
      setSpinningName('');
      // Refresh entries to reflect winner state
      const refreshed = await callApi({
        action: 'list_entries',
        giveaway_id: activeGiveaway.id,
      });
      setEntries(refreshed.entries || []);
    } catch (err) {
      if (err instanceof Error && err.message !== 'unauthorized') {
        setGlobalError(err.message);
      }
    } finally {
      setIsSpinning(false);
    }
  };

  const clearWinner = async () => {
    if (!activeGiveaway) return;
    if (!confirm('Clear the current winner?')) return;
    try {
      await callApi({ action: 'clear_winner', giveaway_id: activeGiveaway.id });
      setWinner(null);
      const refreshed = await callApi({
        action: 'list_entries',
        giveaway_id: activeGiveaway.id,
      });
      setEntries(refreshed.entries || []);
    } catch (err) {
      if (err instanceof Error && err.message !== 'unauthorized') {
        setGlobalError(err.message);
      }
    }
  };

  const exportCsv = () => {
    if (!activeGiveaway || entries.length === 0) return;
    const header = [
      'Name', 'Email', 'Phone', 'Address', 'City', 'State', 'ZIP',
      'Used Service', 'Has App', 'Knows Apple Music', 'Knows Spotify',
      'Winner', 'Entered At',
    ];
    const rows = entries.map((e) => [
      e.name,
      e.email,
      e.phone,
      [e.address_line1, e.address_line2].filter(Boolean).join(' '),
      e.city,
      e.state,
      e.zip,
      e.has_used_service ? 'Yes' : 'No',
      e.has_app === null ? 'N/A' : e.has_app ? 'Yes' : 'No',
      e.knows_apple_music ? 'Yes' : 'No',
      e.knows_spotify ? 'Yes' : 'No',
      e.is_winner ? 'Yes' : 'No',
      e.created_at,
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `giveaway-${activeGiveaway.slug}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyShareLink = async (slug: string) => {
    const url = `${window.location.origin}/giveaways/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      alert(`Link copied:\n${url}`);
    } catch {
      prompt('Copy this link:', url);
    }
  };

  // ---------------- Render ----------------

  if (!authed) {
    return (
      <main className="min-h-screen bg-neutral-50 dark:bg-dark-bg-primary flex items-center justify-center p-4">
        <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl p-8 max-w-md w-full border border-neutral-200 dark:border-dark-border">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Giveaway Admin
            </h1>
            <p className="text-lrp-text-secondary dark:text-dark-text-secondary mt-2">
              Enter the admin password to manage giveaways
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                required
                autoFocus
                className="w-full px-4 py-3 border border-neutral-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-neutral-900 dark:text-white bg-white dark:bg-dark-bg-primary"
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
              disabled={authLoading || !pwd}
              className="w-full bg-primary hover:bg-primary-dark text-lrp-black font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authLoading ? 'Verifying...' : 'Access Admin'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg-primary">
      <header className="bg-gradient-to-r from-primary to-primary-dark text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center gap-4 flex-wrap">
          <div>
            <h1 className="font-boardson text-3xl font-bold">Giveaways Admin</h1>
            <p className="text-white/90 text-sm">
              {giveaways.length} {giveaways.length === 1 ? 'campaign' : 'campaigns'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {view !== 'list' && (
              <button
                onClick={() => {
                  setView('list');
                  setEditing(null);
                  setActiveGiveaway(null);
                }}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm transition-colors"
              >
                Back to list
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {globalError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800">
            {globalError}
          </div>
        )}

        {view === 'list' && (
          <ListView
            giveaways={giveaways}
            loading={loading}
            onCreate={startCreate}
            onEdit={startEdit}
            onDelete={handleDelete}
            onViewEntries={openEntries}
            onCopyLink={copyShareLink}
          />
        )}

        {view === 'edit' && (
          <EditView
            editing={editing}
            form={form}
            setForm={setForm}
            onSubmit={submitForm}
            onCancel={() => {
              setView('list');
              setEditing(null);
            }}
            saving={formSaving}
            error={formError}
          />
        )}

        {view === 'entries' && activeGiveaway && (
          <EntriesView
            giveaway={activeGiveaway}
            entries={entries}
            loading={entriesLoading}
            winner={winner}
            isSpinning={isSpinning}
            spinningName={spinningName}
            onPickWinner={pickWinner}
            onClearWinner={clearWinner}
            onExportCsv={exportCsv}
          />
        )}
      </main>
    </div>
  );
}

// ---------------- Subviews ----------------

function ListView({
  giveaways,
  loading,
  onCreate,
  onEdit,
  onDelete,
  onViewEntries,
  onCopyLink,
}: {
  giveaways: GiveawayWithCount[];
  loading: boolean;
  onCreate: () => void;
  onEdit: (g: Giveaway) => void;
  onDelete: (g: Giveaway) => void;
  onViewEntries: (g: GiveawayWithCount) => void;
  onCopyLink: (slug: string) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
          All Giveaways
        </h2>
        <button
          onClick={onCreate}
          className="bg-primary hover:bg-primary-dark text-lrp-black font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          + New Giveaway
        </button>
      </div>

      {loading ? (
        <p className="text-lrp-text-secondary dark:text-dark-text-secondary">Loading...</p>
      ) : giveaways.length === 0 ? (
        <div className="bg-white dark:bg-dark-bg-secondary rounded-lg p-12 text-center border border-neutral-200 dark:border-dark-border">
          <p className="text-lrp-text-secondary dark:text-dark-text-secondary mb-4">
            No giveaways yet. Create your first one to get started.
          </p>
          <button
            onClick={onCreate}
            className="bg-primary hover:bg-primary-dark text-lrp-black font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            + New Giveaway
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {giveaways.map((g) => {
            const status = computeStatus(g);
            return (
              <div
                key={g.id}
                className="bg-white dark:bg-dark-bg-secondary rounded-lg border border-neutral-200 dark:border-dark-border p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white truncate">
                      {g.title}
                    </h3>
                    <StatusBadge status={status} />
                    {!g.active && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-200 dark:bg-dark-border text-neutral-700 dark:text-dark-text-secondary">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-lrp-text-secondary dark:text-dark-text-secondary">
                    /{g.slug} &middot; {g.entry_count}{' '}
                    {g.entry_count === 1 ? 'entry' : 'entries'}
                  </p>
                  <p className="text-xs text-lrp-text-secondary dark:text-dark-text-secondary mt-1">
                    {formatDate(g.start_date)} &mdash; {formatDate(g.end_date)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                  <button
                    onClick={() => onCopyLink(g.slug)}
                    className="px-3 py-1.5 text-xs font-medium bg-neutral-100 dark:bg-dark-bg-primary hover:bg-neutral-200 dark:hover:bg-dark-border text-neutral-700 dark:text-dark-text-primary rounded-md transition-colors"
                  >
                    Copy link
                  </button>
                  <button
                    onClick={() => onViewEntries(g)}
                    className="px-3 py-1.5 text-xs font-medium bg-primary hover:bg-primary-dark text-lrp-black rounded-md transition-colors"
                  >
                    Entries
                  </button>
                  <button
                    onClick={() => onEdit(g)}
                    className="px-3 py-1.5 text-xs font-medium bg-neutral-100 dark:bg-dark-bg-primary hover:bg-neutral-200 dark:hover:bg-dark-border text-neutral-700 dark:text-dark-text-primary rounded-md transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(g)}
                    className="px-3 py-1.5 text-xs font-medium bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300 rounded-md transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EditView({
  editing,
  form,
  setForm,
  onSubmit,
  onCancel,
  saving,
  error,
}: {
  editing: Giveaway | null;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
  saving: boolean;
  error: string | null;
}) {
  const inputCls =
    'w-full px-4 py-3 border border-neutral-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-neutral-900 dark:text-white bg-white dark:bg-dark-bg-primary';

  return (
    <div className="bg-white dark:bg-dark-bg-secondary rounded-lg border border-neutral-200 dark:border-dark-border p-6 max-w-2xl">
      <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
        {editing ? 'Edit Giveaway' : 'New Giveaway'}
      </h2>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
            Title *
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Concert Tickets Giveaway"
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
            URL Slug *
          </label>
          <input
            type="text"
            required
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="concert-tickets-2026"
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            className={inputCls}
          />
          <p className="text-xs text-lrp-text-secondary dark:text-dark-text-secondary mt-1">
            Public URL will be /giveaways/{form.slug || 'your-slug'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
            Prize / Tagline
          </label>
          <input
            type="text"
            value={form.prize_description}
            onChange={(e) => setForm((f) => ({ ...f, prize_description: e.target.value }))}
            placeholder="2 tickets to the show"
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
            Description
          </label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Details, rules, how the winner will be picked..."
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
            Social Post URL (the post they should like)
          </label>
          <input
            type="url"
            value={form.social_post_url}
            onChange={(e) => setForm((f) => ({ ...f, social_post_url: e.target.value }))}
            placeholder="https://www.facebook.com/..."
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              Start Date *
            </label>
            <input
              type="datetime-local"
              required
              value={form.start_date}
              onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              End Date *
            </label>
            <input
              type="datetime-local"
              required
              value={form.end_date}
              onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
              className={inputCls}
            />
          </div>
        </div>

        <label className="flex items-center gap-3 text-neutral-900 dark:text-white">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
            className="h-4 w-4 text-primary focus:ring-primary"
          />
          Active (accepting entries)
        </label>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary hover:bg-primary-dark text-lrp-black font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Giveaway'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-neutral-100 dark:bg-dark-bg-primary hover:bg-neutral-200 dark:hover:bg-dark-border text-neutral-700 dark:text-dark-text-primary font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function EntriesView({
  giveaway,
  entries,
  loading,
  winner,
  isSpinning,
  spinningName,
  onPickWinner,
  onClearWinner,
  onExportCsv,
}: {
  giveaway: GiveawayWithCount;
  entries: GiveawayEntry[];
  loading: boolean;
  winner: GiveawayEntry | null;
  isSpinning: boolean;
  spinningName: string;
  onPickWinner: () => void;
  onClearWinner: () => void;
  onExportCsv: () => void;
}) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{giveaway.title}</h2>
        <p className="text-sm text-lrp-text-secondary dark:text-dark-text-secondary">
          /{giveaway.slug} &middot; {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </p>
      </div>

      <section className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-lg p-6 mb-6 border border-neutral-200 dark:border-dark-border">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
          Random Winner
        </h3>

        {entries.length === 0 ? (
          <p className="text-lrp-text-secondary dark:text-dark-text-secondary">
            No entries yet.
          </p>
        ) : (
          <div className="text-center">
            {isSpinning && (
              <div className="mb-4">
                <div className="text-3xl font-bold text-primary animate-pulse py-8 bg-neutral-100 dark:bg-dark-bg-primary rounded-lg">
                  {spinningName || '...'}
                </div>
              </div>
            )}

            {winner && !isSpinning && (
              <div className="mb-4 p-6 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-lg border-2 border-primary">
                <p className="text-sm text-primary font-semibold mb-2">WINNER!</p>
                <p className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                  {winner.name}
                </p>
                <p className="text-lrp-text-secondary dark:text-dark-text-secondary">
                  {winner.email} &middot; {winner.phone}
                </p>
                <p className="text-sm text-lrp-text-secondary dark:text-dark-text-secondary mt-1">
                  {winner.address_line1}
                  {winner.address_line2 ? `, ${winner.address_line2}` : ''}, {winner.city}, {winner.state} {winner.zip}
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={onPickWinner}
                disabled={isSpinning || entries.length === 0}
                className="bg-primary hover:bg-primary-dark text-lrp-black font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                {isSpinning ? 'Selecting...' : winner ? 'Pick Another Winner' : 'Pick Random Winner'}
              </button>
              {winner && !isSpinning && (
                <button
                  onClick={onClearWinner}
                  className="bg-neutral-100 dark:bg-dark-bg-primary hover:bg-neutral-200 dark:hover:bg-dark-border text-neutral-700 dark:text-dark-text-primary font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Clear Winner
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      <section className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-lg border border-neutral-200 dark:border-dark-border overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-dark-border flex justify-between items-center">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">All Entries</h3>
          {entries.length > 0 && (
            <button
              onClick={onExportCsv}
              className="text-sm font-medium px-3 py-1.5 bg-neutral-100 dark:bg-dark-bg-primary hover:bg-neutral-200 dark:hover:bg-dark-border text-neutral-700 dark:text-dark-text-primary rounded-md"
            >
              Export CSV
            </button>
          )}
        </div>

        {loading ? (
          <div className="p-6 text-center text-lrp-text-secondary dark:text-dark-text-secondary">
            Loading...
          </div>
        ) : entries.length === 0 ? (
          <div className="p-6 text-center text-lrp-text-secondary dark:text-dark-text-secondary">
            No entries yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-100 dark:bg-dark-bg-primary text-xs uppercase tracking-wider text-neutral-600 dark:text-dark-text-secondary">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Address</th>
                  <th className="px-4 py-3 text-left">Used</th>
                  <th className="px-4 py-3 text-left">App</th>
                  <th className="px-4 py-3 text-left">AM</th>
                  <th className="px-4 py-3 text-left">SP</th>
                  <th className="px-4 py-3 text-left">Entered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-dark-border">
                {entries.map((e, idx) => (
                  <tr
                    key={e.id}
                    className={`hover:bg-neutral-50 dark:hover:bg-dark-bg-primary ${
                      e.is_winner ? 'bg-primary/10 dark:bg-primary/20' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-neutral-500 dark:text-dark-text-secondary">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-neutral-900 dark:text-white whitespace-nowrap">
                      {e.name}
                      {e.is_winner && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary text-lrp-black">
                          Winner
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <a href={`mailto:${e.email}`} className="text-primary hover:text-primary-dark">
                        {e.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <a
                        href={`tel:${e.phone.replace(/\D/g, '')}`}
                        className="text-primary hover:text-primary-dark"
                      >
                        {formatPhone(e.phone)}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-neutral-600 dark:text-dark-text-secondary">
                      {e.address_line1}
                      {e.address_line2 ? ` ${e.address_line2}` : ''}, {e.city}, {e.state} {e.zip}
                    </td>
                    <td className="px-4 py-3">{e.has_used_service ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3">
                      {e.has_app === null ? '—' : e.has_app ? 'Yes' : 'No'}
                    </td>
                    <td className="px-4 py-3">{e.knows_apple_music ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3">{e.knows_spotify ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-neutral-500 dark:text-dark-text-secondary">
                      {formatDate(e.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function StatusBadge({ status }: { status: 'upcoming' | 'open' | 'closed' }) {
  const styles = {
    upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
    open: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
    closed: 'bg-neutral-200 text-neutral-700 dark:bg-dark-border dark:text-dark-text-secondary',
  };
  const labels = { upcoming: 'Upcoming', open: 'Open', closed: 'Closed' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

// ---------------- Helpers ----------------

function computeStatus(g: Giveaway): 'upcoming' | 'open' | 'closed' {
  const now = Date.now();
  if (now < new Date(g.start_date).getTime()) return 'upcoming';
  if (now > new Date(g.end_date).getTime()) return 'closed';
  return 'open';
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

// Convert a Date into a value for an <input type="datetime-local">
function toLocalInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
