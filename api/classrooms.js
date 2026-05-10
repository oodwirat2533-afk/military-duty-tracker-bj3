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
      const classrooms = await readTab(TABS.CLASSROOMS)
      res.json(classrooms)
    } else if (req.method === 'POST') {
      const { รหัสห้องชั้นปี, ชื่อห้องชั้นปี, ปีการศึกษา } = req.body
      const data = [รหัสห้องชั้นปี, ชื่อห้องชั้นปี, ปีการศึกษา, new Date().toISOString().split('T')[0]]
      await appendToTab(TABS.CLASSROOMS, data)
      res.json({ success: true })
    } else if (req.method === 'PUT') {
      const { รหัสห้องชั้นปี, ชื่อห้องชั้นปี, ปีการศึกษา } = req.body
      const classrooms = await readTab(TABS.CLASSROOMS)
      const index = classrooms.findIndex(c => c['รหัสห้องชั้นปี'] === รหัสห้องชั้นปี)
      if (index === -1) {
        return res.status(404).json({ error: 'ไม่พบห้องชั้นปี' })
      }
      const range = `${TABS.CLASSROOMS}!A${index + 2}:D${index + 2}`
      const data = [[รหัสห้องชั้นปี, ชื่อห้องชั้นปี, ปีการศึกษา, classrooms[index]['วันที่สร้าง']]]
      await updateTab(TABS.CLASSROOMS, range, data)
      res.json({ success: true })
    } else if (req.method === 'DELETE') {
      const { รหัสห้องชั้นปี } = req.body
      const classrooms = await readTab(TABS.CLASSROOMS)
      const index = classrooms.findIndex(c => c['รหัสห้องชั้นปี'] === รหัสห้องชั้นปี)
      if (index === -1) {
        return res.status(404).json({ error: 'ไม่พบห้องชั้นปี' })
      }
      await deleteRow(TABS.CLASSROOMS, index + 1)
      res.json({ success: true })
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Error in classrooms API:', error)
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' })
  }
}
