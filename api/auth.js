import { OAuth2Client } from 'google-auth-library'
import { readTab, TABS } from './utils/googleSheets.js'

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

    // Check if email is in Admin list
    const admins = await readTab(TABS.ADMINS)
    const isAdmin = admins.some(a => a.Email === email)
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
        role: isSuperAdmin ? 'super_admin' : 'admin'
      }
    })
  } catch (error) {
    console.error('Error authenticating:', error)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการยืนยันตัวตน' })
  }
}
