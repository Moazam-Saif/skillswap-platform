import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Check for Bearer token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: `Access token missing or malformed: ${authHeader}` })
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. Use correct secret (ACCESS_TOKEN_SECRET)
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 3. Attach user info to request object
    req.userId = decoded.userId;

    next();
  } catch (err) {
    // 4. Handle errors (expired, invalid)
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Access token expired' });
    } else {
      return res.status(403).json({ message: `Access token invalid ${authHeader}:${err.name}` });
    }
  }
};
