import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import GuestPage from './pages/GuestPage'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import IncidentDetailPage from './pages/IncidentDetailPage'
import AnalyticsPage from './pages/AnalyticsPage'
import AdminProfilePage from './pages/AdminProfilePage'
import AdminPersonnelPage from './pages/AdminPersonnelPage'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/guest" element={<GuestPage />} />
        
        {/* Admin Routes with Shared Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="incidents/:id" element={<IncidentDetailPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="personnel" element={<AdminPersonnelPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
        </Route>

      </Routes>
    </Router>
  )
}

export default App
