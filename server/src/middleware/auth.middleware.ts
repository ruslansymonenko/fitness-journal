import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET || typeof JWT_SECRET !== 'string') {
    return res.status(500).json({ message: 'JWT_SECRET is not set' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.user = decoded;

    next();
  } catch (error) {
    console.error('JWT verification error:', error);

    return res.status(401).json({ message: 'Invalid token' });
  }
}
