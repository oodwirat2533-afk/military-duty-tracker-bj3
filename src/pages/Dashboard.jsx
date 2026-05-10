import { Link } from 'react-router-dom'

export default function Dashboard({ user }) {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-8">Dashboard Admin</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            to="/students"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="bg-teal-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">รายชื่อนักเรียน</h2>
                <p className="text-gray-600 text-sm">ดูรายชื่อนักเรียนตามชั้นปีที่รับผิดชอบ</p>
              </div>
            </div>
          </Link>

          <Link
            to="/add-student"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">เพิ่มนักเรียน</h2>
                <p className="text-gray-600 text-sm">เพิ่มนักเรียนวิชาทหารใหม่</p>
              </div>
            </div>
          </Link>

          <Link
            to="/add-duty"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">เพิ่มงาน</h2>
                <p className="text-gray-600 text-sm">สร้างงานใหม่สำหรับบันทึกสถานะ</p>
              </div>
            </div>
          </Link>

          <Link
            to="/record-status"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">บันทึกสถานะ</h2>
                <p className="text-gray-600 text-sm">บันทึกสถานะการปฏิบัติหน้าที่</p>
              </div>
            </div>
          </Link>

          <Link
            to="/reports"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">ดูรายงาน</h2>
                <p className="text-gray-600 text-sm">ดูและส่งออกรายงาน</p>
              </div>
            </div>
          </Link>

          {user?.role === 'super_admin' && (
            <Link
              to="/manage-admins"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 border-2 border-green-500"
            >
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">จัดการ Admin</h2>
                  <p className="text-gray-600 text-sm">เพิ่ม/ลบ/แก้ไข admin (Super Admin เท่านั้น)</p>
                </div>
              </div>
            </Link>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">ลิงก์สำหรับนักเรียนดูสถานะ</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600 mb-2">นักเรียนสามารถดูสถานะการปฏิบัติหน้าที่ได้ที่:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-white px-4 py-2 rounded border text-sm">
                {window.location.origin}/student-status
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/student-status`)
                  alert('คัดลอกลิงก์แล้ว')
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                คัดลอก
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
