import { useMemo, useState } from 'react'
import { DEFAULTS } from '../../cms/defaults'
import { useCms } from '../../cms/CmsContext'

export default function CopyAdmin() {
  const { content, setContent, refresh } = useCms()
  const [drafts, setDrafts] = useState({})
  const [savingKey, setSavingKey] = useState('')
  const [message, setMessage] = useState('')

  const keys = useMemo(() => {
    const set = new Set([...Object.keys(DEFAULTS), ...Object.keys(content || {})])
    return Array.from(set).sort()
  }, [content])

  const valueFor = (key) =>
    drafts[key] !== undefined ? drafts[key] : content[key] ?? DEFAULTS[key] ?? ''

  const saveKey = async (key) => {
    setSavingKey(key)
    setMessage('')
    try {
      await setContent(key, valueFor(key))
      setDrafts((d) => {
        const next = { ...d }
        delete next[key]
        return next
      })
      setMessage(`Saved ${key}`)
    } catch (err) {
      setMessage(err.message || 'Save failed')
    } finally {
      setSavingKey('')
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-help">
        <strong>How to use this page</strong>
        <p>
          Each row is a piece of text on the live website. Edit the box, then click
          <em> Save</em>. Keys like <code>hero.headline</code> control the home page.
        </p>
      </div>

      <div className="admin-panel-head">
        <h2>Editable text</h2>
        <button type="button" className="btn btn-soft" onClick={() => refresh()}>
          Refresh
        </button>
      </div>
      {message && <p className="admin-muted">{message}</p>}
      <div className="admin-copy-list">
        {keys.map((key) => {
          const multiline = String(valueFor(key)).length > 80 || key.includes('body')
          return (
            <div key={key} className="admin-copy-row">
              <label className="cms-field">
                <span>{key}</span>
                {multiline ? (
                  <textarea
                    rows={3}
                    value={valueFor(key)}
                    onChange={(e) =>
                      setDrafts((d) => ({ ...d, [key]: e.target.value }))
                    }
                  />
                ) : (
                  <input
                    type="text"
                    value={valueFor(key)}
                    onChange={(e) =>
                      setDrafts((d) => ({ ...d, [key]: e.target.value }))
                    }
                  />
                )}
              </label>
              <button
                type="button"
                className="btn btn-primary"
                disabled={savingKey === key}
                onClick={() => saveKey(key)}
              >
                {savingKey === key ? 'Saving…' : 'Save'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
