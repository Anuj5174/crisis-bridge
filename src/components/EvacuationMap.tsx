import { motion } from "framer-motion"
import { Navigation, Info, AlertOctagon } from "lucide-react"

export default function EvacuationMap({ zone }: { zone: string }) {
  // Simplified tactical schematic representation
  const isFloor2 = zone.toLowerCase().includes('2') || zone.toLowerCase().includes('second')

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
      <div className="flex items-center justify-between mb-2">
         <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tactical Evacuation Flow</h3>
         <div className="px-2 py-0.5 rounded bg-red-600/10 border border-red-600/30 text-[9px] font-black text-red-500 uppercase italic">
            Live Route Update
         </div>
      </div>

      {/* Simplified Floorplan Logic Visualization */}
      <div className="relative h-48 bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
         {/* Grid background */}
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
         
         {/* Zones Layout (Simplified Boxes) */}
         <div className="absolute inset-4 border-2 border-slate-800 rounded-md">
            {/* North Wing */}
            <div className="absolute top-0 w-full h-1/3 border-b border-slate-800 flex items-center justify-center text-[8px] font-black uppercase text-slate-700">North Wing</div>
            
            {/* Central Corridor */}
            <div className="absolute top-1/3 w-full h-1/3 border-b border-slate-800 bg-slate-900/40">
               {/* Safe Path Green Line */}
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: '80%' }}
                 transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                 className="absolute top-1/2 left-0 h-1 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transform -translate-y-1/2" 
               />
               <Navigation className="absolute top-1/2 left-[80%] h-3 w-3 text-emerald-500 -rotate-90 transform -translate-x-1/2 -translate-y-1/2" />
            </div>

            {/* Affected Zone Marker */}
            <div className={`absolute right-4 top-1/4 h-16 w-24 rounded border-2 group ${isFloor2 ? 'border-red-600 bg-red-600/20' : 'border-slate-800 bg-slate-800/10'}`}>
               {isFloor2 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                     <AlertOctagon className="h-4 w-4 text-red-500 animate-pulse" />
                     <span className="text-[7px] font-black uppercase text-red-500">Fire Zone</span>
                  </div>
               )}
            </div>

            {/* Blocked Marking */}
            {isFloor2 && (
              <div className="absolute top-1/2 right-[120px] h-8 w-4 bg-orange-500/20 border-x-4 border-orange-500 flex items-center justify-center overflow-hidden">
                 <div className="text-[6px] font-black uppercase tracking-tighter text-orange-500 rotate-90 whitespace-nowrap">BLOCKED</div>
              </div>
            )}

            {/* Exit Marking */}
            <div className="absolute left-2 top-1/2 h-8 w-8 rounded-lg border-2 border-emerald-500 flex items-center justify-center">
               <span className="text-[8px] font-black text-emerald-500">EXIT B</span>
            </div>
         </div>
      </div>

      {/* Tactical Brief */}
      <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
         <div className="flex items-center gap-2 mb-2">
            <Info className="h-3 w-3 text-blue-500" />
            <span className="text-[10px] font-black uppercase text-slate-400">Dynamic Guidance Brief</span>
         </div>
         <p className="text-xs font-bold text-slate-300">
            {isFloor2 ? 'CRITICAL: Blockage detected in East Corridor. All Floor 2 occupants must divert to North Staircase B. Assemble at Parking Lot A.' : 'All routes normal. Proceed to nearest illuminated exit sign.'}
         </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
         <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[9px] font-black uppercase text-emerald-500">Path Secure</span>
         </div>
         <div className="bg-red-500/10 border border-red-500/20 p-2 rounded flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
            <span className="text-[9px] font-black uppercase text-red-500">Critical Zone</span>
         </div>
      </div>
    </div>
  )
}
