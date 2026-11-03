import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { uploadMedia } from '../lib/supabase'
import { useCms } from './CmsContext'

function buildInitial(kind, record, defaults) {
  const base = { ...defaults, ...(record || {}) }
  if (kind === 'project') {
    return {
      ...base,
      title: base.title || '',
      summary: base.summary || base.body || '',
      image_url: base.image_url || '',
      division: base.division || base.tag || '',
      sort_order: Number(base.sort_order) || 0,
      published: base.published !== false,
    }
  }
  return {
    ...base,
    collection: base.collection || defaults.collection || 'home_divisions',
    title: base.title || '',
    body: base.body || '',
    image_url: base.image_url || '',
    link_url: base.link_url || '',
    link_label: base.link_label || '',
    sort_order: Number(base.sort_order) || 0,
    published: base.published !== false,
  }
}

/**
 * Live-edit dialog for cms_cards or projects — Save / Undo / Delete always visible.
 */
export default function CardEditor({
  kind = 'card',
  record = null,
  defaults = {},
  onClose,
}) {
  const { saveCard, removeCard, saveProject, removeProject } = useCms()
  const fileRef = useRef(null)
  const initial = useMemo(
    () => buildInitial(kind, record, defaults),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [kind, record?.id],
  )
  const [draft, setDraft] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [busyImage, setBusyImage] = useState(false)

  useEffect(() => {
    setDraft(buildInitial(kind, record, defaults))
  }, [kind, record, defaults])

  const dirty = JSON.stringify(draft) !== JSON.stringify(initial)

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setDraft((d) => ({
      ...d,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const undo = () => setDraft(initial)

  const onImage = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusyImage(true)
    try {
      const url = await uploadMedia(file, kind === 'project' ? 'projects' : 'cms')
      setDraft((d) => ({ ...d, image_url: url }))
    } catch (err) {
      alert(err.message || 'Upload failed')
    } finally {
      setBusyImage(false)
    }
  }

  const save = async () => {
    setSaving(true)
    try {
      if (kind === 'project') {
        const payload = {
          id: record?.id,
          title: draft.title?.trim() || 'Untitled',
          summary: draft.summary?.trim() || '',
          image_url: draft.image_url || '',
          division: draft.division?.trim() || '',
          sort_order: Number(draft.sort_order) || 0,
          published: draft.published !== false,
        }
        if (!payload.id) delete payload.id
        await saveProject(payload)
      } else {
        const payload = {
          id: record?.id,
          collection: draft.collection || defaults.collection || 'home_divisions',
          title: draft.title?.trim() || 'Untitled',
          body: draft.body?.trim() || '',
          image_url: draft.image_url || '',
          link_url: draft.link_url || '',
          link_label: draft.link_label || '',
          sort_order: Number(draft.sort_order) || 0,
          published: draft.published !== false,
        }
        if (!payload.id) delete payload.id
        await saveCard(payload)
      }
      onClose?.()
    } catch (err) {
      alert(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!record?.id) {
      onClose?.()
      return
    }
    if (!window.confirm('Delete this item from the live site?')) return
    setSaving(true)
    try {
      if (kind === 'project') await removeProject(record.id)
      else await removeCard(record.id)
      onClose?.()
    } catch (err) {
      alert(err.message || 'Delete failed')
    } finally {
      setSaving(false)
    }
  }

  const image = draft.image_url || ''

  return createPortal(
    <div
      className="cms-popover-backdrop"
      onClick={(e) => {
        e.stopPropagation()
        onClose?.()
      }}
    >
      <div
        className="cms-popover cms-popover--wide cms-popover--sheet"
        role="dialog"
        aria-label="Edit content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cms-popover-scroll">
          <p className="cms-popover-key">
            {kind === 'project' ? 'Project' : `Card · ${draft.collection || 'content'}`}
            {record?.id ? '' : ' · new'}
          </p>

          {image ? (
            <div className="cms-editor-preview-frame">
              <img src={image} alt="" className="cms-editor-preview" />
            </div>
          ) : (
            <div className="cms-editor-preview-frame is-empty">No image</div>
          )}

          <div className="cms-popover-actions cms-popover-actions--start">
            <button
              type="button"
              className="btn btn-soft"
              disabled={busyImage}
              onClick={() => fileRef.current?.click()}
            >
              {busyImage ? 'Uploading…' : 'Replace image'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onImage} />
          </div>

          <label className="cms-field">
            <span>Title</span>
            <input name="title" value={draft.title || ''} onChange={onChange} autoFocus />
          </label>

          <label className="cms-field">
            <span>{kind === 'project' ? 'Summary' : 'Body'}</span>
            <textarea
              name={kind === 'project' ? 'summary' : 'body'}
              value={kind === 'project' ? draft.summary || '' : draft.body || ''}
              onChange={onChange}
              rows={4}
            />
          </label>

          <label className="cms-field">
            <span>{kind === 'project' ? 'Division / category' : 'Link label'}</span>
            <input
              name={kind === 'project' ? 'division' : 'link_label'}
              value={kind === 'project' ? draft.division || '' : draft.link_label || ''}
              onChange={onChange}
            />
          </label>

          {kind === 'card' && (
            <label className="cms-field">
              <span>Link URL</span>
              <input name="link_url" value={draft.link_url || ''} onChange={onChange} />
            </label>
          )}
        </div>

        <div className="cms-popover-footer">
          <button
            type="button"
            className="btn btn-soft cms-btn-danger"
            onClick={remove}
            disabled={saving}
          >
            {record?.id ? 'Delete' : 'Discard'}
          </button>
          <button
            type="button"
            className="btn btn-soft"
            onClick={undo}
            disabled={saving || !dirty}
          >
            Undo
          </button>
          <button type="button" className="btn btn-soft" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={save}
            disabled={saving || !dirty}
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
