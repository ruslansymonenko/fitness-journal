import { Request, Response } from 'express';
import AuthService from '../services/auth.service';

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;
      const result = await AuthService.register({ email, password, name });
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login({ email, password });
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
}

export default new AuthController();
