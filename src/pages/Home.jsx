import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-green-800 mb-4">
            โรงเรียนบรรหารแจ่มใสวิทยา 3
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-green-700 mb-8">
            ระบบเช็คสถานะการปฏิบัติหน้าที่นักศึกษาวิชาทหาร
          </h2>
          
          <p className="text-gray-600 text-center mb-8 text-lg">
            ระบบสำหรับตรวจสอบและบันทึกสถานะการปฏิบัติหน้าที่ของนักศึกษาวิชาทหาร
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Link
              to="/login"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-8 rounded-xl text-center text-xl transition duration-300 shadow-lg hover:shadow-xl"
            >
              เข้าสู่ระบบ Admin
            </Link>
            <Link
              to="/student-status"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-8 rounded-xl text-center text-xl transition duration-300 shadow-lg hover:shadow-xl"
            >
              นักศึกษาดูสถานะ
            </Link>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">ลิงก์สำหรับนักศึกษาดูสถานะ:</h3>
            <p className="text-sm text-blue-600">
              นักศึกษาสามารถดูสถานะการปฏิบัติหน้าที่ได้โดยคลิกที่ปุ่ม "นักศึกษาดูสถานะ" 
              หรือใช้ลิงก์โดยตรง: <span className="font-mono bg-white px-2 py-1 rounded">/student-status</span>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2026 โรงเรียนบรรหารแจ่มใสวิทยา 3</p>
        </div>
      </div>
    </div>
  )
}
