import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Login({ onLogin }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')

    try {
      // Load Google Identity Services
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      document.body.appendChild(script)

      script.onload = () => {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        })
        window.google.accounts.id.prompt()
      }

      script.onerror = () => {
        setError('ไม่สามารถโหลด Google Identity Services ได้')
        setLoading(false)
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ Google')
      setLoading(false)
    }
  }

  const handleCredentialResponse = async (response) => {
    try {
      const res = await axios.post('/api/auth', { token: response.credential })
      
      if (res.data.success) {
        onLogin(res.data.user)
        navigate('/dashboard')
      } else {
        setError(res.data.error || 'เข้าสู่ระบบไม่สำเร็จ')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.response?.data?.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center text-green-800 mb-2">
            เข้าสู่ระบบ Admin
          </h1>
          <h2 className="text-xl font-semibold text-center text-green-700 mb-8">
            โรงเรียนบรรหารแจ่มใสวิทยา 3
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 hover:border-green-500 text-gray-700 font-semibold py-3 px-4 rounded-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {loading ? 'กำลังเชื่อมต่อ...' : 'Login ด้วย Google Account'}
            </button>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800 text-center">
                ⚠️ เฉพาะผู้ที่มีสิทธิ์ Admin เท่านั้นที่สามารถเข้าสู่ระบบได้
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-green-600 hover:text-green-800 font-medium"
            >
              ← กลับหน้าแรก
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
