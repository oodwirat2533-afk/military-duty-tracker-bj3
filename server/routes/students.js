import express from 'express'
import { readTab, appendToTab, TABS } from '../utils/googleSheets.js'

const router = express.Router()

// Get all students (optionally filter by classroom_id)
router.get('/', async (req, res) => {
  try {
    const { classroom_id } = req.query
    const students = await readTab(TABS.STUDENTS)
    const classrooms = await readTab(TABS.CLASSROOMS)
    
    // Create a map of classroom IDs to names
    const classroomMap = {}
    classrooms.forEach(c => {
      classroomMap[c['รหัสห้องชั้นปี']] = {
        name: c['ชื่อห้องชั้นปี'],
        year: c['ปีการศึกษา']
      }
    })

    let filteredStudents = students.map((s, index) => ({
      id: index + 2,
      student_id: s['รหัสประจำตัวนักเรียน'],
      name: s['ชื่อ'],
      classroom_id: s['รหัสห้องชั้นปี'],
      classroom_name: classroomMap[s['รหัสห้องชั้นปี']]?.name || '',
      year: classroomMap[s['รหัสห้องชั้นปี']]?.year || '',
      created_at: s['วันที่เพิ่ม']
    }))

    if (classroom_id) {
      filteredStudents = filteredStudents.filter(s => s.classroom_id === classroom_id)
    }

    res.json(filteredStudents)
  } catch (error) {
    console.error('Error fetching students:', error)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลนักศึกษา' })
  }
})

// Add new student
router.post('/', async (req, res) => {
  try {
    const { name, student_id, classroom_id } = req.body
    
    if (!name || !student_id || !classroom_id) {
      return res.status(400).json({ error: 'กรุณาระบุข้อมูลให้ครบถ้วน' })
    }

    await appendToTab(TABS.STUDENTS, [
      student_id,
      name,
      classroom_id,
      new Date().toISOString()
    ])

    res.json({ success: true })
  } catch (error) {
    console.error('Error adding student:', error)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่มนักศึกษา' })
  }
})

export default router
