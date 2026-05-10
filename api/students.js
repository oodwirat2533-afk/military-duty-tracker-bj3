import { readTab, appendToTab, updateTab, deleteRow, TABS } from './utils/googleSheets.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    if (req.method === 'GET') {
      const students = await readTab(TABS.STUDENTS)
      res.json(students)
    } else if (req.method === 'POST') {
      const { รหัสประจำตัวนักเรียน, ชื่อ, รหัสห้องชั้นปี } = req.body
      const data = [รหัสประจำตัวนักเรียน, ชื่อ, รหัสห้องชั้นปี, new Date().toISOString().split('T')[0]]
      await appendToTab(TABS.STUDENTS, data)
      res.json({ success: true })
    } else if (req.method === 'PUT') {
      const { รหัสประจำตัวนักเรียน, ชื่อ, รหัสห้องชั้นปี } = req.body
      const students = await readTab(TABS.STUDENTS)
      const index = students.findIndex(s => s['รหัสประจำตัวนักเรียน'] === รหัสประจำตัวนักเรียน)
      if (index === -1) {
        return res.status(404).json({ error: 'ไม่พบนักศึกษา' })
      }
      const range = `${TABS.STUDENTS}!A${index + 2}:D${index + 2}`
      const data = [[รหัสประจำตัวนักเรียน, ชื่อ, รหัสห้องชั้นปี, students[index]['วันที่เพิ่ม']]]
      await updateTab(TABS.STUDENTS, range, data)
      res.json({ success: true })
    } else if (req.method === 'DELETE') {
      const { รหัสประจำตัวนักเรียน } = req.body
      const students = await readTab(TABS.STUDENTS)
      const index = students.findIndex(s => s['รหัสประจำตัวนักเรียน'] === รหัสประจำตัวนักเรียน)
      if (index === -1) {
        return res.status(404).json({ error: 'ไม่พบนักศึกษา' })
      }
      await deleteRow(TABS.STUDENTS, index + 1)
      res.json({ success: true })
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Error in students API:', error)
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' })
  }
}
