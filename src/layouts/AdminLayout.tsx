import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '@/utils/supabase/client'
import { 
  LayoutDashboard, 
  BarChart3, 
  Settings, 
  LogOut, 
  ShieldAlert,
  Bell,
  Menu
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
      // Fallback redirect even if supabase fails
      navigate('/')
    }
  }

  const navItems = [
    { label: 'Command Feed', icon: LayoutDashboard, path: '/admin' },
    { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { label: 'Settings', icon: Settings, path: '/admin/settings' },
  ]

  return (
    <div className="flex min-h-screen bg-[#0b0f1a] text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950/50 backdrop-blur-xl hidden lg:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
            <div>
              <h1 className="text-xl font-black italic uppercase tracking-tighter">CrisisBridge</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Op-Center Terminal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-widest transition-all",
                location.pathname === item.path 
                  ? "bg-red-600/10 text-red-500 border border-red-600/20 shadow-[0_0_20px_rgba(220,38,38,0.1)]" 
                  : "text-slate-500 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-bold uppercase tracking-widest text-slate-500 hover:bg-red-600/10 hover:text-red-500 transition-all text-left"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 bg-slate-950/20 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <Menu className="h-5 w-5 lg:hidden" />
            <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/20 px-3 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">System Online</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative">
              <Bell className="h-5 w-5 text-slate-400" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-600 rounded-full border-2 border-[#0b0f1a]" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black uppercase">ADMIN_01</p>
                <p className="text-[10px] font-bold text-slate-500">Duty Commander</p>
              </div>
              <div className="h-8 w-8 rounded-lg bg-red-600/20 border border-red-600/30 flex items-center justify-center font-black">
                A
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
