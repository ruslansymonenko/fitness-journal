import '@jest/globals';
import AuthService from '@/services/auth.service';
import { mockPrisma } from '../setup';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

// Mock jwt
jest.mock('jsonwebtoken');
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    it('should register a new user successfully', async () => {
      // Arrange
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hashedPassword' as never);
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        name: 'Test User',
      };
      mockPrisma.user.create.mockResolvedValue(mockUser as any);
      mockedJwt.sign.mockReturnValue('mock-jwt-token' as never);

      // Act
      const result = await AuthService.register(registerData);

      // Assert
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerData.email },
      });
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(registerData.password, 10);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          ...registerData,
          password: 'hashedPassword',
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });
      expect(mockedJwt.sign).toHaveBeenCalledWith(
        { userId: mockUser.id },
        'test-jwt-secret-key-for-testing-only',
        { expiresIn: '7d' },
      );
      expect(result).toEqual({
        user: mockUser,
        token: 'mock-jwt-token',
      });
    });

    it('should throw error if user already exists', async () => {
      // Arrange
      const existingUser = {
        id: 'existing-user-id',
        email: 'test@example.com',
        name: 'Existing User',
        password: 'hashedPassword',
      };
      mockPrisma.user.findUnique.mockResolvedValue(existingUser as any);

      // Act & Assert
      await expect(AuthService.register(registerData)).rejects.toThrow(
        'User with this email already exists',
      );
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });

    it('should handle database errors during registration', async () => {
      // Arrange
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hashedPassword' as never);
      mockPrisma.user.create.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(AuthService.register(registerData)).rejects.toThrow('Database error');
    });
  });

  describe('login', () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login user with valid credentials', async () => {
      // Arrange
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
      };
      mockPrisma.user.findUnique.mockResolvedValue(mockUser as any);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockedJwt.sign.mockReturnValue('mock-jwt-token' as never);

      // Act
      const result = await AuthService.login(loginData);

      // Assert
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginData.email },
      });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
      expect(mockedJwt.sign).toHaveBeenCalledWith(
        { userId: mockUser.id },
        'test-jwt-secret-key-for-testing-only',
        { expiresIn: '7d' },
      );
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
        },
        token: 'mock-jwt-token',
      });
    });

    it('should throw error if user not found', async () => {
      // Arrange
      mockPrisma.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(AuthService.login(loginData)).rejects.toThrow('Invalid credentials');
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw error if password is invalid', async () => {
      // Arrange
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
      };
      mockPrisma.user.findUnique.mockResolvedValue(mockUser as any);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      // Act & Assert
      await expect(AuthService.login(loginData)).rejects.toThrow('Invalid credentials');
      expect(mockedJwt.sign).not.toHaveBeenCalled();
    });

    it('should handle database errors during login', async () => {
      // Arrange
      mockPrisma.user.findUnique.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(AuthService.login(loginData)).rejects.toThrow('Database error');
    });
  });
});
