import { useCallback, useEffect, useState } from 'react'
import {
  deleteTestimonial,
  listAllTestimonials,
  updateTestimonial,
} from '../../lib/supabase'

function formatWhen(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function TestimonialsAdmin() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setRows(await listAllTestimonials())
    } catch (err) {
      setError(
        err.message ||
          'Failed to load testimonials. Run supabase/testimonials.sql in the SQL Editor if the table is missing.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const setHidden = async (row, is_hidden) => {
    setBusyId(row.id)
    setError('')
    try {
      await updateTestimonial(row.id, { is_hidden })
      await load()
    } catch (err) {
      setError(err.message || 'Update failed')
    } finally {
      setBusyId('')
    }
  }

  const remove = async (row) => {
    const label = row.full_name || 'this review'
    if (!window.confirm(`Delete the review from ${label}? This cannot be undone.`)) return
    setBusyId(row.id)
    setError('')
    try {
      await deleteTestimonial(row.id)
      await load()
    } catch (err) {
      setError(err.message || 'Delete failed')
    } finally {
      setBusyId('')
    }
  }

  if (loading) return <p className="admin-muted">Loading testimonials…</p>

  const visible = rows.filter((r) => !r.is_hidden).length
  const hidden = rows.length - visible

  return (
    <div className="admin-panel">
      <div className="admin-help">
        <strong>How to use this page</strong>
        <p>
          Client reviews posted on the homepage appear here. Hide a review to take it off the
          site without deleting it, or delete it permanently.
        </p>
      </div>

      <div className="admin-stats">
        <div className="admin-stat">
          <span>{rows.length}</span>
          <p>Total reviews</p>
        </div>
        <div className="admin-stat">
          <span>{visible}</span>
          <p>Visible on site</p>
        </div>
        <div className="admin-stat">
          <span>{hidden}</span>
          <p>Hidden</p>
        </div>
      </div>

      <div className="admin-panel-head">
        <h2>Client testimonials</h2>
        <button type="button" className="admin-btn admin-btn-ghost" onClick={load}>
          Refresh
        </button>
      </div>

      {error && (
        <p className="form-msg err" role="alert">
          {error}
        </p>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table admin-table--inbox">
          <thead>
            <tr>
              <th>Posted</th>
              <th>Client</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Status</th>
              <th className="admin-th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="admin-muted">
                  No testimonials yet.
                </td>
              </tr>
            )}
            {rows.map((row) => {
              const busy = busyId === row.id
              return (
                <tr key={row.id} className={row.is_hidden ? 'is-muted-row' : ''}>
                  <td className="admin-cell-when">
                    <span className="admin-when-date">{formatWhen(row.created_at)}</span>
                  </td>
                  <td className="admin-cell-client">
                    <strong>{row.full_name}</strong>
                    {row.company ? <span className="admin-meta-line">{row.company}</span> : null}
                    {row.email ? (
                      <a className="admin-email-link" href={`mailto:${row.email}`}>
                        {row.email}
                      </a>
                    ) : null}
                  </td>
                  <td>
                    <span className="admin-rating" aria-label={`${row.rating} of 5`}>
                      {'★'.repeat(row.rating || 0)}
                      <span className="admin-rating-empty">
                        {'★'.repeat(Math.max(0, 5 - (row.rating || 0)))}
                      </span>
                    </span>
                  </td>
                  <td className="admin-cell-review">{row.message}</td>
                  <td>
                    <span
                      className={`admin-status ${row.is_hidden ? 'status-closed' : 'status-won'}`}
                    >
                      {row.is_hidden ? 'Hidden' : 'Visible'}
                    </span>
                  </td>
                  <td className="admin-row-actions">
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost"
                      disabled={busy}
                      onClick={() => setHidden(row, !row.is_hidden)}
                    >
                      {row.is_hidden ? 'Show' : 'Hide'}
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-danger"
                      disabled={busy}
                      onClick={() => remove(row)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
