import { useState } from "react"
import { User, ShieldCheck, Briefcase, Map, Info, AlertTriangle } from "lucide-react"
import { Button } from "./ui/button"

export default function RoleInstructions({ type, severity, zone }: { type: string, severity: string, zone: string }) {
  const [activeRole, setActiveRole] = useState<'Guest' | 'Staff' | 'Admin'>('Guest')

  const content = {
    Guest: {
      icon: User,
      heading: "Emergency Evacuation Card",
      warning: "Leave area immediately. Follow illuminated exit signs.",
      actions: [
        "Use Staircase B for quickest exit from " + zone,
        "DO NOT use elevators/lifts",
        "Assist those with limited mobility",
        "Assemble at Assembly Point A (Main Parking)"
      ]
    },
    Staff: {
      icon: Briefcase,
      heading: "Responder Task Card",
      warning: "Verify zone status. Report obstacles via radio.",
      actions: [
        "Inspect " + zone + " for guest presence",
        "Guide guests toward Staircase B",
        "Confirm floor smoke seals are active",
        "Use Class-C extinguisher ONLY if fire is contained"
      ]
    },
    Admin: {
      icon: ShieldCheck,
      heading: "Crisis Management Protocol",
      warning: "Coordinating external emergency responders.",
      actions: [
        "Trigger mass notification for Floor 2 East Wing",
        "Alert City Fire Services via direct line",
        "Confirm all Floor managers have acknowledged",
        "Prepare external brief for incoming Fire Dept"
      ]
    }
  }

  const role = content[activeRole]

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-1 flex flex-col h-full">
      {/* Role Tabs */}
      <div className="grid grid-cols-3 gap-1 p-1">
         {Object.keys(content).map((r) => (
           <button
             key={r}
             onClick={() => setActiveRole(r as any)}
             className={`py-2 px-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
               activeRole === r 
                ? 'bg-red-600 text-white shadow-lg' 
                : 'text-slate-500 hover:bg-slate-800'
             }`}
           >
             {r} View
           </button>
         ))}
      </div>

      <div className="p-4 flex-1 space-y-5 flex flex-col">
         <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${activeRole === 'Guest' ? 'bg-orange-500/20 text-orange-500' : activeRole === 'Staff' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-blue-500/20 text-blue-500'}`}>
               <role.icon className="h-5 w-5" />
            </div>
            <div>
               <h4 className="text-xs font-black uppercase tracking-widest">{role.heading}</h4>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{type} // {severity}</p>
            </div>
         </div>

         <div className="p-3 bg-red-600/10 border border-red-600/30 rounded-lg flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
            <p className="text-[10px] font-black uppercase text-red-500 italic">{role.warning}</p>
         </div>

         <div className="space-y-3 flex-1 overflow-y-auto">
            {role.actions.map((act, i) => (
              <div key={i} className="flex gap-3 items-start group">
                 <div className="h-5 w-5 flex items-center justify-center rounded bg-slate-800 text-[10px] font-black text-slate-400 group-hover:bg-red-600 transition-colors">
                    {i + 1}
                 </div>
                 <span className="text-xs text-slate-400 font-bold leading-relaxed">{act}</span>
              </div>
            ))}
         </div>

         <div className="pt-4 border-t border-slate-800 flex gap-2">
            <Button variant="outline" className="flex-1 h-9 text-[10px] border-slate-800 text-slate-500">
               <Map className="h-3 w-3 mr-2 text-slate-500" />
               Zone Map
            </Button>
            <Button variant="outline" className="flex-1 h-9 text-[10px] border-slate-800 text-slate-500">
               <Info className="h-3 w-3 mr-2 text-slate-500" />
               Details
            </Button>
         </div>
      </div>
    </div>
  )
}
