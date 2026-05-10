import { useState } from 'react'
import axios from 'axios'

export default function StudentStatus() {
  const [studentId, setStudentId] = useState('')
  const [studentData, setStudentData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!studentId.trim()) {
      setError('กรุณากรอกรหัสประจำตัวนักเรียน')
      return
    }
    
    setLoading(true)
    setError('')
    setStudentData(null)
    
    try {
      const response = await axios.get(`/api/status/student/${studentId}`)
      if (response.data.length === 0) {
        setError('ไม่พบข้อมูลนักเรียนหรือยังไม่มีการบันทึกสถานะ')
      } else {
        setStudentData({
          info: response.data[0],
          statuses: response.data
        })
      }
    } catch (error) {
      console.error('Error fetching student status:', error)
      setError('เกิดข้อผิดพลาดในการค้นหา')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <h1 className="text-3xl font-bold text-center text-blue-800 mb-2">
            ดูสถานะการปฏิบัติหน้าที่
          </h1>
          <h2 className="text-xl font-semibold text-center text-blue-700 mb-8">
            โรงเรียนบรรหารแจ่มใสวิทยา 3
          </h2>

          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-lg"
                placeholder="กรอกรหัสประจำตัวนักเรียน"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'กำลังค้นหา...' : 'ค้นหา'}
              </button>
            </div>
          </form>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl mb-6 text-center">
              {error}
            </div>
          )}

          {studentData && (
            <div>
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-2">ข้อมูลนักเรียน</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">ชื่อ:</span>
                    <span className="ml-2 font-semibold">{studentData.info.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">รหัสประจำตัวนักเรียน:</span>
                    <span className="ml-2 font-semibold">{studentData.info.student_id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">ห้องชั้นปี:</span>
                    <span className="ml-2 font-semibold">{studentData.info.classroom_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">ปีการศึกษา:</span>
                    <span className="ml-2 font-semibold">ปีที่ {studentData.info.year}</span>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-4">สถานะการปฏิบัติหน้าที่</h3>
              
              {studentData.statuses.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500">
                  ยังไม่มีการบันทึกสถานะการปฏิบัติหน้าที่
                </div>
              ) : (
                <div className="bg-white border rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-blue-700 text-white">
                      <tr>
                        <th className="px-6 py-3 text-left">งาน</th>
                        <th className="px-6 py-3 text-left">วันที่งาน</th>
                        <th className="px-6 py-3 text-center">สถานะ</th>
                        <th className="px-6 py-3 text-left">วันที่บันทึก</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentData.statuses.map((status, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4">{status.duty_name}</td>
                          <td className="px-6 py-4">
                            {new Date(status.duty_date).toLocaleDateString('th-TH')}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                              status.status === 'ปฏิบัติหน้าที่' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {status.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {new Date(status.recorded_at).toLocaleDateString('th-TH')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 text-center">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← กลับหน้าแรก
            </a>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2026 โรงเรียนบรรหารแจ่มใสวิทยา 3</p>
        </div>
      </div>
    </div>
  )
}
