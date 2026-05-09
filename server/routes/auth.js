import express from 'express'
import { OAuth2Client } from 'google-auth-library'
import { readTab, TABS } from '../utils/googleSheets.js'

const router = express.Router()

const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID)

// Google OAuth login
router.post('/google', async (req, res) => {
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
})

export default router
