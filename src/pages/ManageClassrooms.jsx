import { useState, useEffect } from 'react'
import axios from 'axios'

export default function ManageClassrooms() {
  const [classrooms, setClassrooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newClassroom, setNewClassroom] = useState({
    name: '',
    year: '1'
  })

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

  const handleAddClassroom = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/classrooms', newClassroom)
      setShowModal(false)
      setNewClassroom({ name: '', year: '1' })
      fetchClassrooms()
    } catch (error) {
      console.error('Error adding classroom:', error)
      alert('เกิดข้อผิดพลาดในการเพิ่มห้องชั้นปี')
    }
  }

  const handleDeleteClassroom = async (id) => {
    if (!confirm('คุณต้องการลบห้องชั้นปีนี้ใช่หรือไม่?')) return
    try {
      await axios.delete(`/api/classrooms/${id}`)
      fetchClassrooms()
    } catch (error) {
      console.error('Error deleting classroom:', error)
      alert('เกิดข้อผิดพลาดในการลบห้องชั้นปี')
    }
  }

  const getClassroomsByYear = (year) => {
    return classrooms.filter(c => c.year === year)
  }

  const years = ['1', '2', '3']

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">กำลังโหลด...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">จัดการห้องชั้นปี</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            + เพิ่มห้องชั้นปี
          </button>
        </div>

        {years.map(year => (
          <div key={year} className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">ปีที่ {year}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getClassroomsByYear(year).map(classroom => (
                <div key={classroom.id} className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{classroom.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">สร้างเมื่อ: {new Date(classroom.created_at).toLocaleDateString('th-TH')}</p>
                  <button
                    onClick={() => handleDeleteClassroom(classroom.id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded"
                  >
                    ลบ
                  </button>
                </div>
              ))}
              {getClassroomsByYear(year).length === 0 && (
                <div className="bg-gray-50 rounded-lg p-6 text-gray-500 col-span-full">
                  ยังไม่มีห้องชั้นปีในปีที่ {year}
                </div>
              )}
            </div>
          </div>
        ))}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">เพิ่มห้องชั้นปีใหม่</h2>
              <form onSubmit={handleAddClassroom}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">ชื่อห้องชั้นปี</label>
                  <input
                    type="text"
                    value={newClassroom.name}
                    onChange={(e) => setNewClassroom({ ...newClassroom, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    placeholder="เช่น ห้อง 1/1"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">ปีการศึกษา</label>
                  <select
                    value={newClassroom.year}
                    onChange={(e) => setNewClassroom({ ...newClassroom, year: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="1">ปีที่ 1</option>
                    <option value="2">ปีที่ 2</option>
                    <option value="3">ปีที่ 3</option>
                  </select>
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
