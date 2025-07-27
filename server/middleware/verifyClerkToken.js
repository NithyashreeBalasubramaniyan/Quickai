// middleware/verifyClerkToken.js
import { verifyToken } from '@clerk/backend'

export const verifyClerkToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid token' })
    }

    const token = authHeader.split(' ')[1]
    const { payload } = await verifyToken(token)

    req.user = payload // Add user info to request
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}
