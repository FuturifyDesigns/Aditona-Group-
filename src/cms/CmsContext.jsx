import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  getContentMap,
  listCards,
  supabase,
  upsertContent,
} from '../lib/supabase'
import { isAdminEmail } from '../lib/config'
import { DEFAULTS } from './defaults'

const CmsContext = createContext(null)

export function CmsProvider({ children }) {
  const [content, setContentState] = useState({ ...DEFAULTS })
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [editMode, setEditMode] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const [map, cardRows] = await Promise.all([getContentMap(), listCards()])
      setContentState({ ...DEFAULTS, ...map })
      setCards(cardRows)
    } catch (err) {
      console.warn('[cms] refresh failed', err)
      setContentState((prev) => ({ ...DEFAULTS, ...prev }))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    let mounted = true

    const applySession = async (next) => {
      if (!mounted) return
      const email = next?.user?.email
      if (next && !isAdminEmail(email)) {
        await supabase.auth.signOut()
        setSession(null)
        setEditMode(false)
        setAuthLoading(false)
        return
      }
      setSession(next)
      setAuthLoading(false)
      if (!next) setEditMode(false)
    }

    supabase.auth.getSession().then(({ data }) => {
      applySession(data.session ?? null)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      applySession(next)
    })
    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('cms-edit-mode', Boolean(editMode && session))
    return () => document.body.classList.remove('cms-edit-mode')
  }, [editMode, session])

  const setContent = useCallback(async (key, value) => {
    setContentState((prev) => ({ ...prev, [key]: value }))
    await upsertContent(key, value)
  }, [])

  const get = useCallback(
    (key) => content[key] ?? DEFAULTS[key] ?? '',
    [content],
  )

  const cardsByCollection = useCallback(
    (collection) =>
      cards.filter(
        (c) => c.collection === collection && (c.published !== false || editMode),
      ),
    [cards, editMode],
  )

  const value = useMemo(
    () => ({
      content,
      cards,
      cardsByCollection,
      loading: loading || authLoading,
      session,
      user: session?.user ?? null,
      isAuthenticated: Boolean(session && isAdminEmail(session?.user?.email)),
      editMode: Boolean(editMode && session && isAdminEmail(session?.user?.email)),
      setEditMode,
      setContent,
      get,
      refresh,
    }),
    [
      content,
      cards,
      cardsByCollection,
      loading,
      authLoading,
      session,
      editMode,
      setContent,
      get,
      refresh,
    ],
  )

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>
}

export function useCms() {
  const ctx = useContext(CmsContext)
  if (!ctx) throw new Error('useCms must be used within CmsProvider')
  return ctx
}
