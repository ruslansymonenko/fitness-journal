import '@jest/globals';
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware, AuthRequest } from '@/middleware/auth.middleware';

// Mock jwt
jest.mock('jsonwebtoken');
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('authMiddleware', () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;
  let next: NextFunction;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    next = jest.fn();

    req = {
      headers: {},
    };

    res = {
      json: mockJson,
      status: mockStatus,
    };

    jest.clearAllMocks();
  });

  it('should call next() with valid token', () => {
    // Arrange
    req.headers = { authorization: 'Bearer valid-jwt-token' };
    mockedJwt.verify.mockReturnValue({ userId: 'user-123' } as any);

    // Act
    authMiddleware(req as AuthRequest, res as Response, next);

    // Assert
    expect(mockedJwt.verify).toHaveBeenCalledWith(
      'valid-jwt-token',
      'test-jwt-secret-key-for-testing-only',
    );
    expect(req.user).toEqual({ userId: 'user-123' });
    expect(next).toHaveBeenCalled();
    expect(mockStatus).not.toHaveBeenCalled();
  });

  it('should return 401 when no authorization header', () => {
    // Arrange
    req.headers = {};

    // Act
    authMiddleware(req as AuthRequest, res as Response, next);

    // Assert
    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith({ message: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when authorization header is malformed (no Bearer)', () => {
    // Arrange
    req.headers = { authorization: 'invalid-format token' };

    // Act
    authMiddleware(req as AuthRequest, res as Response, next);

    // Assert
    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Invalid token format' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when no token after Bearer', () => {
    // Arrange
    req.headers = { authorization: 'Bearer' };

    // Act
    authMiddleware(req as AuthRequest, res as Response, next);

    // Assert
    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Invalid token format' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when token is invalid', () => {
    // Arrange
    req.headers = { authorization: 'Bearer invalid-token' };
    mockedJwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    // Act
    authMiddleware(req as AuthRequest, res as Response, next);

    // Assert
    expect(mockedJwt.verify).toHaveBeenCalledWith(
      'invalid-token',
      'test-jwt-secret-key-for-testing-only',
    );
    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 500 when JWT_SECRET is not set', () => {
    // Arrange
    const originalSecret = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;

    req.headers = { authorization: 'Bearer some-token' };

    // Act
    authMiddleware(req as AuthRequest, res as Response, next);

    // Assert
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({ message: 'JWT_SECRET is not set' });
    expect(next).not.toHaveBeenCalled();

    // Restore
    process.env.JWT_SECRET = originalSecret;
  });

  it('should handle JWT verification errors gracefully', () => {
    // Arrange
    req.headers = { authorization: 'Bearer expired-token' };
    mockedJwt.verify.mockImplementation(() => {
      const error = new Error('Token expired');
      error.name = 'TokenExpiredError';
      throw error;
    });

    // Act
    authMiddleware(req as AuthRequest, res as Response, next);

    // Assert
    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle malformed JWT tokens', () => {
    // Arrange
    req.headers = { authorization: 'Bearer malformed.jwt.token' };
    mockedJwt.verify.mockImplementation(() => {
      const error = new Error('Malformed token');
      error.name = 'JsonWebTokenError';
      throw error;
    });

    // Act
    authMiddleware(req as AuthRequest, res as Response, next);

    // Assert
    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });
});
