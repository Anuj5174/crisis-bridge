import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { supabase } from "@/utils/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  MapPin, 
  Clock, 
  MessageSquare, 
  CheckSquare, 
  ChevronLeft,
  Send,
  Loader2,
  User,
  Activity
} from "lucide-react"
import { runFullTriage } from "@/utils/gemini"
import type { TriageResult } from "@/utils/gemini"
import type { Incident } from "@/hooks/useIncidents"
import TriageCard from "@/components/TriageCard"

import OrchestrationPanel from "@/components/OrchestrationPanel"
import RoleInstructions from "@/components/RoleInstructions"
import EscalationBrief from "@/components/EscalationBrief"
import { generatePIR } from "@/utils/gemini"
import type { PostIncidentReport } from "@/utils/gemini"
import AfterActionReport from "@/components/AfterActionReport"
import OccupantTracker from "@/components/OccupantTracker"
import EvacuationMap from "@/components/EvacuationMap"

export default function IncidentDetailPage() {
  const { id } = useParams()
  const [incident, setIncident] = useState<Incident | null>(null)
  const [triage, setTriage] = useState<TriageResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [triageLoading, setTriageLoading] = useState(false)
  const [showEscalation, setShowEscalation] = useState(false)
  const [pir, setPir] = useState<PostIncidentReport | null>(null)
  const [resolving, setResolving] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('incidents')
        .select('*')
        .eq('id', id)
        .single()
      
      setIncident(data)
      setLoading(false)

      if (data && data.status !== 'RESOLVED') {
        setTriageLoading(true);
        const result = await runFullTriage(data.type, data.location, data.description || "", data.metadata);
        setTriage(result);
        setTriageLoading(false);
      }
    }
    if (id) fetchData()
  }, [id])

  async function handleResolve() {
    if (!incident) return
    setResolving(true)
    
    const { error } = await supabase
      .from('incidents')
      .update({ status: 'RESOLVED' })
      .eq('id', incident.id)

    if (!error) {
      const generatedPir = await generatePIR(incident, triage || undefined)
      setPir(generatedPir)
      setIncident({ ...incident, status: 'RESOLVED' })
    }
    setResolving(false)
  }

  if (loading) return <div className="p-20 text-center animate-pulse text-red-500 font-bold uppercase tracking-widest">Retrieving Tactical Data...</div>
  if (!incident) return <div className="p-20 text-center font-mono">Incident not found.</div>

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {showEscalation && (
        <EscalationBrief 
          incident={incident} 
          triage={triage} 
          onClose={() => setShowEscalation(false)} 
        />
      )}

      <div className="flex items-center justify-between">
        <Link to="/admin">
          <Button variant="ghost" className="gap-2 text-slate-400 hover:text-white">
            <ChevronLeft className="h-4 w-4" /> Back to Monitor
          </Button>
        </Link>
        <div className="flex gap-2">
          {incident.status !== 'RESOLVED' ? (
            <>
              <Button 
                variant="outline" 
                className="text-xs uppercase font-black text-red-500 border-red-600/30"
                onClick={() => setShowEscalation(true)}
              >
                Escalate
              </Button>
              <Button 
                className="text-xs uppercase font-black bg-emerald-600 hover:bg-emerald-700 w-32"
                onClick={handleResolve}
                disabled={resolving}
              >
                {resolving ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Mark Resolved'}
              </Button>
            </>
          ) : (
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-black px-4 py-2 uppercase tracking-widest italic">RESOLVED</Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {pir && <AfterActionReport report={pir} />}
          
          {/* AI TRIAGE LAYER - Hide if PIR is visible to focus on report */}
          {!pir && <TriageCard triage={triage} loading={triageLoading} />}

          <Card className="divide-y divide-slate-800 overflow-hidden">
            <div className="p-6 relative">
              {/* STATUS INDICATOR OVERLAY */}
              <div className="absolute top-0 right-0 p-4">
                 <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-500 italic">Live Feed Active</span>
                 </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Badge variant="destructive" className="font-black px-3 py-1 uppercase">{incident.severity}</Badge>
                <span className="text-slate-500 font-mono text-xs">#{incident.id.slice(0,8)}</span>
                {incident.is_silent && <Badge variant="warning" className="animate-pulse">COVERT SIGNAL</Badge>}
                <Badge variant="outline" className="text-[9px] border-slate-700">{incident.reporter_role || 'Guest'} Reporter</Badge>
              </div>
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">{incident.type} Emergency</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest pt-2">
                <div className="flex items-center gap-1"><MapPin className="h-3 w-3 text-red-500" /> {incident.location}</div>
                <div className="flex items-center gap-1"><Clock className="h-3 w-3 text-red-500" /> Reported {new Date(incident.created_at).toLocaleTimeString()}</div>
              </div>

              {/* DYNAMIC METADATA GRID */}
              {incident.metadata && (
                <div className="grid grid-cols-2 gap-2 mt-4 max-w-sm">
                   {Object.entries(incident.metadata).map(([k, v]) => (
                     <div key={k} className="bg-slate-900 border border-slate-800 p-2 rounded text-[10px] uppercase font-bold tracking-widest">
                        <span className="text-slate-500 mr-2">{k}:</span>
                        <span className="text-white">{String(v)}</span>
                     </div>
                   ))}
                </div>
              )}

              <p className="mt-6 text-slate-300 leading-relaxed font-medium bg-slate-800/20 p-4 rounded-lg border border-slate-800/50 italic">
                "{incident.description || 'No description provided.'}"
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-emerald-500" />
                  Tactical SOP Checklist
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {triageLoading && <p className="text-xs text-slate-500 italic animate-pulse">Calculating optimal response steps...</p>}
                {!triageLoading && triage && triage.checklist.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer group">
                    <div className="h-5 w-5 rounded-md border-2 border-slate-700 group-hover:border-emerald-500 group-hover:bg-emerald-500/20 transition-colors flex-shrink-0" />
                    <span className="text-xs font-bold text-slate-400">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col h-full space-y-6">
          {/* SPRINT 5: ACCOUNTABILITY & EVAC LAYERS */}
          {incident.status !== 'RESOLVED' && (
            <>
              <OccupantTracker incidentId={incident.id} zone={triage?.zone || incident.location} />
              <EvacuationMap zone={triage?.zone || incident.location} />
            </>
          )}

          {/* ORCHESTRATION PANEL */}
          <OrchestrationPanel startTime={incident.created_at} />

          {/* ROLE-AWARE INSTRUCTIONS */}
          <RoleInstructions 
             type={incident.type} 
             severity={incident.severity} 
             zone={triage?.zone || incident.location} 
          />
        </div>
      </div>
    </div>
  )
}
