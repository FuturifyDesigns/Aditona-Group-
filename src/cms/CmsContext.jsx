import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  deleteCard,
  deleteProject,
  getContentMap,
  listCards,
  listProjects,
  supabase,
  upsertCard,
  upsertContent,
  upsertProject,
} from '../lib/supabase'
import { isAdminEmail } from '../lib/config'
import { freezeScrollMotion, resumeScrollMotion } from '../lib/scroll'
import { DEFAULTS } from './defaults'

const CmsContext = createContext(null)

export function CmsProvider({ children }) {
  const [content, setContentState] = useState({ ...DEFAULTS })
  const [cards, setCards] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [editMode, setEditModeState] = useState(() => {
    try {
      return sessionStorage.getItem('ag_cms_edit') === '1'
    } catch {
      return false
    }
  })
  const setEditMode = useCallback((value) => {
    setEditModeState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value
      try {
        sessionStorage.setItem('ag_cms_edit', next ? '1' : '0')
      } catch {
        /* ignore */
      }
      return Boolean(next)
    })
  }, [])
  const location = useLocation()
  const navigate = useNavigate()

  const refresh = useCallback(async () => {
    try {
      const [map, cardRows, projectRows] = await Promise.all([
        getContentMap(),
        listCards(),
        listProjects().catch(() => []),
      ])
      setContentState({ ...DEFAULTS, ...map })
      setCards(cardRows)
      setProjects(projectRows || [])
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

  // Deep-link: /?edit=1 turns live edit on for signed-in admin
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('edit') !== '1') return
    if (!(session && isAdminEmail(session?.user?.email))) return
    setEditMode(true)
    params.delete('edit')
    const next = `${location.pathname}${params.toString() ? `?${params}` : ''}${location.hash || ''}`
    navigate(next, { replace: true })
  }, [location.search, location.pathname, location.hash, session, navigate])

  const isAuthedEarly = Boolean(session && isAdminEmail(session?.user?.email))

  // CMS toolbar is fixed — reserve space whenever signed in (not only when editing)
  useEffect(() => {
    document.body.classList.toggle('cms-bar-visible', isAuthedEarly)
    return () => document.body.classList.remove('cms-bar-visible')
  }, [isAuthedEarly])

  useEffect(() => {
    const on =
      Boolean(editMode && session && isAdminEmail(session?.user?.email))
    document.body.classList.toggle('cms-edit-mode', on)
    if (on) {
      // Kill pins/scrub so live editing never fights ScrollTrigger
      freezeScrollMotion()
    } else if (session && isAdminEmail(session?.user?.email)) {
      // Leaving edit mode — reset stacked panels, then rebuild motion
      document.body.dataset.cmsMotion = String(Date.now())
      resumeScrollMotion()
    }
    return () => document.body.classList.remove('cms-edit-mode')
  }, [editMode, session])

  const setContent = useCallback(async (key, value) => {
    setContentState((prev) => ({ ...prev, [key]: value }))
    await upsertContent(key, value)
  }, [])

  const saveCard = useCallback(
    async (payload) => {
      const saved = await upsertCard(payload)
      await refresh()
      // Keep scroll killed while editing after DOM card lists change
      if (document.body.classList.contains('cms-edit-mode')) freezeScrollMotion()
      return saved
    },
    [refresh],
  )

  const removeCard = useCallback(
    async (id) => {
      await deleteCard(id)
      await refresh()
      if (document.body.classList.contains('cms-edit-mode')) freezeScrollMotion()
    },
    [refresh],
  )

  const saveProject = useCallback(
    async (payload) => {
      const saved = await upsertProject(payload)
      await refresh()
      if (document.body.classList.contains('cms-edit-mode')) freezeScrollMotion()
      return saved
    },
    [refresh],
  )

  const removeProject = useCallback(
    async (id) => {
      await deleteProject(id)
      await refresh()
      if (document.body.classList.contains('cms-edit-mode')) freezeScrollMotion()
    },
    [refresh],
  )

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

  const publishedProjects = useMemo(
    () => projects.filter((p) => p.published !== false || editMode),
    [projects, editMode],
  )

  const isAuthed = isAuthedEarly

  const value = useMemo(
    () => ({
      content,
      cards,
      projects: publishedProjects,
      cardsByCollection,
      loading: loading || authLoading,
      session,
      user: session?.user ?? null,
      isAuthenticated: isAuthed,
      editMode: Boolean(editMode && isAuthed),
      setEditMode,
      setContent,
      get,
      refresh,
      saveCard,
      removeCard,
      saveProject,
      removeProject,
    }),
    [
      content,
      cards,
      publishedProjects,
      cardsByCollection,
      loading,
      authLoading,
      session,
      isAuthed,
      editMode,
      setEditMode,
      setContent,
      get,
      refresh,
      saveCard,
      removeCard,
      saveProject,
      removeProject,
    ],
  )

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>
}

export function useCms() {
  const ctx = useContext(CmsContext)
  if (!ctx) throw new Error('useCms must be used within CmsProvider')
  return ctx
}
