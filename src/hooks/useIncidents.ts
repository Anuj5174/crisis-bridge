import { useEffect, useState } from "react"
import { supabase } from "@/utils/supabase/client"

export type Incident = {
  id: string
  type: string
  severity: string
  location: string
  description: string
  status: string
  reported_by?: string
  latitude?: number
  longitude?: number
  metadata?: Record<string, unknown>
  is_silent?: boolean
  reporter_role?: string
  urgency_score?: number
  created_at: string
}

export function useIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Initial fetch
    const fetchIncidents = async () => {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!error && data) {
        setIncidents(data)
      }
      setLoading(false)
    }

    fetchIncidents()

    // 2. Subscribe to real-time changes
    const channel = supabase
      .channel('incidents-realtime')
      .on(
        'postgres_changes',
        {
          event: '*', 
          schema: 'public',
          table: 'incidents',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setIncidents((current) => [payload.new as Incident, ...current])
          } else if (payload.eventType === 'UPDATE') {
            setIncidents((current) =>
              current.map((inc) => (inc.id === payload.new.id ? (payload.new as Incident) : inc))
            )
          } else if (payload.eventType === 'DELETE') {
            setIncidents((current) => current.filter((inc) => inc.id === payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { incidents, loading }
}
