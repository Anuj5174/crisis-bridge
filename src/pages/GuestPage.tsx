import { useState, useEffect, useRef } from "react"
import { supabase } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Siren, Flame, Plus, Lock, CheckCircle2, History, User, MapPin, AlertCircle, EyeOff, Shield } from "lucide-react"
import EvacuationMap from "@/components/EvacuationMap"

type Step = 'initial' | 'role' | 'category' | 'assessment' | 'reported'
type Category = 'Fire' | 'Medical' | 'Security' | 'Silent'
type Role = 'Guest' | 'Staff' | 'Kitchen' | 'Security'

export default function GuestPage() {
  const [loading, setLoading] = useState(false)
  const [incidentId, setIncidentId] = useState<string | null>(null)
  const [step, setStep] = useState<Step>('initial')
  
  // Incident State
  const [role, setRole] = useState<Role>('Guest')
  const [category, setCategory] = useState<Category>('Fire')
  const [location, setLocation] = useState('')
  const [useLiveLocation, setUseLiveLocation] = useState(false)
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null)
  const [gpsStatus, setGpsStatus] = useState('Awaiting fix...')
  const [metadata, setMetadata] = useState<Record<string, any>>({})
  const [description, setDescription] = useState('')

  // Silent Mode Logic
  const longPressTimer = useRef<any>(null)

  // Live GPS Capture
  useEffect(() => {
    if (!useLiveLocation) {
      setGpsStatus('Manual address enabled')
      return
    }

    if (!('geolocation' in navigator)) {
      setGpsStatus('GPS unsupported')
      return
    }

    if (step !== 'role' && step !== 'assessment') return

    setGpsStatus('Acquiring GPS...')
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setGpsStatus('GPS Locked')
      },
      (err) => {
        console.warn('GPS Denied', err)
        setGpsStatus('GPS unavailable')
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [step, useLiveLocation])

  const startSilentTimer = () => {
    longPressTimer.current = setTimeout(() => {
      submitSilentReport()
    }, 4000)
  }

  const cancelSilentTimer = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current)
  }

  async function submitSilentReport() {
    setLoading(true)
    const { data, error } = await supabase.from('incidents').insert({
      type: 'Silent Distress',
      severity: 'CRITICAL',
      location: 'COVERT_SIGNAL',
      description: 'Covert signal triggered via long-press.',
      status: 'REPORTED',
      is_silent: true,
      latitude: coords?.lat,
      longitude: coords?.lng
    }).select().single()
    
    if (!error) {
      setIncidentId(data.id)
      setStep('reported')
    }
    setLoading(false)
  }

  async function submitFullReport() {
    setLoading(true)
    
const reportedLocation = useLiveLocation && coords ? `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}` : (location || 'Unknown Sector')
      const { data, error } = await supabase.from('incidents').insert({
      type: category,
      severity: (category === 'Fire' || metadata.trapped === 'Yes') ? 'CRITICAL' : 'HIGH',
      location: reportedLocation,
      description: description || `${category} emergency reported by ${role}.`,
      status: 'REPORTED',
      reported_by: role,
      metadata,
      latitude: coords?.lat,
      longitude: coords?.lng,
      is_silent: category === 'Silent'
    }).select().single()

    if (error) {
       console.error(error)
      alert("Transmission failure. Check tactical link.")
    } else {
      setIncidentId(data.id)
      setStep('reported')
    }
    setLoading(false)
  }

  async function updateStatus(status: 'SAFE' | 'NEED_HELP') {
    if (!incidentId) return
    const statusLocation = useLiveLocation && coords ? `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}` : location
    const { error } = await supabase.from('occupant_status').insert({
      incident_id: incidentId,
      name: role === 'Guest' ? 'Guest' : role,
      zone: statusLocation,
      role: role,
      status: status
    })
    
    if (!error) {
      alert(status === 'SAFE' ? "STATUS SENT: Marked SAFE. Stay at assembly point." : "SOS RE-TRANSMITTED: Help needed signal sent.")
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="fixed top-0 left-0 w-full h-1 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)] z-50" />

      <AnimatePresence mode="wait">
        {step === 'initial' && (
          <motion.div key="initial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-12">
            <div 
              onMouseDown={startSilentTimer} 
              onMouseUp={cancelSilentTimer}
              onTouchStart={startSilentTimer}
              onTouchEnd={cancelSilentTimer}
              className="cursor-pointer select-none active:scale-95 transition-transform"
            >
              <h1 className="text-5xl font-black tracking-tighter uppercase italic text-red-600 mb-2">CrisisBridge</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">Tactical Node v2.5</p>
            </div>

            <Button variant="sos" size="xl" onClick={() => setStep('role')}>SOS</Button>
            
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest animate-pulse">
              Hold logo 4s for Silent Distress
            </p>
          </motion.div>
        )}

        {step === 'role' && (
          <motion.div key="role" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-full max-w-md space-y-4">
             <div className="flex items-center gap-2 mb-6">
                <div className="h-1 flex-1 bg-red-600" />
                <div className="h-1 flex-1 bg-slate-800" />
                <div className="h-1 flex-1 bg-slate-800" />
             </div>
             <h2 className="text-2xl font-black uppercase italic tracking-tighter">Identify Your Role</h2>
             <div className="grid grid-cols-2 gap-3">
               {[
                 { id: 'Guest', icon: User, label: 'Guest / Visitor' },
                 { id: 'Staff', icon: Shield, label: 'Hotel Staff' },
                 { id: 'Kitchen', icon: Flame, label: 'Kitchen Crew' },
                 { id: 'Security', icon: Lock, label: 'Security Team' }
               ].map((r) => (
                 <Button 
                   key={r.id} 
                   variant="outline" 
                   className="h-24 flex flex-col gap-2 border-slate-800 bg-slate-900/40 hover:border-red-500/50"
                   onClick={() => { setRole(r.id as Role); setStep('category'); }}
                 >
                   <r.icon className="h-6 w-6 text-red-500" />
                   <span className="text-[10px] font-black uppercase tracking-widest">{r.label}</span>
                 </Button>
               ))}
             </div>
          </motion.div>
        )}

        {step === 'category' && (
          <motion.div key="cat" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-full max-w-md space-y-4">
            <div className="flex items-center gap-2 mb-6">
                <div className="h-1 flex-1 bg-red-600" />
                <div className="h-1 flex-1 bg-red-600" />
                <div className="h-1 flex-1 bg-slate-800" />
             </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Select Emergency</h2>
            <div className="space-y-3">
              {[
                { id: 'Fire', icon: Flame, color: 'text-orange-500', desc: 'Smoke, visible fire, explosion' },
                { id: 'Medical', icon: Plus, color: 'text-emerald-500', desc: 'Injury, unconsciousness, cardiac' },
                { id: 'Security', icon: Lock, color: 'text-blue-500', desc: 'Hostile guest, theft, violence' },
                { id: 'Silent', icon: EyeOff, color: 'text-slate-400', desc: 'Discreet help (Hidden mode)' }
              ].map((c) => (
                <Button 
                  key={c.id} 
                  variant="outline" 
                  className="w-full h-20 justify-start gap-4 border-slate-800 bg-slate-900/40 hover:border-red-500/50"
                  onClick={() => { setCategory(c.id as Category); setStep('assessment'); }}
                >
                  <c.icon className={`h-8 w-8 ${c.color}`} />
                  <div className="text-left">
                    <div className="text-sm font-black uppercase italic leading-none">{c.id}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest">{c.desc}</div>
                  </div>
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'assessment' && (
          <motion.div key="assess" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-full max-w-md space-y-6">
             <div className="flex items-center gap-2 mb-6">
                <div className="h-1 flex-1 bg-red-600" />
                <div className="h-1 flex-1 bg-red-600" />
                <div className="h-1 flex-1 bg-red-600" />
             </div>
             <Card className="bg-slate-950 border-slate-800">
               <CardHeader className="pb-4">
                 <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="text-red-500" /> Assessment
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  {category === 'Fire' && (
                    <>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Smoke Density</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['Low', 'Medium', 'High'].map(v => (
                            <Button key={v} variant={metadata.smoke === v ? 'default' : 'outline'} className="text-[10px]" onClick={() => setMetadata({...metadata, smoke: v})}>{v}</Button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">People Trapped?</label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Yes', 'No', 'Unsure'].map(v => (
                            <Button key={v} variant={metadata.trapped === v ? 'default' : 'outline'} className="text-[10px]" onClick={() => setMetadata({...metadata, trapped: v})}>{v}</Button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Exact Location</label>
                     <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <input 
                          placeholder="Room #, Floor, or Area..." 
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-red-500 outline-none"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                     </div>
                     <p className="text-sm sm:text-base md:text-lg font-black font-mono text-emerald-400 uppercase tracking-[0.35em]">
                        {gpsStatus}{coords ? `: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : ''}
                     </p>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Quick Description</label>
                     <textarea 
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-4 text-sm focus:ring-1 focus:ring-red-500 outline-none min-h-[100px]"
                        placeholder="Additional details..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                     />
                  </div>

                  <Button className="w-full h-12 bg-red-600 hover:bg-red-700 font-black tracking-widest uppercase italic" onClick={submitFullReport} disabled={loading}>
                    {loading ? 'Transmitting...' : 'Dispatch Emergency'}
                  </Button>
               </CardContent>
             </Card>
          </motion.div>
        )}

        {step === 'reported' && (
          <motion.div key="done" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-6">
             <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
             </div>
             <EvacuationMap zone={location} />

             <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 max-w-sm mx-auto space-y-4">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Status Check-in</p>
                <div className="grid grid-cols-2 gap-3">
                   <Button 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] tracking-widest uppercase italic h-12"
                      onClick={() => updateStatus('SAFE')}
                   >
                      I AM SAFE
                   </Button>
                   <Button 
                      variant="outline"
                      className="border-red-600/30 text-red-500 font-black text-[10px] tracking-widest uppercase italic h-12"
                      onClick={() => updateStatus('NEED_HELP')}
                   >
                      STILL AT RISK
                   </Button>
                </div>
             </div>

             <Button variant="ghost" onClick={() => { setStep('initial'); setMetadata({}); setDescription(''); setLocation(''); }} className="text-slate-500 uppercase font-black text-[10px] tracking-widest">
                <History className="h-4 w-4 mr-2" /> Return to Terminal
             </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
