import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} onLogout={onLogout} />
      <Outlet />
    </div>
  )
}
