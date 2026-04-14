import type { PostIncidentReport } from "@/utils/gemini"
import { ClipboardCheck, ListOrdered, FileSearch, Lightbulb, CheckCircle, Printer } from "lucide-react"

export default function AfterActionReport({ report }: { report: PostIncidentReport }) {
  return (
    <div className="bg-[#0b0f1a] border border-emerald-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.1)]">
      <div className="bg-emerald-600/10 border-b border-emerald-600/20 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
           <ClipboardCheck className="h-6 w-6 text-emerald-500" />
           <h2 className="text-xl font-black uppercase italic tracking-tighter">After-Action Report (AAR)</h2>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
           <Printer className="h-3 w-3" />
           Print AAR
        </button>
      </div>

      <div className="p-8 space-y-8">
         {/* AI Summary */}
         <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
               <FileSearch className="h-4 w-4" /> Incident Summary
            </div>
            <p className="text-slate-300 font-medium leading-relaxed italic border-l-4 border-emerald-600 pl-4 py-1">
               "{report.summary}"
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Timeline */}
            <div className="space-y-4">
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                  <ListOrdered className="h-4 w-4" /> Response Timeline
               </div>
               <div className="space-y-3 border-l-2 border-slate-800 ml-2 pl-6 pt-2">
                  {report.timeline.map((item, i) => (
                    <div key={i} className="relative mb-6 last:mb-0">
                       <div className="absolute -left-[31px] top-1.5 h-2 w-2 rounded-full bg-slate-800 border-4 border-[#0b0f1a]" />
                       <span className="text-[10px] font-mono text-slate-500 block mb-1">{item.time}</span>
                       <span className="text-xs font-bold text-slate-300">{item.event}</span>
                    </div>
                  ))}
               </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-4">
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                  <Lightbulb className="h-4 w-4" /> Safety Recommendations
               </div>
               <div className="space-y-3">
                  {report.recommendations.map((rec, i) => (
                    <div key={i} className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg flex gap-3 items-center group hover:border-emerald-500/30 transition-all">
                       <CheckCircle className="h-4 w-4 text-emerald-600" />
                       <span className="text-xs font-bold text-slate-400 group-hover:text-slate-200">{rec}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {report.bottlenecks && (
           <div className="mt-8 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 block mb-2">Performance Analytics Observation:</span>
              <p className="text-xs text-slate-300 font-medium italic">
                 {report.bottlenecks}
              </p>
           </div>
         )}
      </div>
    </div>
  )
}
