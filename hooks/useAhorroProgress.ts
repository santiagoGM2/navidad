'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { AhorroProgress } from '@/types/ahorro'

const FALLBACK: AhorroProgress = {
  id: 1,
  meta: 2000000,
  ahorrado: 0,
  restante: 2000000,
  porcentaje: 0,
  dias_listos: 0,
  updated_at: new Date().toISOString()
}

export function useAhorroProgress() {
  const [data, setData] = useState<AhorroProgress>(FALLBACK)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: row } = await supabase
        .from('ahorro_progress')
        .select('*')
        .eq('id', 1)
        .single()
      if (row) setData(row)
      setLoading(false)
    }
    fetchData()

    const channel = supabase
      .channel('ahorro-realtime')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'ahorro_progress'
      }, (payload) => {
        setData(payload.new as AhorroProgress)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return { data, loading }
}
