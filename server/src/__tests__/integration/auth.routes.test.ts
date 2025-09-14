import '@jest/globals';
import request from 'supertest';
import { createTestApp } from '../testApp';
import { mockPrisma } from '../setup';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock bcrypt and jwt for integration tests
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

jest.mock('jsonwebtoken');
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('Auth Routes Integration', () => {
  const app = createTestApp();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hashedPassword' as never);
      mockPrisma.user.create.mockResolvedValue(mockUser as any);
      mockedJwt.sign.mockReturnValue('mock-jwt-token' as never);

      // Act & Assert
      const response = await request(app).post('/auth/register').send(userData).expect(200);

      expect(response.body).toEqual({
        user: mockUser,
        token: 'mock-jwt-token',
      });

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email },
      });
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          ...userData,
          password: 'hashedPassword',
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });
    });

    it('should return 400 when user already exists', async () => {
      // Arrange
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const existingUser = {
        id: 'existing-user-id',
        email: 'existing@example.com',
        name: 'Existing User',
        password: 'hashedPassword',
      };

      mockPrisma.user.findUnique.mockResolvedValue(existingUser as any);

      // Act & Assert
      const response = await request(app).post('/auth/register').send(userData).expect(400);

      expect(response.body).toEqual({
        message: 'User with this email already exists',
      });
    });

    it('should handle missing required fields', async () => {
      // Act & Assert
      const response = await request(app)
        .post('/auth/register')
        .send({ email: 'test@example.com' }) // Missing password and name
        .expect(400); // Auth controller should return 400 for missing fields

      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('POST /auth/login', () => {
    it('should login user with valid credentials', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser as any);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockedJwt.sign.mockReturnValue('mock-jwt-token' as never);

      // Act & Assert
      const response = await request(app).post('/auth/login').send(loginData).expect(200);

      expect(response.body).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
        },
        token: 'mock-jwt-token',
      });

      expect(mockedBcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
    });

    it('should return 400 with invalid credentials', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      const response = await request(app).post('/auth/login').send(loginData).expect(400);

      expect(response.body).toEqual({
        message: 'Invalid credentials',
      });
    });

    it('should return 400 with wrong password', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser as any);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      // Act & Assert
      const response = await request(app).post('/auth/login').send(loginData).expect(400);

      expect(response.body).toEqual({
        message: 'Invalid credentials',
      });
    });
  });
});
