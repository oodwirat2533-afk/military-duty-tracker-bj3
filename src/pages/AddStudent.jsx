import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'

const YEAR_OPTIONS = ['ม.4', 'ม.5', 'ม.6']

export default function AddStudent() {
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('single') // 'single' | 'bulk'
  const [student, setStudent] = useState({
    name: '',
    student_id: '',
    year: '',
    classroom: '',
    number: ''
  })
  const [importedStudents, setImportedStudents] = useState([])
  const [importLoading, setImportLoading] = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/students', student)
      alert('เพิ่มนักเรียนสำเร็จ')
      setStudent({ name: '', student_id: '', year: '', classroom: '', number: '' })
    } catch (error) {
      console.error('Error adding student:', error)
      alert('เกิดข้อผิดพลาดในการเพิ่มนักเรียน')
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImportLoading(true)
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        // Skip header row and map data
        const students = jsonData.slice(1).map((row) => ({
          student_id: String(row[0] || ''),
          name: String(row[1] || ''),
          year: String(row[2] || ''),
          classroom: String(row[3] || ''),
          number: String(row[4] || '')
        })).filter(s => s.student_id && s.name)

        setImportedStudents(students)
        setImportLoading(false)
      } catch (err) {
        console.error('Error parsing file:', err)
        alert('ไม่สามารถอ่านไฟล์ได้ กรุณาตรวจสอบรูปแบบไฟล์')
        setImportLoading(false)
      }
    }

    reader.readAsArrayBuffer(file)
  }

  const handleBulkSubmit = async () => {
    if (importedStudents.length === 0) {
      alert('กรุณาเลือกไฟล์ก่อน')
      return
    }
    try {
      await axios.post('/api/students', { students: importedStudents })
      alert(`นำเข้านักเรียนสำเร็จ ${importedStudents.length} คน`)
      setImportedStudents([])
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error) {
      console.error('Error importing students:', error)
      alert('เกิดข้อผิดพลาดในการนำเข้านักเรียน')
    }
  }

  const downloadTemplate = () => {
    const templateData = [
      ['รหัสประจำตัวนักเรียน', 'ชื่อ-นามสกุล', 'ระดับชั้น', 'ห้องเรียน', 'เลขที่'],
      ['56001', 'สมชาย ใจดี', 'ม.4', '4/1', '1'],
      ['56002', 'สมหญิง รักเรียน', 'ม.4', '4/1', '2']
    ]
    const ws = XLSX.utils.aoa_to_sheet(templateData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'รายชื่อนักเรียน')
    XLSX.writeFile(wb, 'template_students.xlsx')
  }

  const removeImportedStudent = (index) => {
    setImportedStudents(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">เพิ่มนักเรียน</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setMode('single')}
              className={`px-4 py-2 rounded-lg font-semibold ${
                mode === 'single'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              เพิ่มรายบุคคล
            </button>
            <button
              onClick={() => setMode('bulk')}
              className={`px-4 py-2 rounded-lg font-semibold ${
                mode === 'bulk'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              นำเข้าไฟล์
            </button>
          </div>
        </div>

        {mode === 'single' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
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

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">ชื่อ-นามสกุล</label>
                  <input
                    type="text"
                    value={student.name}
                    onChange={(e) => setStudent({ ...student, name: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    placeholder="กรอกชื่อ-นามสกุล"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">ระดับชั้น</label>
                  <select
                    value={student.year}
                    onChange={(e) => setStudent({ ...student, year: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">เลือกระดับชั้น</option>
                    {YEAR_OPTIONS.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">ห้องเรียน</label>
                  <select
                    value={student.classroom}
                    onChange={(e) => setStudent({ ...student, classroom: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">เลือกห้องเรียน</option>
                    {Array.from({ length: 11 }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">เลขที่</label>
                  <select
                    value={student.number}
                    onChange={(e) => setStudent({ ...student, number: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">เลือกเลขที่</option>
                    {Array.from({ length: 45 }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg"
                >
                  เพิ่มนักเรียน
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
        )}

        {mode === 'bulk' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">นำเข้ารายชื่อนักเรียน</h2>
                <button
                  onClick={downloadTemplate}
                  className="text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  ดาวน์โหลดไฟล์ตัวอย่าง
                </button>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-block bg-green-50 hover:bg-green-100 text-green-700 font-semibold py-3 px-6 rounded-lg"
                >
                  {importLoading ? 'กำลังอ่านไฟล์...' : 'เลือกไฟล์ Excel/CSV'}
                </label>
                <p className="text-gray-500 text-sm mt-2">รองรับไฟล์ .xlsx, .xls, .csv</p>
              </div>
            </div>

            {importedStudents.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    พบ {importedStudents.length} รายชื่อ
                  </h3>
                  <button
                    onClick={handleBulkSubmit}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg"
                  >
                    บันทึกลงระบบ
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border">
                    <thead className="bg-green-700 text-white">
                      <tr>
                        <th className="px-4 py-2 text-left">รหัสประจำตัว</th>
                        <th className="px-4 py-2 text-left">ชื่อ-นามสกุล</th>
                        <th className="px-4 py-2 text-left">ชั้นปี</th>
                        <th className="px-4 py-2 text-left">ห้องเรียน</th>
                        <th className="px-4 py-2 text-left">เลขที่</th>
                        <th className="px-4 py-2 text-center">ลบ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importedStudents.map((s, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">{s.student_id}</td>
                          <td className="px-4 py-2">{s.name}</td>
                          <td className="px-4 py-2">{s.year}</td>
                          <td className="px-4 py-2">{s.classroom}</td>
                          <td className="px-4 py-2">{s.number}</td>
                          <td className="px-4 py-2 text-center">
                            <button
                              onClick={() => removeImportedStudent(i)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ลบ
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-6 rounded-lg"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
