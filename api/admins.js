import { readTab, appendToTab, deleteRow, TABS } from './utils/googleSheets.js'

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
      const admins = await readTab(TABS.ADMINS)
      const mappedAdmins = admins.map(a => ({
        email: a.Email || '',
        role: a['บทบาท'] || 'admin',
        created_at: a['วันที่เพิ่ม'] || ''
      }))
      res.json(mappedAdmins)
    } else if (req.method === 'POST') {
      const { email } = req.body
      if (!email) {
        return res.status(400).json({ error: 'กรุณาระบุ email' })
      }
      const data = [email, 'admin', new Date().toISOString().split('T')[0]]
      await appendToTab(TABS.ADMINS, data)
      res.json({ success: true })
    } else if (req.method === 'DELETE') {
      const { email } = req.body
      const admins = await readTab(TABS.ADMINS)
      const index = admins.findIndex(a => a.Email === email)
      if (index === -1) {
        return res.status(404).json({ error: 'ไม่พบ Admin' })
      }
      await deleteRow(TABS.ADMINS, index + 1)
      res.json({ success: true })
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Error in admins API:', error)
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' })
  }
}
