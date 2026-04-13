import { useState } from "react"
import { supabase } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Siren, Flame, Plus, Lock, CheckCircle2, History } from "lucide-react"

export default function GuestPage() {
  const [loading, setLoading] = useState(false)
  const [incidentId, setIncidentId] = useState<string | null>(null)
  const [step, setStep] = useState<'initial' | 'reporting' | 'reported'>('initial')

  async function triggerSOS() {
    setStep('reporting')
  }

  async function submitReport(type: string) {
    setLoading(true)
    
    const location = "Main Lobby - Sector 4" 
    const description = `${type} emergency reported via Guest SOS portal.`

    const { data, error } = await supabase
      .from('incidents')
      .insert({
        type,
        severity: type === 'Fire' ? 'CRITICAL' : 'HIGH',
        location,
        description,
        status: 'REPORTED'
      })
      .select()
      .single()

    if (error) {
      console.error("SOS Error:", error)
      const isConnectionError = error.message?.includes("Failed to fetch") || error.message?.includes("fetch");
      const errorMsg = isConnectionError 
        ? "CONNECTION ERROR: Terminal offline. Please check your network or configuration."
        : `SOS ERROR: ${error.message}. Please try again.`;
      
      alert(errorMsg)
    } else {
      setIncidentId(data.id)
      setStep('reported')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white flex flex-col items-center justify-center p-6 selection:bg-red-500/30">
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent shadow-[0_0_20px_rgba(220,38,38,0.5)]" />

      <AnimatePresence mode="wait">
        {step === 'initial' && (
          <motion.div 
            key="initial"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center gap-12"
          >
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-black tracking-tighter uppercase italic text-red-600">
                CrisisBridge
              </h1>
              <p className="text-xs font-bold uppercase tracking-[0.4em] opacity-40">Tactical Response Link</p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-8 bg-red-600/20 rounded-full blur-3xl group-hover:bg-red-600/30 transition-all duration-700" />
              <Button 
                variant="sos"
                size="xl"
                onClick={triggerSOS}
                disabled={loading}
              >
                SOS
              </Button>
            </div>

            <p className="text-sm font-medium text-slate-400 max-w-[200px] text-center leading-relaxed">
              Tap for immediate emergency assistance
            </p>
          </motion.div>
        )}

        {step === 'reporting' && (
          <motion.div 
            key="reporting"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Siren className="w-5 h-5 text-red-500 animate-pulse" />
                  Select Type
                </CardTitle>
                <CardDescription>Dispatch will be alerted immediately.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Button 
                  onClick={() => submitReport('Medical')}
                  disabled={loading}
                  className="h-20 flex flex-col gap-1 items-start bg-slate-800/50 border-emerald-500/20 hover:border-emerald-500/50"
                  variant="outline"
                >
                  <div className="flex items-center gap-2 font-black uppercase tracking-widest text-emerald-500">
                    <Plus className="w-4 h-4" /> Medical
                  </div>
                  <span className="text-xs text-slate-400">Injury, Illness, Unconscious</span>
                </Button>
                
                <Button 
                  onClick={() => submitReport('Fire')}
                  disabled={loading}
                  className="h-20 flex flex-col gap-1 items-start bg-slate-800/50 border-orange-500/20 hover:border-orange-500/50"
                  variant="outline"
                >
                  <div className="flex items-center gap-2 font-black uppercase tracking-widest text-orange-500">
                    <Flame className="w-4 h-4" /> Fire / Smoke
                  </div>
                  <span className="text-xs text-slate-400">Visible Fire, Smoke, Gas Smell</span>
                </Button>

                <Button 
                  onClick={() => submitReport('Security')}
                  disabled={loading}
                  className="h-20 flex flex-col gap-1 items-start bg-slate-800/50 border-blue-500/20 hover:border-blue-500/50"
                  variant="outline"
                >
                  <div className="flex items-center gap-2 font-black uppercase tracking-widest text-blue-500">
                    <Lock className="w-4 h-4" /> Security
                  </div>
                  <span className="text-xs text-slate-400">Threat, Theft, Altercation</span>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 'reported' && (
          <motion.div 
            key="reported"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 mb-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tighter uppercase italic text-white">Reported</h2>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">
                Incident <span className="text-white font-mono">{incidentId?.slice(0, 8)}</span> active.
              </p>
            </div>

            <Button variant="ghost" className="text-slate-500 hover:text-white" onClick={() => setStep('initial')}>
              <History className="w-4 h-4 mr-2" /> View History
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-8 text-center px-8 opacity-20 pointer-events-none">
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">
          SECURE CHANNEL 04A // CRISISBRIDGE OPERATIONS
        </p>
      </div>
    </div>
  )
}
