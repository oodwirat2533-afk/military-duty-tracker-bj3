import { sheets, SPREADSHEET_ID, appendToTab, updateTab, deleteRow, TABS } from './utils/googleSheets.js'

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
      // Read raw rows directly to avoid header mapping issues
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${TABS.STUDENTS}!A2:G1000`
      })
      const rows = response.data.values || []
      let mappedStudents = rows.map(row => ({
        student_id: (row[0] || '').trim(),
        name: (row[1] || '').trim(),
        year: (row[2] || '').trim(),
        classroom: (row[3] || '').trim(),
        number: (row[4] || '').trim(),
        year_level: (row[5] || '').trim(),
        created_at: (row[6] || '').trim()
      }))
      // Filter by year_level (admin's year_level) if provided
      const { year_level } = req.query || {}
      if (year_level) {
        const trimmedYearLevel = year_level.trim()
        mappedStudents = mappedStudents.filter(s => s.year_level === trimmedYearLevel)
      }
      res.json(mappedStudents)
    } else if (req.method === 'POST') {
      const body = req.body
      const year_level = body.year_level || ''
      // Bulk import (array of students)
      if (Array.isArray(body.students)) {
        const students = body.students
        for (const student of students) {
          const data = [
            student.student_id,
            student.name,
            student.year,
            student.classroom,
            student.number,
            year_level,
            new Date().toISOString().split('T')[0]
          ]
          await appendToTab(TABS.STUDENTS, data)
        }
        res.json({ success: true, count: students.length })
      } else {
        // Single student
        const { student_id, name, year, classroom, number } = body
        const data = [student_id, name, year, classroom, number, year_level, new Date().toISOString().split('T')[0]]
        await appendToTab(TABS.STUDENTS, data)
        res.json({ success: true })
      }
    } else if (req.method === 'PUT') {
      const { student_id, name, year, classroom, number, year_level } = req.body
      // Read raw rows directly
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${TABS.STUDENTS}!A2:G1000`
      })
      const rows = response.data.values || []
      const index = rows.findIndex(row => (row[0] || '').trim() === student_id.trim())
      if (index === -1) {
        return res.status(404).json({ error: 'ไม่พบนักเรียน' })
      }
      const range = `${TABS.STUDENTS}!A${index + 2}:G${index + 2}`
      const data = [[student_id, name, year, classroom, number, year_level, rows[index][6] || '']]
      await updateTab(TABS.STUDENTS, range, data)
      res.json({ success: true })
    } else if (req.method === 'DELETE') {
      const { student_id } = req.body
      // Read raw rows directly
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${TABS.STUDENTS}!A2:G1000`
      })
      const rows = response.data.values || []
      const index = rows.findIndex(row => (row[0] || '').trim() === student_id.trim())
      if (index === -1) {
        return res.status(404).json({ error: 'ไม่พบนักเรียน' })
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
