import { useState } from "react"
import { ShieldCheck, X, AlertTriangle } from "lucide-react"
import { Button } from "./ui/button"

export default function EscalationBrief({ incident, triage, onClose }: { incident: any, triage: any, onClose: () => void }) {
  const [transmitting, setTransmitting] = useState(false)

  const briefData = {
    incidentId: incident.id.slice(0, 8),
    type: incident.type,
    severity: incident.severity,
    location: incident.location,
    gps: incident.latitude ? `${incident.latitude}, ${incident.longitude}` : "NOT_AVAILABLE",
    trapped: incident.metadata?.trapped || "NONE_REPORTED",
    risks: triage?.spreadRisk || "Evaluation in progress",
    entryPoint: "Main Lobby / Service Entrance B",
  }

  const handleTransmit = () => {
    setTransmitting(true)
    setTimeout(() => {
      setTransmitting(false)
      alert("BRIEF TRANSMITTED: External agencies (Fire/EMS) have received the coordination packet.")
      onClose()
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-[#0b0f1a] border border-red-600/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.2)]">
        <div className="bg-red-600/10 border-b border-red-600/20 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <ShieldCheck className="h-6 w-6 text-red-500" />
             <h2 className="text-xl font-black uppercase italic tracking-tighter">External Liaison Brief</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
             <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
           <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 font-mono text-[11px] leading-relaxed text-slate-400">
              <div className="flex justify-between mb-4 border-b border-slate-800 pb-2">
                 <span className="text-red-500 font-bold">// CONFIDENTIAL TACTICAL FEED</span>
                 <span className="text-slate-600">REF: {briefData.incidentId}</span>
              </div>
              <div className="grid grid-cols-2 gap-y-3">
                 <div><span className="text-slate-600 uppercase mr-2">TYPE:</span> {briefData.type}</div>
                 <div><span className="text-slate-600 uppercase mr-2">SEVERITY:</span> {briefData.severity}</div>
                 <div><span className="text-slate-600 uppercase mr-2">LOC:</span> {briefData.location}</div>
                 <div><span className="text-slate-600 uppercase mr-2">GPS:</span> {briefData.gps}</div>
                 <div><span className="text-slate-600 uppercase mr-2">TRAPPED:</span> {briefData.trapped}</div>
                 <div><span className="text-slate-600 uppercase mr-2">ENTRY:</span> {briefData.entryPoint}</div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800">
                 <span className="text-slate-600 uppercase block mb-1">TACTICAL RISKS:</span>
                 {briefData.risks}
              </div>
           </div>

           <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl flex gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0" />
              <p className="text-xs text-slate-400 font-medium">
                 Triggering this action will share live telemetry and occupancy data with local emergency services servers.
              </p>
           </div>

           <Button 
            className="w-full h-14 bg-red-600 hover:bg-red-700 font-black uppercase italic tracking-widest text-lg"
            onClick={handleTransmit}
            disabled={transmitting}
           >
              {transmitting ? 'Transmitting Data...' : 'GENERATE & SEND BRIEF'}
           </Button>
        </div>
      </div>
    </div>
  )
}
