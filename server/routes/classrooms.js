import express from 'express'
import { readTab, appendToTab, deleteRow, TABS } from '../utils/googleSheets.js'

const router = express.Router()

// Get all classrooms
router.get('/', async (req, res) => {
  try {
    const classrooms = await readTab(TABS.CLASSROOMS)
    res.json(classrooms.map((c, index) => ({
      id: index + 2, // +2 because header is row 1
      name: c['ชื่อห้องชั้นปี'],
      year: c['ปีการศึกษา'],
      created_at: c['วันที่สร้าง']
    })))
  } catch (error) {
    console.error('Error fetching classrooms:', error)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลห้องชั้นปี' })
  }
})

// Add new classroom
router.post('/', async (req, res) => {
  try {
    const { name, year } = req.body
    
    if (!name || !year) {
      return res.status(400).json({ error: 'กรุณาระบุชื่อและปีการศึกษา' })
    }

    const classrooms = await readTab(TABS.CLASSROOMS)
    const newId = classrooms.length > 0 ? Math.max(...classrooms.map(c => parseInt(c['รหัสห้องชั้นปี']) || 0)) + 1 : 1

    await appendToTab(TABS.CLASSROOMS, [
      newId.toString(),
      name,
      year,
      new Date().toISOString()
    ])

    res.json({ success: true, id: newId })
  } catch (error) {
    console.error('Error adding classroom:', error)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่มห้องชั้นปี' })
  }
})

// Delete classroom
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const classrooms = await readTab(TABS.CLASSROOMS)
    const rowIndex = classrooms.findIndex(c => c['รหัสห้องชั้นปี'] === id)
    
    if (rowIndex === -1) {
      return res.status(404).json({ error: 'ไม่พบห้องชั้นปี' })
    }

    await deleteRow(TABS.CLASSROOMS, rowIndex + 2) // +2 because header is row 1
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting classroom:', error)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบห้องชั้นปี' })
  }
})

export default router
