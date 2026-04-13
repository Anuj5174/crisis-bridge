import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ShieldAlert, Fingerprint, Lock, Siren } from "lucide-react"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin() {
    setLoading(true)
    setTimeout(() => {
      navigate('/admin')
      setLoading(false)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white flex flex-col items-center justify-center p-6 selection:bg-red-500/30 overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-red-600/10 blur-[150px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-12 w-full max-w-md"
      >
        <div className="text-center">
          <ShieldAlert className="h-16 w-16 text-red-600 mx-auto mb-6 shadow-[0_0_20px_rgba(220,38,38,0.5)]" />
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">CrisisBridge</h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2">OPERATIONS ACCESS TERMINAL</p>
        </div>

        <Card className="w-full border-slate-800 bg-slate-900/40 backdrop-blur-3xl shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />
          
          <CardHeader className="text-center space-y-2 pt-8">
            <CardTitle>System Authentication</CardTitle>
            <CardDescription>ENTER CREDENTIALS FOR SECURE GATEWAY ACCESS</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pb-12">
            <div className="space-y-4">
              <div className="relative group">
                <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-hover:text-red-500 transition-colors" />
                <input 
                  type="email" 
                  placeholder="TERMINAL IDENTITY (EMAIL)" 
                  defaultValue="admin@crisisbridge.com"
                  className="w-full h-12 bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 text-xs font-bold font-mono focus:ring-1 focus:ring-red-600 outline-none transition-all"
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-hover:text-red-500 transition-colors" />
                <input 
                  type="password" 
                  placeholder="PASS-AUTHORIZATION-CODE" 
                  defaultValue="••••••••"
                  className="w-full h-12 bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 text-xs font-bold font-mono focus:ring-1 focus:ring-red-600 outline-none transition-all"
                />
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full h-14 rounded-xl relative overflow-hidden group shadow-red-600/10 shadow-lg"
              onClick={handleLogin}
              disabled={loading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 group-hover:scale-105 transition-transform duration-500" />
              <span className="relative flex items-center gap-2">
                {loading ? "AUTHENTICATING..." : "ESTABLISH CONNECTION →"}
              </span>
            </Button>

            <div className="flex items-center justify-between px-1">
              <Link to="/" className="text-[10px] font-black uppercase text-slate-600 hover:text-white transition-colors">Request Access</Link>
              <button className="text-[10px] font-black uppercase text-slate-600 hover:text-red-500 transition-colors flex items-center gap-1">
                 Emergency Bypass <Siren className="h-3 w-3" />
              </button>
            </div>
          </CardContent>
        </Card>

        <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 text-center leading-relaxed">
          AUTHORIZED USE ONLY. ALL OPERATIONS ARE LOGGED UNDER <br />
          CRISISBRIDGE AUDIT PROTOCOL SECTION 4.C.
        </p>
      </motion.div>
    </div>
  )
}
