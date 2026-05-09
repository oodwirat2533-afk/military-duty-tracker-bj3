import express from 'express'
import { readTab, appendToTab, deleteRow, TABS } from '../utils/googleSheets.js'
import { requireSuperAdmin } from '../middleware/auth.js'

const router = express.Router()

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'ood.wirat2533@gmail.com'

// Get all admins
router.get('/', async (req, res) => {
  try {
    const admins = await readTab(TABS.ADMINS)
    
    // Add super admin if not in list
    const hasSuperAdmin = admins.some(a => a.Email === SUPER_ADMIN_EMAIL)
    const adminList = [...admins]
    if (!hasSuperAdmin) {
      adminList.push({
        Email: SUPER_ADMIN_EMAIL,
        'บทบาท': 'super_admin',
        'วันที่เพิ่ม': new Date().toISOString()
      })
    }
    
    res.json(adminList.map(a => ({
      email: a.Email,
      role: a['บทบาท'],
      created_at: a['วันที่เพิ่ม']
    })))
  } catch (error) {
    console.error('Error fetching admins:', error)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล admin' })
  }
})

// Add new admin (Super Admin only)
router.post('/', requireSuperAdmin, async (req, res) => {
  try {
    const { email } = req.body
    
    if (!email) {
      return res.status(400).json({ error: 'กรุณาระบุ email' })
    }

    const admins = await readTab(TABS.ADMINS)
    const exists = admins.some(a => a.Email === email)
    
    if (exists) {
      return res.status(400).json({ error: 'Admin นี้มีอยู่แล้ว' })
    }

    await appendToTab(TABS.ADMINS, [
      email,
      'admin',
      new Date().toISOString()
    ])

    res.json({ success: true })
  } catch (error) {
    console.error('Error adding admin:', error)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่ม admin' })
  }
})

// Delete admin (Super Admin only)
router.delete('/:email', requireSuperAdmin, async (req, res) => {
  try {
    const { email } = req.params
    
    if (email === SUPER_ADMIN_EMAIL) {
      return res.status(403).json({ error: 'ไม่สามารถลบ Super Admin ได้' })
    }

    const admins = await readTab(TABS.ADMINS)
    const rowIndex = admins.findIndex(a => a.Email === email)
    
    if (rowIndex === -1) {
      return res.status(404).json({ error: 'ไม่พบ admin' })
    }

    await deleteRow(TABS.ADMINS, rowIndex + 2)
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting admin:', error)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบ admin' })
  }
})

export default router
