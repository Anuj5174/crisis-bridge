import { useState, useEffect } from "react"
import { Clock, Bell, CheckCircle, Radio, Loader2 } from "lucide-react"

export default function OrchestrationPanel({ startTime }: { startTime: string }) {
  const [elapsed, setElapsed] = useState("00:00")

  useEffect(() => {
    const start = new Date(startTime).getTime()
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const diff = now - start
      const m = Math.floor(diff / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setElapsed(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`)
    }, 1000)
    return () => clearInterval(interval)
  }, [startTime])

  const alerts = [
    { time: "0s", msg: "Incident Detect. System Armed.", status: "DONE" },
    { time: "2s", msg: "AI Triage Completed.", status: "DONE" },
    { time: "4s", msg: "Floor Manager Notified.", status: "DONE" },
    { time: "7s", msg: "Security Dispatch Triggered.", status: "DONE" },
    { time: "12s", msg: "Zone-Targeted SOP Broadcasted.", status: "DONE" },
    { time: "LIVE", msg: "Monitoring responder movement...", status: "PENDING" },
  ]

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
      <div className="bg-slate-800/50 p-4 border-b border-slate-800 flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
          <Radio className="h-4 w-4 text-emerald-500 animate-pulse" />
          Auto-Orchestration Log
        </h3>
        <div className="flex items-center gap-2 px-3 py-1 bg-black rounded-lg border border-slate-800">
          <Clock className="h-3 w-3 text-red-500" />
          <span className="text-xs font-mono font-black text-red-500">{elapsed}</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {alerts.map((a, i) => (
          <div key={i} className="flex gap-4 items-start relative pb-4 last:pb-0">
             {/* Timeline Line */}
             {i !== alerts.length - 1 && (
               <div className="absolute left-[7px] top-4 w-[2px] h-full bg-slate-800" />
             )}
             
             <div className="mt-1">
                {a.status === 'DONE' ? (
                  <div className="h-3.5 w-3.5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <CheckCircle className="h-2 w-2 text-black" strokeWidth={4} />
                  </div>
                ) : (
                  <Loader2 className="h-4 w-4 text-amber-500 animate-spin" />
                )}
             </div>

             <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                   <span className={`text-[10px] font-black uppercase tracking-widest ${a.status === 'DONE' ? 'text-slate-300' : 'text-amber-500'}`}>
                      {a.msg}
                   </span>
                   <span className="text-[9px] font-mono text-slate-600">{a.time}</span>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-emerald-500/5 p-3 flex items-center justify-center gap-2 border-t border-slate-800">
         <Bell className="h-3 w-3 text-emerald-500" />
         <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
            External Emergency Feed Active
         </span>
      </div>
    </div>
  )
}
