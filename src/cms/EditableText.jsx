import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useCms } from './CmsContext'

export default function EditableText({
  contentKey,
  as: Tag = 'span',
  className = '',
  multiline = false,
  children,
  style,
  ...rest
}) {
  const { get, setContent, editMode } = useCms()
  const value = get(contentKey) || (typeof children === 'string' ? children : '')
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(value)
  const [saving, setSaving] = useState(false)
  const anchorRef = useRef(null)

  useEffect(() => {
    if (open) setDraft(value)
  }, [open, value])

  const openEditor = (e) => {
    if (!editMode) return
    e.preventDefault()
    e.stopPropagation()
    setOpen(true)
  }

  const save = async () => {
    setSaving(true)
    try {
      await setContent(contentKey, draft)
      setOpen(false)
    } catch (err) {
      alert(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const mergedStyle = {
    ...style,
    ...(editMode ? { cursor: 'pointer', position: 'relative' } : null),
  }

  return (
    <>
      <Tag
        ref={anchorRef}
        className={`${className}${editMode ? ' cms-editable' : ''}`.trim()}
        data-cms={editMode ? contentKey : undefined}
        onClick={openEditor}
        onClickCapture={editMode ? openEditor : undefined}
        style={mergedStyle}
        {...rest}
      >
        {value}
        {editMode && <span className="cms-pencil" aria-hidden="true">✎</span>}
      </Tag>

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
              className="cms-popover"
              role="dialog"
              aria-label={`Edit ${contentKey}`}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="cms-popover-key">{contentKey}</p>
              {multiline ? (
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={5}
                  autoFocus
                />
              ) : (
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  autoFocus
                />
              )}
              <div className="cms-popover-actions">
                <button type="button" className="btn btn-soft" onClick={() => setOpen(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={saving}
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
