import { useState, useEffect } from 'react'
import axios from 'axios'

export default function ManageAdmins({ user }) {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newAdminEmail, setNewAdminEmail] = useState('')

  useEffect(() => {
    if (user?.role !== 'super_admin') {
      alert('เฉพาะ Super Admin เท่านั้นที่สามารถเข้าถึงหน้านี้ได้')
      window.location.href = '/dashboard'
      return
    }
    fetchAdmins()
  }, [user])

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('/api/admins')
      setAdmins(response.data)
    } catch (error) {
      console.error('Error fetching admins:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAdmin = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/admins', { email: newAdminEmail })
      setShowModal(false)
      setNewAdminEmail('')
      fetchAdmins()
      alert('เพิ่ม Admin สำเร็จ')
    } catch (error) {
      console.error('Error adding admin:', error)
      alert('เกิดข้อผิดพลาดในการเพิ่ม Admin')
    }
  }

  const handleDeleteAdmin = async (email) => {
    if (!confirm(`คุณต้องการลบ Admin ${email} ใช่หรือไม่?`)) return
    try {
      await axios.delete(`/api/admins/${email}`)
      fetchAdmins()
      alert('ลบ Admin สำเร็จ')
    } catch (error) {
      console.error('Error deleting admin:', error)
      alert('เกิดข้อผิดพลาดในการลบ Admin')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">กำลังโหลด...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">จัดการ Admin</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            + เพิ่ม Admin
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">บทบาท</th>
                <th className="px-6 py-3 text-left">วันที่เพิ่ม</th>
                <th className="px-6 py-3 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin.email} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{admin.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      admin.role === 'super_admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(admin.created_at).toLocaleDateString('th-TH')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {admin.role !== 'super_admin' && (
                      <button
                        onClick={() => handleDeleteAdmin(admin.email)}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded"
                      >
                        ลบ
                      </button>
                    )}
                    {admin.role === 'super_admin' && (
                      <span className="text-gray-400 text-sm">ไม่สามารถลบ Super Admin</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">เพิ่ม Admin ใหม่</h2>
              <form onSubmit={handleAddAdmin}>
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">Email ของ Admin</label>
                  <input
                    type="email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    placeholder="กรอก email"
                  />
                </div>
                <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Admin ที่เพิ่มจะต้อง login ด้วย Google Account ที่ตรงกับ email นี้
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    เพิ่ม
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded"
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
