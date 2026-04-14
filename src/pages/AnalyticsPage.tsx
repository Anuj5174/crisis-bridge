import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from "recharts"
import { BarChart3, Clock, AlertTriangle, Download, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

const DATA_VOLUME = [
  { name: "Mon", volume: 4 },
  { name: "Tue", volume: 7 },
  { name: "Wed", volume: 5 },
  { name: "Thu", volume: 12 },
  { name: "Fri", volume: 8 },
  { name: "Sat", volume: 15 },
  { name: "Sun", volume: 10 },
]

const DATA_CATEGORIES = [
  { name: "Medical", value: 35, color: "#10b981" },
  { name: "Fire", value: 15, color: "#ef4444" },
  { name: "Security", value: 40, color: "#3b82f6" },
  { name: "Other", value: 10, color: "#f59e0b" },
]



export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-emerald-500" />
            Operations Analytics
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Strategic response performance data</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 border-slate-800 text-slate-400">
            <Calendar className="h-4 w-4" /> Last 30 Days
          </Button>
          <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            <Download className="h-4 w-4" /> Export tactical Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/40 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Incidents</p>
                <p className="text-3xl font-black italic">142</p>
              </div>
              <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Avg Response Time</p>
                <p className="text-3xl font-black italic">1m 42s</p>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <Clock className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Safety Rating</p>
                <p className="text-3xl font-black italic">98.2%</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <BarChart3 className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/40 border-slate-800 glass">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest">Weekly Incident Volume</CardTitle>
            <CardDescription>Frequency analysis across 7-day operations</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pt-4">
            <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 0, height: 0 }}>
              <BarChart data={DATA_VOLUME}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="volume" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800 glass">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest">Category Distribution</CardTitle>
            <CardDescription>Breakdown by emergency classification</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center pt-4">
            <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 0, height: 0 }}>
              <PieChart>
                <Pie data={DATA_CATEGORIES} innerRadius={80} outerRadius={100} paddingAngle={5} dataKey="value">
                  {DATA_CATEGORIES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
