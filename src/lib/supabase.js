import { createClient } from '@supabase/supabase-js'
import { config } from './config'

export const supabase = createClient(config.supabaseUrl, config.supabaseAnon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
})

export async function submitEnquiry(payload) {
  const { data, error } = await supabase
    .from('enquiries')
    .insert([
      {
        form_type: payload.form_type,
        full_name: payload.full_name,
        company: payload.company || null,
        email: payload.email,
        phone: payload.phone || null,
        division: payload.division || null,
        service: payload.service || null,
        message: payload.message,
        project_date: payload.project_date || null,
        budget: payload.budget || null,
        page_source: payload.page_source || null,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      },
    ])
    .select('id')
    .single()

  if (error) throw error

  // Best-effort email forward — never fail the public form if mail notify errors
  try {
    const { notifyFormEmail } = await import('./notifyEmail')
    await notifyFormEmail(payload)
  } catch (err) {
    console.warn('[enquiry] email notify failed', err)
  }

  return data
}

export async function getContentMap() {
  const { data, error } = await supabase.from('site_content').select('key, value')
  if (error) throw error
  const map = {}
  for (const row of data || []) {
    map[row.key] = row.value
  }
  return map
}

export async function upsertContent(key, value) {
  const { data, error } = await supabase
    .from('site_content')
    .upsert({ key, value }, { onConflict: 'key' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function listCards(collection) {
  let query = supabase
    .from('cms_cards')
    .select('*')
    .order('sort_order', { ascending: true })
  if (collection) query = query.eq('collection', collection)
  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function upsertCard(card) {
  const payload = { ...card }
  if (!payload.id) delete payload.id
  const { data, error } = await supabase
    .from('cms_cards')
    .upsert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteCard(id) {
  const { error } = await supabase.from('cms_cards').delete().eq('id', id)
  if (error) throw error
}

export async function uploadMedia(file, pathPrefix = 'uploads') {
  const ext = file.name.split('.').pop() || 'bin'
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const path = `${pathPrefix}/${safeName}`
  const { error } = await supabase.storage.from('media').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error
  const { data } = supabase.storage.from('media').getPublicUrl(path)
  return data.publicUrl
}

export async function listEnquiries({ formTypes } = {}) {
  let query = supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false })

  if (formTypes?.length === 1) {
    query = query.eq('form_type', formTypes[0])
  } else if (formTypes?.length > 1) {
    query = query.in('form_type', formTypes)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function updateEnquiry(id, patch) {
  const { data, error } = await supabase
    .from('enquiries')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function listProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data || []
}

export async function upsertProject(project) {
  const payload = { ...project }
  if (!payload.id) delete payload.id
  const { data, error } = await supabase
    .from('projects')
    .upsert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteProject(id) {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}
