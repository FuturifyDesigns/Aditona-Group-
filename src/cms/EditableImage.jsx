import { useRef, useState } from 'react'
import { uploadMedia } from '../lib/supabase'
import { useCms } from './CmsContext'

/**
 * Image that opens a file picker in editMode, uploads to storage `media/`,
 * and updates a content key (or calls onUploaded for card image updates).
 */
export default function EditableImage({
  contentKey,
  src: srcProp,
  alt = '',
  className = '',
  onUploaded,
  ...rest
}) {
  const { get, setContent, editMode, refresh } = useCms()
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const src = contentKey ? get(contentKey) || srcProp : srcProp

  const pick = (e) => {
    if (!editMode) return
    e.preventDefault()
    e.stopPropagation()
    inputRef.current?.click()
  }

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true)
    try {
      const url = await uploadMedia(file, 'cms')
      if (contentKey) await setContent(contentKey, url)
      if (onUploaded) await onUploaded(url)
      await refresh()
    } catch (err) {
      alert(err.message || 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <span
      className={`cms-image-wrap${editMode ? ' cms-editable' : ''}`}
      data-cms={editMode ? contentKey || 'image' : undefined}
      style={{ position: 'relative', display: 'contents' }}
    >
      <img
        src={src}
        alt={alt}
        className={className}
        onClick={pick}
        onClickCapture={editMode ? pick : undefined}
        style={editMode ? { cursor: 'pointer' } : undefined}
        {...rest}
      />
      {editMode && (
        <span className="cms-pencil cms-pencil--img" aria-hidden="true">
          {busy ? '…' : '✎'}
        </span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={onFile}
      />
    </span>
  )
}
