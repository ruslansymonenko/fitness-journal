import '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { createTestApp } from '../testApp';
import { mockPrisma } from '../setup';

jest.mock('jsonwebtoken');
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('Entries Routes Integration', () => {
  const app = createTestApp();
  const validToken = 'valid-jwt-token';
  const userId = 'user-123';

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock JWT verification to always return valid user
    mockedJwt.verify.mockReturnValue({ userId } as any);
  });

  describe('GET /entries', () => {
    it('should return entries with pagination', async () => {
      // Arrange
      const now = new Date('2025-09-14T16:11:52.326Z');
      const mockEntries = [
        {
          id: 'entry-1',
          date: new Date('2024-01-01'),
          workoutType: 'Running',
          duration: 30,
          notes: 'Morning run',
          userId: 'user-123',
          createdAt: now,
          updatedAt: now,
        },
      ];

      const expectedResult = {
        entries: [
          {
            id: 'entry-1',
            date: '2024-01-01T00:00:00.000Z',
            workoutType: 'Running',
            duration: 30,
            notes: 'Morning run',
            userId: 'user-123',
            createdAt: '2025-09-14T16:11:52.326Z',
            updatedAt: '2025-09-14T16:11:52.326Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };

      mockPrisma.entry.findMany.mockResolvedValue(mockEntries);
      mockPrisma.entry.count.mockResolvedValue(1);

      // Act & Assert
      const response = await request(app)
        .get('/entries')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body).toEqual(expectedResult);
    });

    it('should return 401 without authorization header', async () => {
      // Act & Assert
      await request(app).get('/entries').expect(401);
    });

    it('should handle query parameters', async () => {
      // Arrange
      mockPrisma.entry.findMany.mockResolvedValue([]);
      mockPrisma.entry.count.mockResolvedValue(0);

      // Act & Assert
      const response = await request(app)
        .get('/entries?page=2&limit=5&sortBy=duration&sortOrder=asc&workoutType=Running')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.pagination.page).toBe(2);
      expect(response.body.pagination.limit).toBe(5);
    });

    it('should handle invalid query parameters', async () => {
      // Act & Assert
      await request(app)
        .get('/entries?page=invalid&limit=invalid')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(400);
    });
  });

  describe('POST /entries', () => {
    it('should create entry successfully', async () => {
      // Arrange
      const entryData = {
        date: '2024-01-01T00:00:00.000Z',
        workoutType: 'Running',
        duration: 30,
        notes: 'Morning run',
      };

      const mockCreated = {
        id: 'new-entry-id',
        date: new Date('2024-01-01'),
        workoutType: 'Running',
        duration: 30,
        notes: 'Morning run',
        userId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.entry.create.mockResolvedValue(mockCreated);

      // Act & Assert
      const response = await request(app)
        .post('/entries')
        .set('Authorization', `Bearer ${validToken}`)
        .send(entryData)
        .expect(201);

      expect(response.body).toMatchObject({
        id: 'new-entry-id',
        workoutType: 'Running',
        duration: 30,
        notes: 'Morning run',
        userId: 'user-123',
      });

      expect(mockPrisma.entry.create).toHaveBeenCalledWith({
        data: {
          date: new Date('2024-01-01'),
          workoutType: 'Running',
          duration: 30,
          notes: 'Morning run',
          userId: 'user-123',
        },
      });
    });

    it('should return 401 without authorization', async () => {
      // Act & Assert
      await request(app)
        .post('/entries')
        .send({
          date: '2024-01-01T00:00:00.000Z',
          workoutType: 'Running',
          duration: 30,
        })
        .expect(401);
    });

    it('should return 400 with invalid data', async () => {
      // Act & Assert
      await request(app)
        .post('/entries')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          date: 'invalid-date',
          workoutType: '',
          duration: -5,
        })
        .expect(400);
    });

    it('should create entry without notes', async () => {
      // Arrange
      const entryData = {
        date: '2024-01-01T00:00:00.000Z',
        workoutType: 'Running',
        duration: 30,
      };

      const mockCreated = {
        id: 'new-entry-id',
        date: new Date('2024-01-01'),
        workoutType: 'Running',
        duration: 30,
        notes: null,
        userId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.entry.create.mockResolvedValue(mockCreated);

      // Act & Assert
      const response = await request(app)
        .post('/entries')
        .set('Authorization', `Bearer ${validToken}`)
        .send(entryData)
        .expect(201);

      expect(response.body.notes).toBeNull();
    });
  });

  describe('GET /entries/:id', () => {
    it('should return entry when found', async () => {
      // Arrange
      const mockEntry = {
        id: 'entry-1',
        date: new Date('2024-01-01'),
        workoutType: 'Running',
        duration: 30,
        notes: 'Morning run',
        userId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.entry.findFirst.mockResolvedValue(mockEntry);

      // Act & Assert
      const response = await request(app)
        .get('/entries/entry-1')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: 'entry-1',
        workoutType: 'Running',
        duration: 30,
      });

      expect(mockPrisma.entry.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'entry-1',
          userId: 'user-123',
        },
      });
    });

    it('should return 404 when entry not found', async () => {
      // Arrange
      mockPrisma.entry.findFirst.mockResolvedValue(null);

      // Act & Assert
      await request(app)
        .get('/entries/non-existent')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(404);
    });

    it('should return 401 without authorization', async () => {
      // Act & Assert
      await request(app).get('/entries/entry-1').expect(401);
    });
  });

  describe('PUT /entries/:id', () => {
    it('should update entry successfully', async () => {
      // Arrange
      const updateData = {
        workoutType: 'Cycling',
        duration: 45,
        notes: 'Updated notes',
      };

      const existingEntry = {
        id: 'entry-1',
        userId: 'user-123',
        date: new Date('2024-01-01'),
        workoutType: 'Running',
        duration: 30,
        notes: 'Original notes',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedEntry = { ...existingEntry, ...updateData };

      mockPrisma.entry.findFirst.mockResolvedValue(existingEntry);
      mockPrisma.entry.update.mockResolvedValue(updatedEntry);

      // Act & Assert
      const response = await request(app)
        .put('/entries/entry-1')
        .set('Authorization', `Bearer ${validToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toMatchObject({
        id: 'entry-1',
        workoutType: 'Cycling',
        duration: 45,
        notes: 'Updated notes',
      });

      expect(mockPrisma.entry.update).toHaveBeenCalledWith({
        where: { id: 'entry-1' },
        data: updateData,
      });
    });

    it('should return 404 when entry not found', async () => {
      // Arrange
      mockPrisma.entry.findFirst.mockResolvedValue(null);

      // Act & Assert
      await request(app)
        .put('/entries/non-existent')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ workoutType: 'Cycling' })
        .expect(404);
    });

    it('should return 400 with invalid data', async () => {
      // Act & Assert
      await request(app)
        .put('/entries/entry-1')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ duration: -5 })
        .expect(400);
    });

    it('should return 401 without authorization', async () => {
      // Act & Assert
      await request(app).put('/entries/entry-1').send({ workoutType: 'Cycling' }).expect(401);
    });
  });

  describe('DELETE /entries/:id', () => {
    it('should delete entry successfully', async () => {
      // Arrange
      const existingEntry = {
        id: 'entry-1',
        userId: 'user-123',
        date: new Date('2024-01-01'),
        workoutType: 'Running',
        duration: 30,
        notes: 'Notes',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.entry.findFirst.mockResolvedValue(existingEntry);
      mockPrisma.entry.delete.mockResolvedValue(existingEntry);

      // Act & Assert
      await request(app)
        .delete('/entries/entry-1')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(204);

      expect(mockPrisma.entry.delete).toHaveBeenCalledWith({
        where: { id: 'entry-1' },
      });
    });

    it('should return 404 when entry not found', async () => {
      // Arrange
      mockPrisma.entry.findFirst.mockResolvedValue(null);

      // Act & Assert
      await request(app)
        .delete('/entries/non-existent')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(404);
    });

    it('should return 401 without authorization', async () => {
      // Act & Assert
      await request(app).delete('/entries/entry-1').expect(401);
    });
  });
});
