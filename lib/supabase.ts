import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types based on your schema
export type Tables = {
  users: {
    id: string
    email: string
    password_hash: string
    first_name: string
    last_name: string
    avatar_url: string | null
    phone: string | null
    timezone: string
    currency_pref: string
    is_admin: boolean
    email_verified: string | null
    created_at: string
    updated_at: string
    last_login: string | null
  }
  branches: {
    id: string
    owner_id: string
    name: string
    type: string
    description: string | null
    color: string
    currency: string
    is_active: boolean
    settings: Record<string, any>
    created_at: string
    updated_at: string
  }
  expenses: {
    id: string
    branch_id: string
    created_by: string
    category_id: string | null
    title: string
    description: string | null
    amount: number
    currency: string
    status: 'pending' | 'funds_assigned' | 'paid' | 'cancelled'
    expense_date: string
    due_date: string | null
    paid_at: string | null
    payment_method: string | null
    paid_by: string | null
    is_split: boolean
    split_type: string | null
    tags: string[]
    location: Record<string, any> | null
    metadata: Record<string, any>
    created_at: string
    updated_at: string
  }
  documents: {
    id: string
    expense_id: string | null
    branch_id: string
    uploaded_by: string
    file_name: string
    file_type: string
    file_size: number
    storage_key: string
    thumbnail_url: string | null
    preview_url: string | null
    extracted_text: string | null
    metadata: Record<string, any>
    is_verified: boolean
    created_at: string
  }
  categories: {
    id: string
    branch_id: string
    name: string
    icon: string
    color: string
    parent_id: string | null
    is_system: boolean
    budget_limit: number | null
    created_at: string
  }
}
