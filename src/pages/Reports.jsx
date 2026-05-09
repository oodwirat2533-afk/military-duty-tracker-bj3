import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Reports() {
  const [duties, setDuties] = useState([])
  const [classrooms, setClassrooms] = useState([])
  const [selectedDuty, setSelectedDuty] = useState('')
  const [selectedClassroom, setSelectedClassroom] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [reportData, setReportData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDuties()
    fetchClassrooms()
  }, [])

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

  const generateReport = async () => {
    if (!selectedDuty) {
      alert('กรุณาเลือกงาน')
      return
    }
    setLoading(true)
    try {
      let url = `/api/reports/duty/${selectedDuty}`
      const params = []
      if (selectedClassroom) params.push(`classroom_id=${selectedClassroom}`)
      if (selectedStatus) params.push(`status=${selectedStatus}`)
      if (params.length > 0) url += '?' + params.join('&')
      
      const response = await axios.get(url)
      setReportData(response.data)
    } catch (error) {
      console.error('Error generating report:', error)
      alert('เกิดข้อผิดพลาดในการสร้างรายงาน')
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    if (reportData.length === 0) {
      alert('ไม่มีข้อมูลสำหรับส่งออก')
      return
    }
    
    const headers = ['รหัสประจำตัวนักเรียน', 'ชื่อ', 'ห้องชั้นปี', 'งาน', 'สถานะ', 'วันที่บันทึก']
    const csvContent = [
      headers.join(','),
      ...reportData.map(row => [
        row.student_id,
        row.name,
        row.classroom_name,
        row.duty_name,
        row.status,
        new Date(row.recorded_at).toLocaleDateString('th-TH')
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `รายงานสถานะ_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-8">ดูรายงาน</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">เลือกงาน</label>
              <select
                value={selectedDuty}
                onChange={(e) => setSelectedDuty(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
            <div>
              <label className="block text-gray-700 font-semibold mb-2">กรองตามสถานะ (ไม่บังคับ)</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">ทั้งหมด</option>
                <option value="ปฏิบัติหน้าที่">ปฏิบัติหน้าที่</option>
                <option value="ไม่ได้ปฏิบัติหน้าที่">ไม่ได้ปฏิบัติหน้าที่</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <button
              onClick={generateReport}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'กำลังสร้าง...' : 'สร้างรายงาน'}
            </button>
            <button
              onClick={exportToCSV}
              disabled={reportData.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              ส่งออก CSV
            </button>
          </div>
        </div>

        {reportData.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-green-700 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">รหัสประจำตัวนักเรียน</th>
                  <th className="px-6 py-3 text-left">ชื่อ</th>
                  <th className="px-6 py-3 text-left">ห้องชั้นปี</th>
                  <th className="px-6 py-3 text-left">งาน</th>
                  <th className="px-6 py-3 text-center">สถานะ</th>
                  <th className="px-6 py-3 text-left">วันที่บันทึก</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{row.student_id}</td>
                    <td className="px-6 py-4">{row.name}</td>
                    <td className="px-6 py-4">{row.classroom_name}</td>
                    <td className="px-6 py-4">{row.duty_name}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        row.status === 'ปฏิบัติหน้าที่' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(row.recorded_at).toLocaleDateString('th-TH')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportData.length === 0 && selectedDuty && !loading && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-500">
            ไม่มีข้อมูลตามเงื่อนไขที่เลือก
          </div>
        )}
      </div>
    </div>
  )
}
