import { useCallback, useEffect, useState } from 'react'
import {
  deleteCard,
  listCards,
  uploadMedia,
  upsertCard,
} from '../../lib/supabase'
import { useCms } from '../../cms/CmsContext'

const COLLECTIONS = ['home_divisions', 'home_work', 'portfolio', 'insights']

const blank = {
  collection: 'home_divisions',
  title: '',
  body: '',
  image_url: '',
  link_url: '',
  link_label: '',
  sort_order: 0,
  published: true,
}

export default function CardsAdmin() {
  const { refresh } = useCms()
  const [collection, setCollection] = useState('home_divisions')
  const [cards, setCards] = useState([])
  const [form, setForm] = useState(blank)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setCards(await listCards(collection))
    } catch (err) {
      setError(err.message || 'Failed to load cards')
    } finally {
      setLoading(false)
    }
  }, [collection])

  useEffect(() => {
    load()
  }, [load])

  const resetForm = () => {
    setForm({ ...blank, collection })
    setEditingId(null)
  }

  useEffect(() => {
    resetForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection])

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
      const url = await uploadMedia(file, 'cards')
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
      const payload = {
        ...form,
        collection,
        sort_order: Number(form.sort_order) || 0,
      }
      if (editingId) payload.id = editingId
      await upsertCard(payload)
      resetForm()
      await load()
      await refresh()
    } catch (err) {
      setError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const edit = (card) => {
    setEditingId(card.id)
    setForm({
      collection: card.collection,
      title: card.title || '',
      body: card.body || '',
      image_url: card.image_url || '',
      link_url: card.link_url || '',
      link_label: card.link_label || '',
      sort_order: card.sort_order ?? 0,
      published: card.published !== false,
    })
  }

  const remove = async (id) => {
    if (!confirm('Delete this card?')) return
    try {
      await deleteCard(id)
      await load()
      await refresh()
    } catch (err) {
      setError(err.message || 'Delete failed')
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h1>CMS cards</h1>
        <select
          value={collection}
          onChange={(e) => setCollection(e.target.value)}
          aria-label="Collection"
        >
          {COLLECTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="form-msg err" role="alert">
          {error}
        </p>
      )}

      <form className="admin-card-form" onSubmit={save}>
        <h2>{editingId ? 'Edit card' : 'Add card'}</h2>
        <div className="admin-form-grid">
          <label className="cms-field">
            <span>Title</span>
            <input name="title" value={form.title} onChange={onChange} required />
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
          <label className="cms-field" style={{ gridColumn: '1 / -1' }}>
            <span>Body</span>
            <textarea name="body" rows={3} value={form.body} onChange={onChange} />
          </label>
          <label className="cms-field">
            <span>Link URL</span>
            <input name="link_url" value={form.link_url} onChange={onChange} />
          </label>
          <label className="cms-field">
            <span>Link label</span>
            <input name="link_label" value={form.link_label} onChange={onChange} />
          </label>
          <label className="cms-field" style={{ gridColumn: '1 / -1' }}>
            <span>Image URL</span>
            <input name="image_url" value={form.image_url} onChange={onChange} />
          </label>
          <label className="cms-field">
            <span>Upload image</span>
            <input type="file" accept="image/*" onChange={onImage} />
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
        {form.image_url && (
          <img src={form.image_url} alt="" className="admin-thumb" />
        )}
        <div className="cms-popover-actions">
          {editingId && (
            <button type="button" className="btn btn-soft" onClick={resetForm}>
              Cancel edit
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : editingId ? 'Update card' : 'Add card'}
          </button>
        </div>
      </form>

      {loading ? (
        <p className="admin-muted">Loading…</p>
      ) : (
        <div className="admin-cards-grid">
          {cards.length === 0 && <p className="admin-muted">No cards in this collection.</p>}
          {cards.map((card) => (
            <article key={card.id} className="admin-card-item">
              {card.image_url && <img src={card.image_url} alt="" />}
              <div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <p className="admin-muted">
                  sort {card.sort_order} · {card.published ? 'published' : 'draft'}
                </p>
                <div className="btn-row">
                  <button type="button" className="btn btn-soft" onClick={() => edit(card)}>
                    Edit
                  </button>
                  <button type="button" className="btn btn-soft" onClick={() => remove(card.id)}>
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
