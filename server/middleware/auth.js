import jwt from 'jsonwebtoken'

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'ood.wirat2533@gmail.com'

export async function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ error: 'ไม่มี token กรุณา login' })
    }

    // In production, verify JWT token
    // const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // req.user = decoded
    
    // For now, we'll use a simple token validation
    req.user = { email: token, role: token === SUPER_ADMIN_EMAIL ? 'super_admin' : 'admin' }
    
    next()
  } catch (error) {
    res.status(401).json({ error: 'Token ไม่ถูกต้อง' })
  }
}

export function requireSuperAdmin(req, res, next) {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'ต้องการสิทธิ์ Super Admin' })
  }
  next()
}
