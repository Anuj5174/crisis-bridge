import { useIncidents } from "@/hooks/useIncidents"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import { 
  AlertTriangle, 
  MapPin, 
  Activity,
  User,
  Clock,
  ExternalLink,
  ShieldAlert,
  Search,
  Siren
} from "lucide-react"

export default function AdminDashboard() {
  const { incidents, loading } = useIncidents()

  const stats = [
    { name: "Active Crisis", value: incidents.filter(i => i.status !== 'RESOLVED').length, color: "text-red-500", icon: AlertTriangle },
    { name: "Avg Response", value: "1m 12s", color: "text-emerald-500", icon: Clock },
    { name: "Team Sync", value: "100%", color: "text-blue-500", icon: Activity },
    { name: "Personnel", value: "18 On-Site", color: "text-slate-400", icon: User },
  ]

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <ShieldAlert className="h-12 w-12 text-red-600 animate-pulse" />
          <p className="text-xs font-black uppercase tracking-[0.4em] opacity-40">Connecting Feed...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-slate-800 bg-slate-900/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500">{stat.name}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color} opacity-70`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tighter">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <div>
              <h3 className="text-xl font-black tracking-tighter flex items-center gap-2 italic uppercase">
                <Siren className="h-5 w-5 text-red-500" />
                Live Command Feed
              </h3>
            </div>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input placeholder="Search Active..." className="h-8 w-40 pl-9 pr-4 text-xs bg-slate-900 border border-slate-800 rounded-md outline-none" />
            </div>
          </div>

          <Card className="border-slate-800 bg-slate-900/20">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] uppercase font-black text-slate-500 bg-slate-900/80 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4 tracking-[0.2em]">Incident</th>
                    <th className="px-6 py-4 tracking-[0.2em]">Location</th>
                    <th className="px-6 py-4 tracking-[0.2em]">Severity</th>
                    <th className="px-6 py-4 tracking-[0.2em]">Status</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <AnimatePresence mode="popLayout">
                    {incidents.map((incident) => (
                      <motion.tr 
                        key={incident.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-5">
                          <div className="font-black italic">{incident.type}</div>
                          <div className="text-[10px] text-slate-500 font-mono">#{incident.id.slice(0,8)}</div>
                        </td>
                        <td className="px-6 py-5 uppercase font-bold text-xs flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-red-500" /> {incident.location}
                        </td>
                        <td className="px-6 py-5">
                          <Badge variant={incident.severity === 'CRITICAL' ? 'destructive' : 'default'} className="text-[9px]">
                            {incident.severity}
                          </Badge>
                        </td>
                        <td className="px-6 py-5 font-black text-[10px] uppercase italic">
                          <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${incident.status === 'REPORTED' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                          {incident.status}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <Link to={`incidents/${incident.id}`}>
                            <Button variant="ghost" size="icon">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-slate-800 bg-slate-900/40">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-emerald-500" />
                Response Log
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { time: "14:42", event: "Security Team B dispatched" },
                { time: "14:40", event: "Incident #4A2 initiated" },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 border-l-2 border-slate-800 pl-4 py-1">
                  <div>
                    <span className="text-[10px] font-black font-mono text-slate-500">{item.time}</span>
                    <p className="text-xs font-bold leading-tight">{item.event}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
