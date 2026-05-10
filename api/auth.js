import { OAuth2Client } from 'google-auth-library'
import { TABS, sheets, SPREADSHEET_ID } from './utils/googleSheets.js'

const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID)

export default async function handler(req, res) {
  // Set CORS headers
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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { token } = req.body
    
    if (!token) {
      return res.status(400).json({ error: 'ไม่มี token' })
    }

    // Verify the token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID
    })

    const payload = ticket.getPayload()
    const email = payload.email

    // Check if email is in Admin list (read raw rows to handle header inconsistencies)
    const adminResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${TABS.ADMINS}!A1:D1000`
    })
    const rows = adminResponse.data.values || []
    const admins = rows.slice(1).map(row => ({
      email: (row[0] || '').trim(),
      role: (row[1] || '').trim(),
      year_level: (row[2] || '').trim(),
      created_at: (row[3] || '').trim()
    }))
    const admin = admins.find(a => a.email === email)
    const isAdmin = !!admin
    const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'ood.wirat2533@gmail.com'
    const isSuperAdmin = email === SUPER_ADMIN_EMAIL

    if (!isAdmin && !isSuperAdmin) {
      return res.status(403).json({ error: 'คุณไม่มีสิทธิ์เข้าสู่ระบบ Admin' })
    }

    // Return user info
    res.json({
      success: true,
      user: {
        email,
        role: isSuperAdmin ? 'super_admin' : 'admin',
        year_level: isSuperAdmin ? '' : (admin?.year_level || '').trim()
      }
    })
  } catch (error) {
    console.error('Error authenticating:', error)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการยืนยันตัวตน' })
  }
}
