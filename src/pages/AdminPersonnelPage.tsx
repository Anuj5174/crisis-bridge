import { useEffect, useState } from "react"
import { UserPlus, Users, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TeamMember {
  id: string
  name: string
  role: string
  phone: string
  location: string
  specialty: string
}

const specialties = [
  "Security",
  "Medical",
  "Fire Response",
  "Evacuation",
  "Logistics",
]

export default function AdminPersonnelPage() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [specialty, setSpecialty] = useState(specialties[0])

  useEffect(() => {
    const stored = window.localStorage.getItem("crisisbridge-operation-personnel")
    if (stored) {
      try {
        setTeam(JSON.parse(stored))
      } catch {
        setTeam([])
      }
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem("crisisbridge-operation-personnel", JSON.stringify(team))
  }, [team])

  const clearForm = () => {
    setName("")
    setRole("")
    setPhone("")
    setLocation("")
    setSpecialty(specialties[0])
  }

  const addMember = () => {
    if (!name.trim() || !role.trim() || !phone.trim() || !location.trim()) return

    setTeam((prev) => [
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        role: role.trim(),
        phone: phone.trim(),
        location: location.trim(),
        specialty,
      },
      ...prev,
    ])

    clearForm()
  }

  const removeMember = (id: string) => {
    setTeam((prev) => prev.filter((member) => member.id !== id))
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-3">
          <UserPlus className="h-8 w-8 text-slate-500" />
          Personnel Manager
        </h1>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Add and manage people assigned to crisis operations</p>
      </div>

      <div className="grid gap-6 max-w-4xl">
        <Card className="bg-slate-900/40 border-slate-800 glass">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-cyan-400" />
              <CardTitle className="text-sm font-black uppercase tracking-widest">Operational Personnel</CardTitle>
            </div>
            <CardDescription>Register responders, support staff, and emergency team members for live operations.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-xs uppercase tracking-widest text-slate-400">
                <span>Name</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Responder name"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 outline-none focus:border-cyan-500"
                />
              </label>
              <label className="space-y-2 text-xs uppercase tracking-widest text-slate-400">
                <span>Role</span>
                <input
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  placeholder="Unit / function"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 outline-none focus:border-cyan-500"
                />
              </label>
              <label className="space-y-2 text-xs uppercase tracking-widest text-slate-400">
                <span>Phone</span>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+1 555 010 001"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 outline-none focus:border-cyan-500"
                />
              </label>
              <label className="space-y-2 text-xs uppercase tracking-widest text-slate-400">
                <span>Location</span>
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Sector 7G / Command Post"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 outline-none focus:border-cyan-500"
                />
              </label>
              <label className="space-y-2 text-xs uppercase tracking-widest text-slate-400">
                <span>Specialty</span>
                <select
                  value={specialty}
                  onChange={(event) => setSpecialty(event.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 outline-none focus:border-cyan-500"
                >
                  {specialties.map((item) => (
                    <option key={item} value={item} className="text-slate-900">
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm" onClick={addMember} className="bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/30 border border-cyan-500/30">
                Add Person
              </Button>
              <Button size="sm" variant="outline" onClick={clearForm} className="border-slate-800 text-slate-400">
                Clear Fields
              </Button>
            </div>

            {team.length > 0 ? (
              <div className="space-y-4">
                {team.map((member) => (
                  <div key={member.id} className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-black uppercase tracking-widest text-slate-100">{member.name}</p>
                        <p className="text-xs text-slate-500">{member.role}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => removeMember(member.id)} className="border-red-600/30 text-red-400">
                        <Trash2 className="h-4 w-4" /> Remove
                      </Button>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-4 text-xs text-slate-400 mt-3">
                      <span className="rounded-2xl bg-slate-900/80 px-3 py-2">{member.specialty}</span>
                      <span className="rounded-2xl bg-slate-900/80 px-3 py-2">{member.location}</span>
                      <span className="rounded-2xl bg-slate-900/80 px-3 py-2">{member.phone}</span>
                      <span className="rounded-2xl bg-slate-900/80 px-3 py-2">Ready for dispatch</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No personnel added yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
