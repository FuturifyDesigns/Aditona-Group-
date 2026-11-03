import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { uploadMedia } from '../lib/supabase'
import { useCms } from './CmsContext'

/**
 * Live-edit popover for cms_cards rows or projects rows.
 * kind: 'card' | 'project'
 */
export default function CardEditor({
  kind = 'card',
  record = null,
  defaults = {},
  onClose,
}) {
  const { saveCard, removeCard, saveProject, removeProject } = useCms()
  const fileRef = useRef(null)
  const [draft, setDraft] = useState(() => ({ ...defaults, ...record }))
  const [saving, setSaving] = useState(false)
  const [busyImage, setBusyImage] = useState(false)

  useEffect(() => {
    setDraft({ ...defaults, ...record })
  }, [record, defaults])

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setDraft((d) => ({
      ...d,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

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
          summary: draft.summary?.trim() || draft.body?.trim() || '',
          image_url: draft.image_url || '',
          division: draft.division?.trim() || draft.tag?.trim() || '',
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
  const bodyKey = kind === 'project' ? 'summary' : 'body'
  const bodyValue = kind === 'project' ? draft.summary ?? draft.body ?? '' : draft.body ?? ''
  const tagKey = kind === 'project' ? 'division' : 'link_label'
  const tagLabel = kind === 'project' ? 'Division / category' : 'Link label'
  const tagValue = kind === 'project' ? draft.division ?? '' : draft.link_label ?? ''

  return createPortal(
    <div
      className="cms-popover-backdrop"
      onClick={(e) => {
        e.stopPropagation()
        onClose?.()
      }}
    >
      <div
        className="cms-popover cms-popover--wide"
        role="dialog"
        aria-label="Edit content"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="cms-popover-key">
          {kind === 'project' ? 'Project' : `Card · ${draft.collection || 'content'}`}
          {record?.id ? '' : ' · new'}
        </p>

        {image ? (
          <img src={image} alt="" className="cms-editor-preview" />
        ) : (
          <div className="cms-editor-preview is-empty">No image</div>
        )}

        <div className="cms-popover-actions" style={{ marginBottom: '0.75rem' }}>
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
            name={bodyKey}
            value={bodyValue}
            onChange={onChange}
            rows={4}
          />
        </label>

        <label className="cms-field">
          <span>{tagLabel}</span>
          <input name={tagKey} value={tagValue} onChange={onChange} />
        </label>

        {kind === 'card' && (
          <label className="cms-field">
            <span>Link URL</span>
            <input name="link_url" value={draft.link_url || ''} onChange={onChange} />
          </label>
        )}

        <div className="cms-popover-actions">
          {record?.id && (
            <button type="button" className="btn btn-soft" onClick={remove} disabled={saving}>
              Delete
            </button>
          )}
          <button type="button" className="btn btn-soft" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
