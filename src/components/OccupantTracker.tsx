import { useState, useEffect } from "react"
import { Users, ShieldCheck, HeartPulse, UserMinus, Activity } from "lucide-react"
import { supabase } from "@/utils/supabase/client"

export default function OccupantTracker({ incidentId, zone }: { incidentId: string, zone: string }) {
  const [stats, setStats] = useState({
    safe: 0,
    help: 0,
    unknown: 12, // Mock base unknown
    evacuated: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase
        .from('occupant_status')
        .select('status')
        .eq('incident_id', incidentId)

      if (data) {
        const counts = {
          safe: data.filter(d => d.status === 'SAFE').length,
          help: data.filter(d => d.status === 'NEED_HELP').length,
          evacuated: data.filter(d => d.status === 'EVACUATED').length,
          unknown: Math.max(0, 12 - data.length) // Simple mock math
        }
        setStats(counts)
      }
      setLoading(false)
    }

    fetchStats()

    // Real-time subscription
    const channel = supabase
      .channel('occupant-updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'occupant_status', filter: `incident_id=eq.${incidentId}` }, 
        () => fetchStats()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [incidentId])

  const total = stats.safe + stats.help + stats.unknown + stats.evacuated

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            <h3 className="text-xs font-black uppercase tracking-widest">Zone Accountability</h3>
         </div>
         <span className="text-[10px] font-mono text-slate-500 uppercase">{zone}</span>
      </div>

      <div className="p-4 space-y-6">
         {/* Main Stats */}
         <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
               <div className="text-2xl font-black text-emerald-500 tracking-tighter">{stats.safe}</div>
               <div className="text-[9px] font-black uppercase text-emerald-600/70 tracking-widest">Safe</div>
            </div>
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center relative overflow-hidden">
               {stats.help > 0 && <div className="absolute inset-0 bg-red-500/5 animate-pulse" />}
               <div className="text-2xl font-black text-red-500 tracking-tighter">{stats.help}</div>
               <div className="text-[9px] font-black uppercase text-red-600/70 tracking-widest">Need Help</div>
            </div>
         </div>

         {/* Distribution Bar */}
         <div className="space-y-2">
            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-500 italic">
               <span>Occupant Distribution</span>
               <span>{stats.safe + stats.help} / {total} Checked In</span>
            </div>
            <div className="h-2 flex rounded-full overflow-hidden bg-slate-800">
               <div className="bg-emerald-500 transition-all duration-500" style={{ width: `${(stats.safe / total) * 100}%` }} />
               <div className="bg-red-500 transition-all duration-500" style={{ width: `${(stats.help / total) * 100}%` }} />
               <div className="bg-blue-500 transition-all duration-500" style={{ width: `${(stats.evacuated / total) * 100}%` }} />
            </div>
            <div className="flex gap-4 pt-1">
               <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[8px] font-black text-slate-500 uppercase">Safe</span>
               </div>
               <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span className="text-[8px] font-black text-slate-500 uppercase">Risk</span>
               </div>
               <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                  <span className="text-[8px] font-black text-slate-500 uppercase">Unknown</span>
               </div>
            </div>
         </div>

         {/* Live Activity Feed */}
         <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-widest">
               <Activity className="h-3 w-3" /> Recent Status Activity
            </div>
            <div className="space-y-1">
               {stats.help > 0 ? (
                 <div className="text-[10px] text-red-400 font-bold bg-red-500/5 p-2 rounded border border-red-500/10 italic animate-pulse">
                    Alert: Occupancy distress signal detected at {zone}
                 </div>
               ) : (
                 <div className="text-[10px] text-slate-600 font-bold p-2 italic">
                    Waiting for field check-ins...
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  )
}
