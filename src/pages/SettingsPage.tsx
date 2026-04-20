import { useEffect, useState } from "react"
import { Settings, Shield, Users, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface EmergencyContact {
  id: string
  name: string
  role: string
  phone: string
  emergencyType: string
}

const emergencyTypes = [
  "Medical Response",
  "Fire Response",
  "Security Response",
  "Evacuation Team",
  "Medical Triage",
]

export default function SettingsPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [phone, setPhone] = useState("")
  const [emergencyType, setEmergencyType] = useState(emergencyTypes[0])

  useEffect(() => {
    const stored = window.localStorage.getItem("crisisbridge-emergency-contacts")
    if (stored) {
      try {
        setContacts(JSON.parse(stored))
      } catch {
        setContacts([])
      }
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem("crisisbridge-emergency-contacts", JSON.stringify(contacts))
  }, [contacts])

  const resetForm = () => {
    setName("")
    setRole("")
    setPhone("")
    setEmergencyType(emergencyTypes[0])
  }

  const addContact = () => {
    if (!name.trim() || !role.trim() || !phone.trim()) return

    const newContact: EmergencyContact = {
      id: crypto.randomUUID(),
      name: name.trim(),
      role: role.trim(),
      phone: phone.trim(),
      emergencyType,
    }

    setContacts((prev) => [newContact, ...prev])
    resetForm()
  }

  const removeContact = (id: string) => {
    setContacts((prev) => prev.filter((contact) => contact.id !== id))
  }

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
              <Users className="h-4 w-4 text-cyan-400" />
              <CardTitle className="text-sm font-black uppercase tracking-widest">Emergency Response Team</CardTitle>
            </div>
            <CardDescription>Add personnel for emergency-type situations and assign response responsibilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-xs uppercase tracking-widest text-slate-400">
                <span>Name</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Responder name"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                />
              </label>
              <label className="space-y-2 text-xs uppercase tracking-widest text-slate-400">
                <span>Role</span>
                <input
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  placeholder="Role / unit"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                />
              </label>
              <label className="space-y-2 text-xs uppercase tracking-widest text-slate-400">
                <span>Phone</span>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+1 555 012 345"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                />
              </label>
              <label className="space-y-2 text-xs uppercase tracking-widest text-slate-400">
                <span>Emergency Type</span>
                <select
                  value={emergencyType}
                  onChange={(event) => setEmergencyType(event.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                >
                  {emergencyTypes.map((type) => (
                    <option key={type} value={type} className="text-slate-900">
                      {type}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm" onClick={addContact} className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30">
                Add Person
              </Button>
              <Button size="sm" variant="outline" onClick={resetForm} className="border-slate-800 text-slate-400">
                Clear Form
              </Button>
            </div>

            {contacts.length > 0 ? (
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div key={contact.id} className="flex flex-col gap-3 p-4 rounded-3xl border border-slate-800 bg-slate-950/70">
                    <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-black uppercase tracking-widest text-slate-300">{contact.name}</p>
                        <p className="text-xs text-slate-500">{contact.role}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeContact(contact.id)}
                        className="border-red-600/30 text-red-400"
                      >
                        <Trash2 className="h-4 w-4" /> Remove
                      </Button>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-3 text-xs text-slate-400">
                      <span className="rounded-2xl bg-slate-900/80 px-3 py-2">{contact.emergencyType}</span>
                      <span className="rounded-2xl bg-slate-900/80 px-3 py-2">{contact.phone}</span>
                      <span className="rounded-2xl bg-slate-900/80 px-3 py-2">Active Response Personnel</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No emergency response personnel configured yet.</p>
            )}

            <p className="text-xs text-slate-500">Saved locally for quick operations in this browser session.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
