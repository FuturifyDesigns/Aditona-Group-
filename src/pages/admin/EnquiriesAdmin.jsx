import { useCallback, useEffect, useState } from 'react'
import { deleteEnquiry, listEnquiries, updateEnquiry } from '../../lib/supabase'

const STATUSES = ['new', 'contacted', 'quoted', 'follow_up', 'won', 'lost', 'closed']

const emptyDraft = {
  status: 'new',
  follow_up_date: '',
  quotation_sent: false,
  converted: false,
  notes: '',
}

/**
 * Shared inbox UI.
 * @param {'enquiries' | 'quotes'} mode
 */
export default function EnquiriesAdmin({ mode = 'enquiries' }) {
  const isQuotes = mode === 'quotes'
  const noun = isQuotes ? 'quote' : 'enquiry'
  const nounPlural = isQuotes ? 'quotes' : 'enquiries'

  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState(emptyDraft)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setRows(
        await listEnquiries({
          formTypes: isQuotes ? ['quote'] : ['enquiry', 'contact'],
        }),
      )
    } catch (err) {
      setError(err.message || `Failed to load ${nounPlural}`)
    } finally {
      setLoading(false)
    }
  }, [isQuotes, nounPlural])

  useEffect(() => {
    load()
  }, [load])

  const openEdit = (row) => {
    setEditing(row)
    setDraft({
      status: row.status || 'new',
      follow_up_date: row.follow_up_date ? String(row.follow_up_date).slice(0, 10) : '',
      quotation_sent: Boolean(row.quotation_sent),
      converted: Boolean(row.converted),
      notes: row.notes || '',
    })
  }

  const save = async () => {
    if (!editing) return
    setSaving(true)
    setError('')
    try {
      await updateEnquiry(editing.id, {
        status: draft.status,
        follow_up_date: draft.follow_up_date || null,
        quotation_sent: draft.quotation_sent,
        converted: draft.converted,
        notes: draft.notes || null,
      })
      setEditing(null)
      await load()
    } catch (err) {
      setError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!editing) return
    const label = editing.full_name || editing.email || noun
    if (!window.confirm(`Delete this ${noun} from ${label}? This cannot be undone.`)) return
    setDeleting(true)
    setError('')
    try {
      await deleteEnquiry(editing.id)
      setEditing(null)
      await load()
    } catch (err) {
      setError(err.message || 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <p className="admin-muted">Loading {nounPlural}…</p>

  const newCount = rows.filter((r) => (r.status || 'new') === 'new').length

  return (
    <div className="admin-panel">
      <div className="admin-help">
        <strong>How to use this page</strong>
        <p>
          {isQuotes
            ? 'Quote requests from /request-quote appear here. New submissions are emailed to enquiries@aditona.com and listed below — open to update status or delete.'
            : 'Enquiries and contact messages appear here. Quote requests are under Quotes. Open a row to update status or delete it.'}
        </p>
      </div>

      <div className="admin-stats">
        <div className="admin-stat">
          <span>{rows.length}</span>
          <p>Total {nounPlural}</p>
        </div>
        <div className="admin-stat">
          <span>{newCount}</span>
          <p>Needs attention</p>
        </div>
      </div>

      <div className="admin-panel-head">
        <h2>{isQuotes ? 'Quote requests' : 'Enquiries & contact'}</h2>
        <button type="button" className="btn btn-soft" onClick={load}>
          Refresh
        </button>
      </div>
      {error && (
        <p className="form-msg err" role="alert">
          {error}
        </p>
      )}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Name</th>
              <th>Email</th>
              <th>Division</th>
              <th>Status</th>
              <th>Follow-up</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="admin-muted">
                  No {nounPlural} yet.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.created_at ? new Date(row.created_at).toLocaleString() : '—'}</td>
                <td>{row.form_type || '—'}</td>
                <td>{row.full_name}</td>
                <td>
                  <a href={`mailto:${row.email}`}>{row.email}</a>
                </td>
                <td>{row.division || '—'}</td>
                <td>
                  <span className={`admin-status status-${row.status || 'new'}`}>
                    {row.status || 'new'}
                  </span>
                </td>
                <td>{row.follow_up_date || '—'}</td>
                <td className="admin-row-actions">
                  <button type="button" className="btn btn-soft" onClick={() => openEdit(row)}>
                    Open
                  </button>
                  <button
                    type="button"
                    className="btn btn-soft cms-btn-danger"
                    onClick={async () => {
                      const label = row.full_name || row.email || noun
                      if (
                        !window.confirm(
                          `Delete this ${noun} from ${label}? This cannot be undone.`,
                        )
                      ) {
                        return
                      }
                      setError('')
                      try {
                        await deleteEnquiry(row.id)
                        if (editing?.id === row.id) setEditing(null)
                        await load()
                      } catch (err) {
                        setError(err.message || 'Delete failed')
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="cms-popover-backdrop" onClick={() => setEditing(null)}>
          <div className="cms-popover admin-edit-drawer" onClick={(e) => e.stopPropagation()}>
            <h2>Update {noun}</h2>
            <p className="admin-muted">
              {editing.full_name} · {editing.email}
              {editing.service ? ` · ${editing.service}` : ''}
            </p>
            {editing.message && (
              <blockquote className="admin-quote">{editing.message}</blockquote>
            )}
            <label className="cms-field">
              <span>Status</span>
              <select
                value={draft.status}
                onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="cms-field">
              <span>Follow-up date</span>
              <input
                type="date"
                value={draft.follow_up_date}
                onChange={(e) => setDraft((d) => ({ ...d, follow_up_date: e.target.value }))}
              />
            </label>
            <label className="cms-check">
              <input
                type="checkbox"
                checked={draft.quotation_sent}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, quotation_sent: e.target.checked }))
                }
              />
              Quotation sent
            </label>
            <label className="cms-check">
              <input
                type="checkbox"
                checked={draft.converted}
                onChange={(e) => setDraft((d) => ({ ...d, converted: e.target.checked }))}
              />
              Converted
            </label>
            <label className="cms-field">
              <span>Notes</span>
              <textarea
                rows={4}
                value={draft.notes}
                onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
              />
            </label>
            <div className="cms-popover-actions">
              <button
                type="button"
                className="btn btn-soft cms-btn-danger"
                disabled={deleting || saving}
                onClick={remove}
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
              <button type="button" className="btn btn-soft" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" disabled={saving || deleting} onClick={save}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
