import express from 'express'
import { readTab, appendToTab, TABS } from '../utils/googleSheets.js'

const router = express.Router()

// Get status by student ID
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params
    const statuses = await readTab(TABS.STATUS)
    const students = await readTab(TABS.STUDENTS)
    const duties = await readTab(TABS.DUTIES)
    const classrooms = await readTab(TABS.CLASSROOMS)
    
    // Create maps
    const studentMap = {}
    students.forEach(s => {
      studentMap[s['รหัสประจำตัวนักเรียน']] = {
        name: s['ชื่อ'],
        classroom_id: s['รหัสห้องชั้นปี']
      }
    })
    
    const dutyMap = {}
    duties.forEach(d => {
      dutyMap[d['รหัสงาน']] = {
        name: d['ชื่องาน'],
        date: d['วันที่']
      }
    })
    
    const classroomMap = {}
    classrooms.forEach(c => {
      classroomMap[c['รหัสห้องชั้นปี']] = {
        name: c['ชื่อห้องชั้นปี'],
        year: c['ปีการศึกษา']
      }
    })

    const studentStatuses = statuses.filter(s => s['รหัสประจำตัวนักเรียน'] === studentId)
    
    if (studentStatuses.length === 0) {
      return res.json([])
    }

    const studentInfo = studentMap[studentId]
    const classroomInfo = classroomMap[studentInfo?.classroom_id]

    const result = studentStatuses.map(s => ({
      student_id: s['รหัสประจำตัวนักเรียน'],
      name: studentInfo?.name || '',
      classroom_name: classroomInfo?.name || '',
      year: classroomInfo?.year || '',
      duty_id: s['รหัสงาน'],
      duty_name: dutyMap[s['รหัสงาน']]?.name || '',
      duty_date: dutyMap[s['รหัสงาน']]?.date || '',
      status: s['สถานะ'],
      recorded_at: s['วันที่บันทึก']
    }))

    res.json(result)
  } catch (error) {
    console.error('Error fetching student status:', error)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสถานะ' })
  }
})

// Get status by duty ID
router.get('/duty/:dutyId', async (req, res) => {
  try {
    const { dutyId } = req.params
    const { classroom_id, status } = req.query
    const statuses = await readTab(TABS.STATUS)
    const students = await readTab(TABS.STUDENTS)
    const duties = await readTab(TABS.DUTIES)
    const classrooms = await readTab(TABS.CLASSROOMS)
    
    // Create maps
    const studentMap = {}
    students.forEach(s => {
      studentMap[s['รหัสประจำตัวนักเรียน']] = {
        name: s['ชื่อ'],
        classroom_id: s['รหัสห้องชั้นปี']
      }
    })
    
    const classroomMap = {}
    classrooms.forEach(c => {
      classroomMap[c['รหัสห้องชั้นปี']] = {
        name: c['ชื่อห้องชั้นปี'],
        year: c['ปีการศึกษา']
      }
    })
    
    const dutyInfo = duties.find(d => d['รหัสงาน'] === dutyId)

    let dutyStatuses = statuses.filter(s => s['รหัสงาน'] === dutyId)
    
    // Filter by classroom if provided
    if (classroom_id) {
      dutyStatuses = dutyStatuses.filter(s => {
        const student = studentMap[s['รหัสประจำตัวนักเรียน']]
        return student?.classroom_id === classroom_id
      })
    }
    
    // Filter by status if provided
    if (status) {
      dutyStatuses = dutyStatuses.filter(s => s['สถานะ'] === status)
    }

    const result = dutyStatuses.map(s => {
      const student = studentMap[s['รหัสประจำตัวนักเรียน']]
      const classroom = classroomMap[student?.classroom_id]
      return {
        student_id: s['รหัสประจำตัวนักเรียน'],
        name: student?.name || '',
        classroom_name: classroom?.name || '',
        duty_name: dutyInfo?.name || '',
        status: s['สถานะ'],
        recorded_at: s['วันที่บันทึก']
      }
    })

    res.json(result)
  } catch (error) {
    console.error('Error fetching duty status:', error)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสถานะ' })
  }
})

// Batch record statuses
router.post('/batch', async (req, res) => {
  try {
    const { statuses } = req.body
    
    if (!statuses || !Array.isArray(statuses)) {
      return res.status(400).json({ error: 'กรุณาระบุข้อมูลสถานะ' })
    }

    for (const statusData of statuses) {
      await appendToTab(TABS.STATUS, [
        statusData.student_id,
        statusData.duty_id,
        statusData.status,
        new Date().toISOString()
      ])
    }

    res.json({ success: true })
  } catch (error) {
    console.error('Error recording statuses:', error)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการบันทึกสถานะ' })
  }
})

// Record single status
router.post('/', async (req, res) => {
  try {
    const { student_id, duty_id, status } = req.body
    
    if (!student_id || !duty_id || !status) {
      return res.status(400).json({ error: 'กรุณาระบุข้อมูลให้ครบถ้วน' })
    }

    await appendToTab(TABS.STATUS, [
      student_id,
      duty_id,
      status,
      new Date().toISOString()
    ])

    res.json({ success: true })
  } catch (error) {
    console.error('Error recording status:', error)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการบันทึกสถานะ' })
  }
})

export default router
