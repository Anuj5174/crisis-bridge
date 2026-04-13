import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { supabase } from "@/utils/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ShieldAlert, 
  MapPin, 
  Clock, 
  MessageSquare, 
  CheckSquare, 
  ChevronLeft,
  Send
} from "lucide-react"

export default function IncidentDetailPage() {
  const { id } = useParams()
  const [incident, setIncident] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('incidents')
        .select('*')
        .eq('id', id)
        .single()
      
      setIncident(data)
      setLoading(false)
    }
    fetchData()
  }, [id])

  if (loading) return <div className="p-20 text-center animate-pulse">Retrieving Tactical Data...</div>
  if (!incident) return <div className="p-20 text-center">Incident not found.</div>

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <Link to="/admin">
          <Button variant="ghost" className="gap-2 text-slate-400 hover:text-white">
            <ChevronLeft className="h-4 w-4" /> Back to Monitor
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" className="text-xs uppercase font-black text-red-500 border-red-600/30">
            Escalate
          </Button>
          <Button className="text-xs uppercase font-black bg-emerald-600 hover:bg-emerald-700">
            Mark Resolved
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="divide-y divide-slate-800">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="destructive" className="font-black px-3 py-1 uppercase">{incident.severity}</Badge>
                <span className="text-slate-500 font-mono text-xs">#{incident.id.slice(0,8)}</span>
              </div>
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">{incident.type} Emergency</h1>
              <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest pt-2">
                <div className="flex items-center gap-1"><MapPin className="h-3 w-3 text-red-500" /> {incident.location}</div>
                <div className="flex items-center gap-1"><Clock className="h-3 w-3 text-red-500" /> Reported {new Date(incident.created_at).toLocaleTimeString()}</div>
              </div>
              <p className="mt-6 text-slate-300 leading-relaxed font-medium bg-slate-800/20 p-4 rounded-lg border border-slate-800/50 italic">
                "{incident.description || 'No description provided.'}"
              </p>
            </div>

            <div className="p-6 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-emerald-500" />
                SOP Checklist
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {["Confirm evacuation", "Dispatch team", "Establish comms"].map((s, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="h-5 w-5 rounded-md border-2 border-slate-700" />
                    <span className="text-xs font-bold text-slate-400">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col h-full space-y-6">
          <Card className="flex-1 flex flex-col min-h-[400px]">
            <CardHeader className="border-b border-slate-800 pb-4">
              <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                COMMS
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-4 italic text-slate-500 text-xs">
              Channel established. Waiting for field update...
            </CardContent>
            <div className="p-4 border-t border-slate-800">
              <div className="relative">
                <input placeholder="Transmit..." className="w-full h-11 bg-slate-950 border border-slate-800 rounded-lg pl-4 pr-12 text-xs focus:ring-1 focus:ring-blue-500 outline-none" />
                <button className="absolute right-2 top-1.5 h-8 w-8 flex items-center justify-center rounded-md bg-blue-600">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
