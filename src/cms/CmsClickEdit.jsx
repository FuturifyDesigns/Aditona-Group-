import { useState } from 'react'
import CardEditor from './CardEditor'
import { useCms } from './CmsContext'

/**
 * Makes any card/tile clickable in live edit mode and opens CardEditor.
 */
export default function CmsClickEdit({
  collection,
  item = null,
  defaults = {},
  as: Tag = 'div',
  className = '',
  children,
  ...rest
}) {
  const { editMode } = useCms()
  const [open, setOpen] = useState(false)

  const openEditor = (e) => {
    if (!editMode) return
    e.preventDefault()
    e.stopPropagation()
    setOpen(true)
  }

  return (
    <>
      <Tag
        className={`${className}${editMode ? ' cms-editable' : ''}`.trim()}
        onClick={openEditor}
        onClickCapture={editMode ? openEditor : undefined}
        onKeyDown={
          editMode
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') openEditor(e)
              }
            : undefined
        }
        role={editMode ? 'button' : undefined}
        tabIndex={editMode ? 0 : undefined}
        {...rest}
      >
        {children}
        {editMode && <span className="cms-pencil">✎</span>}
      </Tag>
      {open && (
        <CardEditor
          kind="card"
          record={item?.card?.id ? item.card : null}
          defaults={{
            collection,
            title: item?.title || defaults.title || 'Untitled',
            body: item?.text ?? defaults.body ?? '',
            image_url: item?.image || defaults.image_url || '',
            link_url: item?.to || defaults.link_url || '',
            link_label: item?.label || defaults.link_label || '',
            sort_order: item?.sortOrder ?? defaults.sort_order ?? 0,
            published: true,
            ...defaults,
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

/** “+ Add” tile that creates a new card in a collection. */
export function CmsAddCard({ collection, defaults = {}, label = '+ Add card', className = '' }) {
  const { editMode } = useCms()
  const [open, setOpen] = useState(false)
  if (!editMode) return null
  return (
    <>
      <button
        type="button"
        className={`cms-add-tile ${className}`.trim()}
        data-cms-add="1"
        onClick={() => setOpen(true)}
      >
        {label}
      </button>
      {open && (
        <CardEditor
          kind="card"
          defaults={{
            collection,
            title: 'New item',
            body: '',
            image_url: '',
            published: true,
            ...defaults,
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
