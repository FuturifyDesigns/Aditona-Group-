import { createClient } from '@supabase/supabase-js'
import { config } from './config'

export const supabase = createClient(config.supabaseUrl, config.supabaseAnon, {
  auth: { persistSession: false, autoRefreshToken: false },
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
  return data
}
