/**
 * Prefer CMS rows for a collection; otherwise use static fallbacks.
 * Fallbacks shape: { title, text?, image?, to?, label? }
 */
export function mergeCards(cmsCards, fallbacks = []) {
  if (cmsCards?.length) {
    return cmsCards.map((c, i) => {
      const fb = fallbacks[i] || fallbacks[0] || {}
      return {
        card: c,
        title: c.title || fb.title || 'Untitled',
        text: c.body || fb.text || '',
        image: c.image_url || fb.image || '',
        to: c.link_url || fb.to || '',
        label: c.link_label || fb.label || c.title || '',
        sortOrder: c.sort_order ?? i,
      }
    })
  }
  return fallbacks.map((f, i) => ({
    card: null,
    title: f.title,
    text: f.text || '',
    image: f.image || '',
    to: f.to || '',
    label: f.label || f.title,
    sortOrder: i,
  }))
}
