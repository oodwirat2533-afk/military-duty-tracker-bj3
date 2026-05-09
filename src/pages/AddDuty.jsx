import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function AddDuty() {
  const [duty, setDuty] = useState({
    name: '',
    date: '',
    description: ''
  })
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/duties', duty)
      alert('เพิ่มงานสำเร็จ')
      setDuty({ name: '', date: '', description: '' })
    } catch (error) {
      console.error('Error adding duty:', error)
      alert('เกิดข้อผิดพลาดในการเพิ่มงาน')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-8">เพิ่มงาน</h1>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">ชื่องาน</label>
              <input
                type="text"
                value={duty.name}
                onChange={(e) => setDuty({ ...duty, name: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                placeholder="กรอกชื่องาน"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">วันที่</label>
              <input
                type="date"
                value={duty.date}
                onChange={(e) => setDuty({ ...duty, date: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">คำอธิบาย</label>
              <textarea
                value={duty.description}
                onChange={(e) => setDuty({ ...duty, description: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="4"
                placeholder="กรอกคำอธิบายของงาน"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg"
              >
                เพิ่มงาน
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
