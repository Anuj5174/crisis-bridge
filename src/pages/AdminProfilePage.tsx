import { useEffect, useState } from "react"
import { User, Mail, Phone, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ProfileData {
  name: string
  title: string
  email: string
  phone: string
}

const defaultProfile: ProfileData = {
  name: "ADMIN_01",
  title: "Duty Commander",
  email: "admin@crisisbridge.com",
  phone: "+1 555 010 000",
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem("crisisbridge-admin-profile")
    if (stored) {
      try {
        setProfile(JSON.parse(stored))
      } catch {
        setProfile(defaultProfile)
      }
    }
  }, [])

  const updateField = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const saveProfile = () => {
    window.localStorage.setItem("crisisbridge-admin-profile", JSON.stringify(profile))
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2000)
  }

  const resetProfile = () => {
    setProfile(defaultProfile)
    setSaved(false)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-3">
          <User className="h-8 w-8 text-slate-500" />
          Admin Profile
        </h1>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Update account details and command center identity</p>
      </div>

      <div className="grid gap-6 max-w-4xl">
        <Card className="bg-slate-900/40 border-slate-800 glass">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              <CardTitle className="text-sm font-black uppercase tracking-widest">Profile Settings</CardTitle>
            </div>
            <CardDescription>Manage your admin display name, title, and contact information for the command center.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-xs uppercase tracking-widest text-slate-400">
                <span>Display Name</span>
                <input
                  value={profile.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Admin display name"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                />
              </label>
              <label className="space-y-2 text-xs uppercase tracking-widest text-slate-400">
                <span>Title</span>
                <input
                  value={profile.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="Duty Commander"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                />
              </label>
              <label className="space-y-2 text-xs uppercase tracking-widest text-slate-400">
                <span>Email</span>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    value={profile.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder="admin@crisisbridge.com"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-10 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
              </label>
              <label className="space-y-2 text-xs uppercase tracking-widest text-slate-400">
                <span>Phone</span>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    value={profile.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    placeholder="+1 555 010 000"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-10 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm" onClick={saveProfile} className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30">
                Save Profile
              </Button>
              <Button size="sm" variant="outline" onClick={resetProfile} className="border-slate-800 text-slate-400">
                Reset Defaults
              </Button>
              {saved && <span className="text-xs text-emerald-400">Profile saved locally.</span>}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-[10px] uppercase tracking-widest text-slate-500">Current Name</p>
                <p className="mt-2 text-sm font-black text-slate-100">{profile.name}</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-[10px] uppercase tracking-widest text-slate-500">Role</p>
                <p className="mt-2 text-sm font-black text-slate-100">{profile.title}</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-[10px] uppercase tracking-widest text-slate-500">Contact</p>
                <p className="mt-2 text-sm font-black text-slate-100">{profile.email}</p>
                <p className="text-xs text-slate-500 mt-1">{profile.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
