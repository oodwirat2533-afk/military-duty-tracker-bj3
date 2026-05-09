import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function AddStudent() {
  const [classrooms, setClassrooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState({
    name: '',
    student_id: '',
    classroom_id: ''
  })
  const navigate = useNavigate()

  useEffect(() => {
    fetchClassrooms()
  }, [])

  const fetchClassrooms = async () => {
    try {
      const response = await axios.get('/api/classrooms')
      setClassrooms(response.data)
    } catch (error) {
      console.error('Error fetching classrooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/students', student)
      alert('เพิ่มนักศึกษาสำเร็จ')
      setStudent({ name: '', student_id: '', classroom_id: '' })
    } catch (error) {
      console.error('Error adding student:', error)
      alert('เกิดข้อผิดพลาดในการเพิ่มนักศึกษา')
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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-8">เพิ่มนักศึกษา</h1>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">ชื่อนักศึกษา</label>
              <input
                type="text"
                value={student.name}
                onChange={(e) => setStudent({ ...student, name: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                placeholder="กรอกชื่อนักศึกษา"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">รหัสประจำตัวนักเรียน</label>
              <input
                type="text"
                value={student.student_id}
                onChange={(e) => setStudent({ ...student, student_id: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                placeholder="กรอกรหัสประจำตัวนักเรียน"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">ห้องชั้นปี</label>
              <select
                value={student.classroom_id}
                onChange={(e) => setStudent({ ...student, classroom_id: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">เลือกห้องชั้นปี</option>
                {classrooms.map(classroom => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name} (ปีที่ {classroom.year})
                  </option>
                ))}
              </select>
              {classrooms.length === 0 && (
                <p className="text-red-600 text-sm mt-2">
                  ยังไม่มีห้องชั้นปี กรุณาสร้างห้องชั้นปีก่อน
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={classrooms.length === 0}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                เพิ่มนักศึกษา
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-6 rounded-lg"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
