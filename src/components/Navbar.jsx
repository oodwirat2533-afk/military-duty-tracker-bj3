import { Link, useNavigate } from 'react-router-dom'

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('user')
    if (onLogout) onLogout()
    navigate('/')
  }

  return (
    <nav className="bg-green-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              โรงเรียนบรรหารแจ่มใสวิทยา 3
            </Link>
          </div>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm">{user.email}</span>
              <span className="text-xs bg-green-600 px-2 py-1 rounded">
                {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
              </span>
              <button
                onClick={handleLogout}
                className="bg-green-600 hover:bg-green-800 px-4 py-2 rounded text-sm"
              >
                ออกจากระบบ
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-green-600 hover:bg-green-800 px-4 py-2 rounded text-sm"
            >
              เข้าสู่ระบบ Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
