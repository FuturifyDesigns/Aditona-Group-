import { useCallback, useEffect, useState } from 'react'
import {
  deleteProject,
  listProjects,
  uploadMedia,
  upsertProject,
} from '../../lib/supabase'

const blank = {
  title: '',
  summary: '',
  image_url: '',
  division: '',
  sort_order: 0,
  published: true,
}

export default function ProjectsAdmin() {
  const [rows, setRows] = useState([])
  const [form, setForm] = useState(blank)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setRows(await listProjects())
    } catch (err) {
      setError(err.message || 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const resetForm = () => {
    setForm(blank)
    setEditingId(null)
  }

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({
      ...f,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }))
  }

  const onImage = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const url = await uploadMedia(file, 'projects')
      setForm((f) => ({ ...f, image_url: url }))
    } catch (err) {
      setError(err.message || 'Upload failed')
    }
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, sort_order: Number(form.sort_order) || 0 }
      if (editingId) payload.id = editingId
      await upsertProject(payload)
      resetForm()
      await load()
    } catch (err) {
      setError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const edit = (row) => {
    setEditingId(row.id)
    setForm({
      title: row.title || '',
      summary: row.summary || row.body || '',
      image_url: row.image_url || '',
      division: row.division || '',
      sort_order: row.sort_order ?? 0,
      published: row.published !== false,
    })
  }

  const remove = async (id) => {
    if (!confirm('Delete this project?')) return
    try {
      await deleteProject(id)
      await load()
    } catch (err) {
      setError(err.message || 'Delete failed')
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-help">
        <strong>How to use this page</strong>
        <p>
          Add portfolio projects with a title, short summary, and image. These can
          power the Work page when connected in the CMS.
        </p>
      </div>

      <div className="admin-panel-head">
        <h2>Projects</h2>
        <button type="button" className="btn btn-soft" onClick={load}>
          Refresh
        </button>
      </div>
      {error && (
        <p className="form-msg err" role="alert">
          {error}
        </p>
      )}

      <form className="admin-card-form" onSubmit={save}>
        <h2>{editingId ? 'Edit project' : 'Add project'}</h2>
        <div className="admin-form-grid">
          <label className="cms-field">
            <span>Title</span>
            <input name="title" value={form.title} onChange={onChange} required />
          </label>
          <label className="cms-field">
            <span>Division</span>
            <input name="division" value={form.division} onChange={onChange} />
          </label>
          <label className="cms-field" style={{ gridColumn: '1 / -1' }}>
            <span>Summary</span>
            <textarea name="summary" rows={3} value={form.summary} onChange={onChange} />
          </label>
          <label className="cms-field">
            <span>Image URL</span>
            <input name="image_url" value={form.image_url} onChange={onChange} />
          </label>
          <label className="cms-field">
            <span>Upload</span>
            <input type="file" accept="image/*" onChange={onImage} />
          </label>
          <label className="cms-field">
            <span>Sort order</span>
            <input
              name="sort_order"
              type="number"
              value={form.sort_order}
              onChange={onChange}
            />
          </label>
          <label className="cms-check">
            <input
              type="checkbox"
              name="published"
              checked={form.published}
              onChange={onChange}
            />
            Published
          </label>
        </div>
        <div className="cms-popover-actions">
          {editingId && (
            <button type="button" className="btn btn-soft" onClick={resetForm}>
              Cancel edit
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : editingId ? 'Update' : 'Add project'}
          </button>
        </div>
      </form>

      {loading ? (
        <p className="admin-muted">Loading…</p>
      ) : (
        <div className="admin-cards-grid">
          {rows.length === 0 && <p className="admin-muted">No projects yet.</p>}
          {rows.map((row) => (
            <article key={row.id} className="admin-card-item">
              {row.image_url && <img src={row.image_url} alt="" />}
              <div>
                <h3>{row.title}</h3>
                <p>{row.summary || row.body}</p>
                <p className="admin-muted">{row.division || '—'}</p>
                <div className="btn-row">
                  <button type="button" className="btn btn-soft" onClick={() => edit(row)}>
                    Edit
                  </button>
                  <button type="button" className="btn btn-soft" onClick={() => remove(row.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
