import type { TriageResult } from "@/utils/gemini"
import { AlertTriangle, Zap, MapPin, Wind, Shield, Activity } from "lucide-react"

const SEVERITY_CONFIG = {
  LOW:      { color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/30",   bar: "bg-blue-500"   },
  MEDIUM:   { color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/30",  bar: "bg-amber-500"  },
  HIGH:     { color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", bar: "bg-orange-500" },
  CRITICAL: { color: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-500/30",    bar: "bg-red-500"    },
}

export default function TriageCard({ triage, loading }: { triage: TriageResult | null, loading: boolean }) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 animate-pulse">
        <div className="flex items-center gap-3">
          <Activity className="h-5 w-5 text-red-500 animate-spin" />
          <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            AI Triage Engine Active...
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-slate-800/50" />
          ))}
        </div>
      </div>
    )
  }

  if (!triage) return null

  const cfg = SEVERITY_CONFIG[triage.severity] ?? SEVERITY_CONFIG.HIGH

  return (
    <div className={`rounded-xl border ${cfg.border} ${cfg.bg} p-6 space-y-5`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className={`h-5 w-5 ${cfg.color}`} />
          <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">
            AI Triage Analysis
          </span>
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${cfg.color} ${cfg.bg} border ${cfg.border}`}>
          {triage.severity}
        </div>
      </div>

      {/* Urgency Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          <span>Urgency Score</span>
          <span className={cfg.color}>{triage.urgencyScore}/100</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${cfg.bar}`}
            style={{ width: `${triage.urgencyScore}%` }}
          />
        </div>
      </div>

      {/* Key Data Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> Confirmed Type
          </div>
          <div className="text-sm font-black italic">{triage.confirmedType}</div>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-1">
            <Shield className="h-3 w-3" /> Response Mode
          </div>
          <div className="text-sm font-black italic">{triage.responseMode}</div>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1 col-span-2">
          <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-1">
            <MapPin className="h-3 w-3" /> Zone Identified
          </div>
          <div className="text-sm font-black italic">{triage.zone}</div>
        </div>

        <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/20 col-span-2 space-y-1">
          <div className="text-[10px] text-orange-500 uppercase font-black tracking-widest flex items-center gap-1">
            <Wind className="h-3 w-3" /> Spread Risk
          </div>
          <div className="text-xs text-slate-300 font-bold leading-relaxed">{triage.spreadRisk}</div>
        </div>
      </div>

      {/* Immediate Action — High visibility */}
      <div className={`p-4 rounded-lg border ${cfg.border} ${cfg.bg}`}>
        <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">
          ⚡ Immediate Action Required
        </div>
        <div className={`text-sm font-black ${cfg.color} leading-relaxed`}>
          {triage.immediateAction}
        </div>
      </div>
    </div>
  )
}
