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
      const duties = await readTab(TABS.DUTIES)
      res.json(duties)
    } else if (req.method === 'POST') {
      const { รหัสงาน, ชื่องาน, วันที่, คำอธิบาย, สถานะงาน } = req.body
      const data = [รหัสงาน, ชื่องาน, วันที่, คำอธิบาย, สถานะงาน]
      await appendToTab(TABS.DUTIES, data)
      res.json({ success: true })
    } else if (req.method === 'PUT') {
      const { รหัสงาน, ชื่องาน, วันที่, คำอธิบาย, สถานะงาน } = req.body
      const duties = await readTab(TABS.DUTIES)
      const index = duties.findIndex(d => d['รหัสงาน'] === รหัสงาน)
      if (index === -1) {
        return res.status(404).json({ error: 'ไม่พบงาน' })
      }
      const range = `${TABS.DUTIES}!A${index + 2}:E${index + 2}`
      const data = [[รหัสงาน, ชื่องาน, วันที่, คำอธิบาย, สถานะงาน]]
      await updateTab(TABS.DUTIES, range, data)
      res.json({ success: true })
    } else if (req.method === 'DELETE') {
      const { รหัสงาน } = req.body
      const duties = await readTab(TABS.DUTIES)
      const index = duties.findIndex(d => d['รหัสงาน'] === รหัสงาน)
      if (index === -1) {
        return res.status(404).json({ error: 'ไม่พบงาน' })
      }
      await deleteRow(TABS.DUTIES, index + 1)
      res.json({ success: true })
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Error in duties API:', error)
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' })
  }
}
