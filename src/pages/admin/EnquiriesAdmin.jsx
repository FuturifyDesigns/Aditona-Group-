import { useCallback, useEffect, useState } from 'react'
import { deleteEnquiry, listEnquiries, updateEnquiry } from '../../lib/supabase'
import { buildReplyDraft, sendClientReply } from '../../lib/notifyEmail'

const STATUSES = ['new', 'contacted', 'quoted', 'follow_up', 'won', 'lost', 'closed']

const STATUS_LABELS = {
  new: 'New',
  contacted: 'Contacted',
  quoted: 'Quoted',
  follow_up: 'Follow-up',
  won: 'Won',
  lost: 'Lost',
  closed: 'Closed',
}

const emptyDraft = {
  status: 'new',
  follow_up_date: '',
  quotation_sent: false,
  converted: false,
  notes: '',
}

function formatWhen(value) {
  if (!value) return { date: '—', time: '' }
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return { date: '—', time: '' }
  return {
    date: d.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    time: d.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }
}

function formatFollowUp(value) {
  if (!value) return '—'
  const d = new Date(`${String(value).slice(0, 10)}T12:00:00`)
  if (Number.isNaN(d.getTime())) return String(value).slice(0, 10)
  return d.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
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
  const [replying, setReplying] = useState(false)
  const [replySending, setReplySending] = useState(false)
  const [replyStatus, setReplyStatus] = useState('')
  const [replyDraft, setReplyDraft] = useState({ to: '', subject: '', body: '' })

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
    setReplying(false)
    setReplyStatus('')
    setDraft({
      status: row.status || 'new',
      follow_up_date: row.follow_up_date ? String(row.follow_up_date).slice(0, 10) : '',
      quotation_sent: Boolean(row.quotation_sent),
      converted: Boolean(row.converted),
      notes: row.notes || '',
    })
  }

  const startReply = (row) => {
    setEditing(row)
    setReplying(true)
    setReplyStatus('')
    setReplyDraft(buildReplyDraft(row, noun))
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

  const removeRow = async (row) => {
    const label = row.full_name || row.email || noun
    if (!window.confirm(`Delete this ${noun} from ${label}? This cannot be undone.`)) return
    setError('')
    try {
      await deleteEnquiry(row.id)
      if (editing?.id === row.id) setEditing(null)
      await load()
    } catch (err) {
      setError(err.message || 'Delete failed')
    }
  }

  const removeEditing = async () => {
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

  const sendReply = async () => {
    if (!editing?.email) return
    setReplySending(true)
    setReplyStatus('')
    try {
      await sendClientReply({
        to: replyDraft.to || editing.email,
        client_name: editing.full_name,
        subject: replyDraft.subject,
        body: replyDraft.body,
      })
      if ((editing.status || 'new') === 'new') {
        await updateEnquiry(editing.id, { status: 'contacted' })
        setDraft((d) => ({ ...d, status: 'contacted' }))
        setEditing((e) => (e ? { ...e, status: 'contacted' } : e))
      }
      setReplyStatus('Sent from enquiries@aditona.com')
      setReplying(false)
      await load()
    } catch (err) {
      setReplyStatus(err.message || 'Failed to send reply')
    } finally {
      setReplySending(false)
    }
  }

  if (loading) return <p className="admin-muted">Loading {nounPlural}…</p>

  const newCount = rows.filter((r) => (r.status || 'new') === 'new').length
  const colCount = isQuotes ? 6 : 7

  return (
    <div className="admin-panel">
      <div className="admin-help">
        <strong>How to use this page</strong>
        <p>
          {isQuotes
            ? 'Quote requests from the website. Reply sends from enquiries@aditona.com via Brevo — clients will not see a Gmail address.'
            : 'Enquiry and contact messages. Reply sends from enquiries@aditona.com via Brevo.'}
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
              <th>Received</th>
              {!isQuotes && <th>Type</th>}
              <th>Client</th>
              <th>Division</th>
              <th>Status</th>
              <th>Follow-up</th>
              <th className="admin-th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={colCount} className="admin-muted">
                  No {nounPlural} yet.
                </td>
              </tr>
            )}
            {rows.map((row) => {
              const when = formatWhen(row.created_at)
              const status = row.status || 'new'
              return (
                <tr key={row.id}>
                  <td className="admin-cell-when">
                    <span className="admin-when-date">{when.date}</span>
                    {when.time ? <span className="admin-when-time">{when.time}</span> : null}
                  </td>
                  {!isQuotes && (
                    <td>
                      <span className="admin-type-pill">{row.form_type || '—'}</span>
                    </td>
                  )}
                  <td className="admin-cell-client">
                    <strong>{row.full_name || '—'}</strong>
                    {row.email ? (
                      <a className="admin-email-link" href={`mailto:${row.email}`}>
                        {row.email}
                      </a>
                    ) : null}
                    {row.service ? <span className="admin-meta-line">{row.service}</span> : null}
                  </td>
                  <td>{row.division || '—'}</td>
                  <td>
                    <span className={`admin-status status-${status}`}>
                      {STATUS_LABELS[status] || status}
                    </span>
                  </td>
                  <td className="admin-cell-follow">{formatFollowUp(row.follow_up_date)}</td>
                  <td className="admin-row-actions">
                    {row.email ? (
                      <button
                        type="button"
                        className="admin-btn admin-btn-solid"
                        onClick={() => startReply(row)}
                      >
                        Reply
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost"
                      onClick={() => openEdit(row)}
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-danger"
                      onClick={() => removeRow(row)}
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

      {editing && (
        <div className="cms-popover-backdrop" onClick={() => setEditing(null)}>
          <div
            className="cms-popover cms-popover--sheet admin-edit-drawer"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-drawer-title"
          >
            <div className="cms-popover-scroll">
              <div className="admin-drawer-head">
                <p className="admin-drawer-kicker">
                  {replying ? `Reply to ${noun}` : `Update ${noun}`}
                </p>
                <h2 id="admin-drawer-title">{editing.full_name || 'Untitled'}</h2>
                <p className="admin-muted admin-drawer-meta">
                  {editing.email}
                  {editing.phone ? ` · ${editing.phone}` : ''}
                  {editing.service ? ` · ${editing.service}` : ''}
                  {editing.division ? ` · ${editing.division}` : ''}
                </p>
                {!replying && editing.email ? (
                  <button
                    type="button"
                    className="admin-btn admin-btn-solid admin-reply-cta"
                    onClick={() => startReply(editing)}
                  >
                    Reply from enquiries@aditona.com
                  </button>
                ) : null}
              </div>

              {replying ? (
                <div className="admin-reply-box">
                  <p className="admin-muted">
                    Sends as <strong>enquiries@aditona.com</strong> via Brevo — not Gmail.
                  </p>
                  <label className="cms-field">
                    <span>To</span>
                    <input
                      value={replyDraft.to}
                      onChange={(e) => setReplyDraft((d) => ({ ...d, to: e.target.value }))}
                    />
                  </label>
                  <label className="cms-field">
                    <span>Subject</span>
                    <input
                      value={replyDraft.subject}
                      onChange={(e) => setReplyDraft((d) => ({ ...d, subject: e.target.value }))}
                    />
                  </label>
                  <label className="cms-field">
                    <span>Message</span>
                    <textarea
                      rows={10}
                      value={replyDraft.body}
                      onChange={(e) => setReplyDraft((d) => ({ ...d, body: e.target.value }))}
                    />
                  </label>
                  {replyStatus ? (
                    <p
                      className={`form-msg ${replyStatus.startsWith('Sent') ? 'ok' : 'err'}`}
                      role="status"
                    >
                      {replyStatus}
                    </p>
                  ) : null}
                </div>
              ) : (
                <>
                  {editing.message && (
                    <blockquote className="admin-quote">{editing.message}</blockquote>
                  )}
                  {replyStatus ? (
                    <p className="form-msg ok" role="status">
                      {replyStatus}
                    </p>
                  ) : null}
                  <div className="admin-drawer-grid">
                    <label className="cms-field">
                      <span>Status</span>
                      <select
                        value={draft.status}
                        onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s] || s}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="cms-field">
                      <span>Follow-up date</span>
                      <input
                        type="date"
                        value={draft.follow_up_date}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, follow_up_date: e.target.value }))
                        }
                      />
                    </label>
                  </div>
                  <div className="admin-drawer-checks">
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
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, converted: e.target.checked }))
                        }
                      />
                      Converted
                    </label>
                  </div>
                  <label className="cms-field">
                    <span>Notes</span>
                    <textarea
                      rows={4}
                      value={draft.notes}
                      onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
                    />
                  </label>
                </>
              )}
            </div>
            <div className="cms-popover-footer admin-drawer-actions">
              {replying ? (
                <>
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost"
                    onClick={() => setReplying(false)}
                    disabled={replySending}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-solid"
                    disabled={replySending}
                    onClick={sendReply}
                  >
                    {replySending ? 'Sending…' : 'Send reply'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger"
                    disabled={deleting || saving}
                    onClick={removeEditing}
                  >
                    {deleting ? 'Deleting…' : 'Delete'}
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost"
                    onClick={() => setEditing(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-solid"
                    disabled={saving || deleting}
                    onClick={save}
                  >
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
