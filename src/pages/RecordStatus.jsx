import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function RecordStatus() {
  const [duties, setDuties] = useState([])
  const [students, setStudents] = useState([])
  const [classrooms, setClassrooms] = useState([])
  const [selectedDuty, setSelectedDuty] = useState('')
  const [selectedClassroom, setSelectedClassroom] = useState('')
  const [statuses, setStatuses] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchDuties()
    fetchClassrooms()
  }, [])

  useEffect(() => {
    if (selectedDuty) {
      fetchStudents()
    }
  }, [selectedDuty, selectedClassroom])

  const fetchDuties = async () => {
    try {
      const response = await axios.get('/api/duties')
      setDuties(response.data)
    } catch (error) {
      console.error('Error fetching duties:', error)
    }
  }

  const fetchClassrooms = async () => {
    try {
      const response = await axios.get('/api/classrooms')
      setClassrooms(response.data)
    } catch (error) {
      console.error('Error fetching classrooms:', error)
    }
  }

  const fetchStudents = async () => {
    if (!selectedDuty) return
    setLoading(true)
    try {
      const url = selectedClassroom 
        ? `/api/students?classroom_id=${selectedClassroom}`
        : '/api/students'
      const response = await axios.get(url)
      setStudents(response.data)
      
      // Fetch existing statuses for this duty
      const statusResponse = await axios.get(`/api/status/duty/${selectedDuty}`)
      const existingStatuses = {}
      statusResponse.data.forEach(status => {
        existingStatuses[status.student_id] = status.status
      })
      setStatuses(existingStatuses)
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (studentId, status) => {
    setStatuses(prev => ({
      ...prev,
      [studentId]: status
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedDuty) {
      alert('กรุณาเลือกงาน')
      return
    }
    setSaving(true)
    try {
      const statusData = Object.entries(statuses).map(([student_id, status]) => ({
        student_id,
        duty_id: selectedDuty,
        status
      }))
      await axios.post('/api/status/batch', { statuses: statusData })
      alert('บันทึกสถานะสำเร็จ')
    } catch (error) {
      console.error('Error saving statuses:', error)
      alert('เกิดข้อผิดพลาดในการบันทึกสถานะ')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">บันทึกสถานะ</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-lg"
          >
            ← กลับ Dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">เลือกงาน</label>
              <select
                value={selectedDuty}
                onChange={(e) => setSelectedDuty(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">เลือกงาน</option>
                {duties.map(duty => (
                  <option key={duty.id} value={duty.id}>
                    {duty.name} - {new Date(duty.date).toLocaleDateString('th-TH')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">กรองตามห้องชั้นปี (ไม่บังคับ)</label>
              <select
                value={selectedClassroom}
                onChange={(e) => setSelectedClassroom(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">ทั้งหมด</option>
                {classrooms.map(classroom => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name} (ปีที่ {classroom.year})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">กำลังโหลด...</div>
        ) : students.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-500">
            {selectedDuty ? 'ไม่มีนักเรียนในห้องชั้นปีที่เลือก' : 'กรุณาเลือกงาน'}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-green-700 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left">รหัสประจำตัวนักเรียน</th>
                    <th className="px-6 py-3 text-left">ชื่อ</th>
                    <th className="px-6 py-3 text-left">ห้องชั้นปี</th>
                    <th className="px-6 py-3 text-center">สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{student.student_id}</td>
                      <td className="px-6 py-4">{student.name}</td>
                      <td className="px-6 py-4">{student.classroom_name}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`status-${student.id}`}
                              value="ปฏิบัติหน้าที่"
                              checked={statuses[student.id] === 'ปฏิบัติหน้าที่'}
                              onChange={() => handleStatusChange(student.id, 'ปฏิบัติหน้าที่')}
                              className="w-4 h-4 text-green-600"
                            />
                            <span className="text-green-600 font-semibold">ปฏิบัติหน้าที่</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`status-${student.id}`}
                              value="ไม่ได้ปฏิบัติหน้าที่"
                              checked={statuses[student.id] === 'ไม่ได้ปฏิบัติหน้าที่'}
                              onChange={() => handleStatusChange(student.id, 'ไม่ได้ปฏิบัติหน้าที่')}
                              className="w-4 h-4 text-red-600"
                            />
                            <span className="text-red-600 font-semibold">ไม่ได้ปฏิบัติหน้าที่</span>
                          </label>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {saving ? 'กำลังบันทึก...' : 'บันทึกสถานะ'}
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
        )}
      </div>
    </div>
  )
}
