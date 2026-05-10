import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function StudentList({ user }) {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterYear, setFilterYear] = useState('')
  const navigate = useNavigate()

  const isSuperAdmin = user?.role === 'super_admin'
  const userYearLevel = user?.year_level || ''

  const fetchStudents = async (yearLevel = '') => {
    setLoading(true)
    try {
      const params = {}
      if (yearLevel) params.year_level = yearLevel
      const response = await axios.get('/api/students', { params })
      setStudents(response.data)
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      if (!isSuperAdmin && userYearLevel) {
        setFilterYear(userYearLevel)
        fetchStudents(userYearLevel)
      } else {
        setFilterYear('')
        fetchStudents('')
      }
    }
  }, [user])

  const handleFilterChange = (year) => {
    setFilterYear(year)
    fetchStudents(year)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">รายชื่อนักเรียน</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-lg"
          >
            ← กลับ Dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-gray-700 font-semibold">กรองตามชั้นปีที่รับผิดชอบ:</span>
            {isSuperAdmin ? (
              <select
                value={filterYear}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">ทั้งหมด</option>
                <option value="1">ชั้นปีที่ 1</option>
                <option value="2">ชั้นปีที่ 2</option>
                <option value="3">ชั้นปีที่ 3</option>
              </select>
            ) : (
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold">
                ชั้นปีที่ {userYearLevel || 'ทั้งหมด'}
              </span>
            )}
            <span className="text-gray-500 text-sm ml-auto">
              จำนวน {students.length} คน
            </span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">กำลังโหลด...</div>
        ) : students.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-500">
            ไม่พบข้อมูลนักเรียน
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-green-700 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">รหัสประจำตัวนักเรียน</th>
                  <th className="px-6 py-3 text-left">ชื่อ-นามสกุล</th>
                  <th className="px-6 py-3 text-left">ระดับชั้น</th>
                  <th className="px-6 py-3 text-left">ห้องเรียน</th>
                  <th className="px-6 py-3 text-left">เลขที่</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{student.student_id}</td>
                    <td className="px-6 py-4">{student.name}</td>
                    <td className="px-6 py-4">{student.year ? `ชั้นปีที่ ${student.year}` : '-'}</td>
                    <td className="px-6 py-4">{student.classroom}</td>
                    <td className="px-6 py-4">{student.number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
