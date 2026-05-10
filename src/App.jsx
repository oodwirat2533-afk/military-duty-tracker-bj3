import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AddStudent from './pages/AddStudent'
import AddDuty from './pages/AddDuty'
import RecordStatus from './pages/RecordStatus'
import ManageAdmins from './pages/ManageAdmins'
import Reports from './pages/Reports'
import StudentStatus from './pages/StudentStatus'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/student-status" element={<StudentStatus />} />
        
        {/* Protected routes */}
        <Route element={<Layout user={user} onLogout={handleLogout} />}>
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/add-student" element={user ? <AddStudent /> : <Navigate to="/login" />} />
          <Route path="/add-duty" element={user ? <AddDuty /> : <Navigate to="/login" />} />
          <Route path="/record-status" element={user ? <RecordStatus /> : <Navigate to="/login" />} />
          <Route path="/manage-admins" element={user ? <ManageAdmins user={user} /> : <Navigate to="/login" />} />
          <Route path="/reports" element={user ? <Reports /> : <Navigate to="/login" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
