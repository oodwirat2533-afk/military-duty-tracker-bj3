import express from 'express'
import { readTab, appendToTab, TABS } from '../utils/googleSheets.js'

const router = express.Router()

// Get all duties
router.get('/', async (req, res) => {
  try {
    const duties = await readTab(TABS.DUTIES)
    res.json(duties.map((d, index) => ({
      id: index + 2,
      name: d['ชื่องาน'],
      date: d['วันที่'],
      description: d['คำอธิบาย'],
      status: d['สถานะงาน']
    })))
  } catch (error) {
    console.error('Error fetching duties:', error)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลงาน' })
  }
})

// Add new duty
router.post('/', async (req, res) => {
  try {
    const { name, date, description } = req.body
    
    if (!name || !date) {
      return res.status(400).json({ error: 'กรุณาระบุชื่อและวันที่งาน' })
    }

    const duties = await readTab(TABS.DUTIES)
    const newId = duties.length > 0 ? Math.max(...duties.map(d => parseInt(d['รหัสงาน']) || 0)) + 1 : 1

    await appendToTab(TABS.DUTIES, [
      newId.toString(),
      name,
      date,
      description || '',
      'active'
    ])

    res.json({ success: true, id: newId })
  } catch (error) {
    console.error('Error adding duty:', error)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่มงาน' })
  }
})

export default router
