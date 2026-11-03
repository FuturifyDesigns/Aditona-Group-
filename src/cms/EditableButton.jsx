import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { useCms } from './CmsContext'

/**
 * Link/button that NEVER navigates while editMode is on.
 * Opens an editor for label (contentKey) and optional href (hrefKey).
 */
export default function EditableButton({
  to,
  href,
  contentKey,
  hrefKey,
  className = '',
  children,
  type = 'button',
  onClick,
  ...rest
}) {
  const { get, setContent, editMode } = useCms()
  const label = get(contentKey) || (typeof children === 'string' ? children : '') || children
  const resolvedHref = hrefKey ? get(hrefKey) || to || href : to || href
  const [open, setOpen] = useState(false)
  const [draftLabel, setDraftLabel] = useState(typeof label === 'string' ? label : '')
  const [draftHref, setDraftHref] = useState(resolvedHref || '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setDraftLabel(typeof label === 'string' ? label : '')
      setDraftHref(resolvedHref || '')
    }
  }, [open, label, resolvedHref])

  const openEditor = () => setOpen(true)

  const handleClick = (e) => {
    if (editMode) {
      e.preventDefault()
      e.stopPropagation()
      openEditor()
      return
    }
    onClick?.(e)
  }

  const dirty =
    draftLabel !== (typeof label === 'string' ? label : '') ||
    (hrefKey ? draftHref !== (resolvedHref || '') : false)

  const undo = () => {
    setDraftLabel(typeof label === 'string' ? label : '')
    setDraftHref(resolvedHref || '')
  }

  const resetDefault = async () => {
    const fallbackLabel = typeof children === 'string' ? children : ''
    if (!window.confirm('Reset this button to the site default?')) return
    setSaving(true)
    try {
      await setContent(contentKey, fallbackLabel)
      if (hrefKey) await setContent(hrefKey, to || href || '')
      setOpen(false)
    } catch (err) {
      alert(err.message || 'Failed to reset')
    } finally {
      setSaving(false)
    }
  }

  const save = async () => {
    setSaving(true)
    try {
      await setContent(contentKey, draftLabel)
      if (hrefKey) await setContent(hrefKey, draftHref)
      setOpen(false)
    } catch (err) {
      alert(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const sharedProps = {
    className: `${className}${editMode ? ' cms-editable' : ''}`.trim(),
    'data-cms': editMode ? contentKey : undefined,
    onClick: handleClick,
    onClickCapture: editMode
      ? (e) => {
          e.preventDefault()
          e.stopPropagation()
          openEditor()
        }
      : undefined,
    style: editMode ? { cursor: 'pointer', position: 'relative' } : undefined,
    ...rest,
  }

  let node
  if (to != null && !href) {
    node = (
      <Link to={editMode ? '#' : to} {...sharedProps}>
        {typeof label === 'string' ? label : children}
        {editMode && <span className="cms-pencil" aria-hidden="true">✎</span>}
      </Link>
    )
  } else if (href || (hrefKey && resolvedHref?.startsWith('http'))) {
    node = (
      <a href={editMode ? undefined : resolvedHref || href} {...sharedProps}>
        {typeof label === 'string' ? label : children}
        {editMode && <span className="cms-pencil" aria-hidden="true">✎</span>}
      </a>
    )
  } else {
    node = (
      <button type={type} {...sharedProps}>
        {typeof label === 'string' ? label : children}
        {editMode && <span className="cms-pencil" aria-hidden="true">✎</span>}
      </button>
    )
  }

  return (
    <>
      {node}
      {open &&
        createPortal(
          <div
            className="cms-popover-backdrop"
            onClick={(e) => {
              e.stopPropagation()
              setOpen(false)
            }}
          >
            <div
              className="cms-popover cms-popover--sheet"
              role="dialog"
              aria-label={`Edit ${contentKey}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="cms-popover-scroll">
                <p className="cms-popover-key">{contentKey}</p>
                <label className="cms-field">
                  <span>Label</span>
                  <input
                    type="text"
                    value={draftLabel}
                    onChange={(e) => setDraftLabel(e.target.value)}
                    autoFocus
                  />
                </label>
                {hrefKey && (
                  <label className="cms-field">
                    <span>Href ({hrefKey})</span>
                    <input
                      type="text"
                      value={draftHref}
                      onChange={(e) => setDraftHref(e.target.value)}
                    />
                  </label>
                )}
              </div>
              <div className="cms-popover-footer">
                <button
                  type="button"
                  className="btn btn-soft cms-btn-danger"
                  onClick={resetDefault}
                  disabled={saving}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="btn btn-soft"
                  onClick={undo}
                  disabled={saving || !dirty}
                >
                  Undo
                </button>
                <button
                  type="button"
                  className="btn btn-soft"
                  onClick={() => setOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={saving || !dirty}
                  onClick={save}
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
