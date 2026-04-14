import { Settings, Shield, Database } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-3">
          <Settings className="h-8 w-8 text-slate-500" />
          System Settings
        </h1>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Configure tactical operational parameters</p>
      </div>

      <div className="grid gap-6 max-w-4xl">
        <Card className="bg-slate-900/40 border-slate-800 glass">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              <CardTitle className="text-sm font-black uppercase tracking-widest">Security Configuration</CardTitle>
            </div>
            <CardDescription>Manage authentication and access protocols</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-lg">
              <div>
                <p className="text-sm font-bold">Encrypted Data Stream</p>
                <p className="text-xs text-slate-500">Enable AES-256 encryption for all incident reports</p>
              </div>
              <Button size="sm" className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30">Enabled</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-lg">
              <div>
                <p className="text-sm font-bold">Multi-Factor Auth</p>
                <p className="text-xs text-slate-500">Require secondary tactical token for admin access</p>
              </div>
              <Button size="sm" variant="outline" className="border-slate-800 text-slate-400">Configure</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800 glass">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-500" />
              <CardTitle className="text-sm font-black uppercase tracking-widest">Backend Connection</CardTitle>
            </div>
            <CardDescription>Supabase infrastructure synchronization status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-sm font-bold text-amber-500">Pending Configuration</p>
              <p className="text-xs text-slate-400 mt-1">
                Environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be configured in .env for live operations.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
