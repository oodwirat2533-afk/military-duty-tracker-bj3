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
      const students = await readTab(TABS.STUDENTS)
      const mappedStudents = students.map(s => ({
        student_id: s['รหัสประจำตัวนักเรียน'] || '',
        name: s['ชื่อ-นามสกุล'] || '',
        year: s['ชั้นปี'] || '',
        classroom: s['ห้องเรียน'] || '',
        number: s['เลขที่'] || '',
        created_at: s['วันที่เพิ่ม'] || ''
      }))
      res.json(mappedStudents)
    } else if (req.method === 'POST') {
      const body = req.body
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
            new Date().toISOString().split('T')[0]
          ]
          await appendToTab(TABS.STUDENTS, data)
        }
        res.json({ success: true, count: students.length })
      } else {
        // Single student
        const { student_id, name, year, classroom, number } = body
        const data = [student_id, name, year, classroom, number, new Date().toISOString().split('T')[0]]
        await appendToTab(TABS.STUDENTS, data)
        res.json({ success: true })
      }
    } else if (req.method === 'PUT') {
      const { student_id, name, year, classroom, number } = req.body
      const students = await readTab(TABS.STUDENTS)
      const index = students.findIndex(s => s['รหัสประจำตัวนักเรียน'] === student_id)
      if (index === -1) {
        return res.status(404).json({ error: 'ไม่พบนักเรียน' })
      }
      const range = `${TABS.STUDENTS}!A${index + 2}:F${index + 2}`
      const data = [[student_id, name, year, classroom, number, students[index]['วันที่เพิ่ม']]]
      await updateTab(TABS.STUDENTS, range, data)
      res.json({ success: true })
    } else if (req.method === 'DELETE') {
      const { student_id } = req.body
      const students = await readTab(TABS.STUDENTS)
      const index = students.findIndex(s => s['รหัสประจำตัวนักเรียน'] === student_id)
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
