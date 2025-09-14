import '@jest/globals';
import { Request, Response } from 'express';
import AuthController from '@/controllers/auth.controller';
import AuthService from '@/services/auth.service';

// Mock AuthService
jest.mock('@/services/auth.service');
const mockedAuthService = AuthService as jest.Mocked<typeof AuthService>;

describe('AuthController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();

    req = {
      body: {},
    };

    res = {
      json: mockJson,
      status: mockStatus,
    };

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      // Arrange
      const registerData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const mockResult = {
        user: { id: 'user-1', email: 'test@example.com', name: 'Test User' },
        token: 'jwt-token',
      };

      req.body = registerData;
      mockedAuthService.register.mockResolvedValue(mockResult);

      // Act
      await AuthController.register(req as Request, res as Response);

      // Assert
      expect(mockedAuthService.register).toHaveBeenCalledWith(registerData);
      expect(mockJson).toHaveBeenCalledWith(mockResult);
      expect(mockStatus).not.toHaveBeenCalled();
    });

    it('should handle validation errors', async () => {
      // Arrange
      const registerData = {
        email: 'invalid-email',
        password: '123',
        name: '',
      };

      req.body = registerData;
      mockedAuthService.register.mockRejectedValue(new Error('Validation failed'));

      // Act
      await AuthController.register(req as Request, res as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Validation failed' });
    });

    it('should handle user already exists error', async () => {
      // Arrange
      const registerData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User',
      };

      req.body = registerData;
      mockedAuthService.register.mockRejectedValue(
        new Error('User with this email already exists'),
      );

      // Act
      await AuthController.register(req as Request, res as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: 'User with this email already exists' });
    });

    it('should handle unexpected errors', async () => {
      // Arrange
      req.body = { email: 'test@example.com', password: 'password123', name: 'Test User' };
      mockedAuthService.register.mockRejectedValue('Unexpected error');

      // Act
      await AuthController.register(req as Request, res as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResult = {
        user: { id: 'user-1', email: 'test@example.com', name: 'Test User' },
        token: 'jwt-token',
      };

      req.body = loginData;
      mockedAuthService.login.mockResolvedValue(mockResult);

      // Act
      await AuthController.login(req as Request, res as Response);

      // Assert
      expect(mockedAuthService.login).toHaveBeenCalledWith(loginData);
      expect(mockJson).toHaveBeenCalledWith(mockResult);
      expect(mockStatus).not.toHaveBeenCalled();
    });

    it('should handle invalid credentials', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      req.body = loginData;
      mockedAuthService.login.mockRejectedValue(new Error('Invalid credentials'));

      // Act
      await AuthController.login(req as Request, res as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should handle unexpected errors during login', async () => {
      // Arrange
      req.body = { email: 'test@example.com', password: 'password123' };
      mockedAuthService.login.mockRejectedValue('Database error');

      // Act
      await AuthController.login(req as Request, res as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });
});
