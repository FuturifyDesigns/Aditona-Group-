import { useEffect, useRef, useState } from 'react'
import { useCms } from '../cms/CmsContext'
import { prefersReducedMotion } from '../lib/scroll'

/**
 * When false, pages should skip ScrollTrigger / scrub / pin setup.
 * Bumps a generation when leaving edit mode so useGSAP can rebuild cleanly.
 */
export function useMotionReady() {
  const { editMode } = useCms()
  const [gen, setGen] = useState(0)
  const wasEditing = useRef(editMode)

  useEffect(() => {
    const onResume = () => setGen((g) => g + 1)
    window.addEventListener('ag-cms-motion-resume', onResume)
    return () => window.removeEventListener('ag-cms-motion-resume', onResume)
  }, [])

  useEffect(() => {
    if (wasEditing.current && !editMode) {
      setGen((g) => g + 1)
    }
    wasEditing.current = editMode
  }, [editMode])

  const reduced = typeof window !== 'undefined' && prefersReducedMotion()
  const enabled = !editMode && !reduced

  return { enabled, editMode, motionKey: `${enabled ? 1 : 0}-${gen}` }
}
