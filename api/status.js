import { readTab, appendToTab, updateTab, TABS } from './utils/googleSheets.js'

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
      const status = await readTab(TABS.STATUS)
      res.json(status)
    } else if (req.method === 'POST') {
      const { รหัสประจำตัวนักเรียน, รหัสงาน, สถานะ } = req.body
      const data = [รหัสประจำตัวนักเรียน, รหัสงาน, สถานะ, new Date().toISOString().split('T')[0]]
      await appendToTab(TABS.STATUS, data)
      res.json({ success: true })
    } else if (req.method === 'PUT') {
      const { รหัสประจำตัวนักเรียน, รหัสงาน, สถานะ } = req.body
      const statusRecords = await readTab(TABS.STATUS)
      const index = statusRecords.findIndex(s => s['รหัสประจำตัวนักเรียน'] === รหัสประจำตัวนักเรียน && s['รหัสงาน'] === รหัสงาน)
      if (index === -1) {
        return res.status(404).json({ error: 'ไม่พบสถานะ' })
      }
      const range = `${TABS.STATUS}!A${index + 2}:D${index + 2}`
      const data = [[รหัสประจำตัวนักเรียน, รหัสงาน, สถานะ, statusRecords[index]['วันที่บันทึก']]]
      await updateTab(TABS.STATUS, range, data)
      res.json({ success: true })
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Error in status API:', error)
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' })
  }
}
