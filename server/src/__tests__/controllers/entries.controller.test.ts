import '@jest/globals';
import { Response } from 'express';
import { EntriesController } from '@/controllers/entries.controller';
import { EntryService } from '@/services/entries.service';
import { AuthRequest } from '@/middleware/auth.middleware';

// Mock EntryService
jest.mock('@/services/entries.service');
const mockedEntryService = EntryService as jest.Mocked<typeof EntryService>;

describe('EntriesController', () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockSend: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    mockSend = jest.fn();

    req = {
      user: { userId: 'user-123' },
      body: {},
      params: {},
      query: {},
    };

    res = {
      json: mockJson,
      status: mockStatus,
      send: mockSend,
    };

    jest.clearAllMocks();
  });

  describe('list', () => {
    it('should return entries with pagination', async () => {
      // Arrange
      const mockResult = {
        entries: [
          {
            id: 'entry-1',
            date: new Date('2024-01-01'),
            workoutType: 'Running',
            duration: 30,
            notes: 'Morning run',
            userId: 'user-123',
            createdAt: new Date(),
            updatedAt: new Date(),
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

      req.query = { page: '1', limit: '10' };
      mockedEntryService.listAll.mockResolvedValue(mockResult);

      // Act
      await EntriesController.list(req as AuthRequest, res as Response);

      // Assert
      expect(mockedEntryService.listAll).toHaveBeenCalledWith({
        userId: 'user-123',
        page: 1,
        limit: 10,
        sortBy: 'date',
        sortOrder: 'desc',
      });
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });

    it('should handle query validation errors', async () => {
      // Arrange
      req.query = { page: 'invalid', limit: 'invalid' };

      // Act
      await EntriesController.list(req as AuthRequest, res as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(Object) }));
    });

    it('should handle service errors', async () => {
      // Arrange
      req.query = {};
      mockedEntryService.listAll.mockRejectedValue(new Error('Database error'));

      // Act
      await EntriesController.list(req as AuthRequest, res as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Internal server error' });
    });

    it('should handle filters correctly', async () => {
      // Arrange
      req.query = {
        workoutType: 'Running',
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31',
        minDuration: '20',
        maxDuration: '60',
        sortBy: 'duration',
        sortOrder: 'asc',
      };

      const mockResult = { entries: [], pagination: expect.any(Object) };
      mockedEntryService.listAll.mockResolvedValue(mockResult);

      // Act
      await EntriesController.list(req as AuthRequest, res as Response);

      // Assert
      expect(mockedEntryService.listAll).toHaveBeenCalledWith({
        userId: 'user-123',
        page: 1,
        limit: 10,
        sortBy: 'duration',
        sortOrder: 'asc',
        workoutType: 'Running',
        dateFrom: new Date('2024-01-01'),
        dateTo: new Date('2024-01-31'),
        minDuration: 20,
        maxDuration: 60,
      });
    });
  });

  describe('create', () => {
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

      req.body = entryData;
      mockedEntryService.create.mockResolvedValue(mockCreated);

      // Act
      await EntriesController.create(req as AuthRequest, res as Response);

      // Assert
      expect(mockedEntryService.create).toHaveBeenCalledWith({
        date: new Date('2024-01-01'),
        workoutType: 'Running',
        duration: 30,
        notes: 'Morning run',
        userId: 'user-123',
      });
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockCreated);
    });

    it('should handle validation errors', async () => {
      // Arrange
      req.body = {
        date: 'invalid-date',
        workoutType: '',
        duration: -5,
      };

      // Act
      await EntriesController.create(req as AuthRequest, res as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(Object) }));
      expect(mockedEntryService.create).not.toHaveBeenCalled();
    });

    it('should handle service errors during creation', async () => {
      // Arrange
      req.body = {
        date: '2024-01-01T00:00:00.000Z',
        workoutType: 'Running',
        duration: 30,
      };
      mockedEntryService.create.mockRejectedValue(new Error('Database error'));

      // Act
      await EntriesController.create(req as AuthRequest, res as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('getById', () => {
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

      req.params = { id: 'entry-1' };
      mockedEntryService.getById.mockResolvedValue(mockEntry);

      // Act
      await EntriesController.getById(req as AuthRequest, res as Response);

      // Assert
      expect(mockedEntryService.getById).toHaveBeenCalledWith('entry-1', 'user-123');
      expect(mockJson).toHaveBeenCalledWith(mockEntry);
    });

    it('should return 404 when entry not found', async () => {
      // Arrange
      req.params = { id: 'non-existent' };
      mockedEntryService.getById.mockResolvedValue(null);

      // Act
      await EntriesController.getById(req as AuthRequest, res as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Entry not found' });
    });

    it('should handle service errors', async () => {
      // Arrange
      req.params = { id: 'entry-1' };
      mockedEntryService.getById.mockRejectedValue(new Error('Database error'));

      // Act
      await EntriesController.getById(req as AuthRequest, res as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('update', () => {
    it('should update entry successfully', async () => {
      // Arrange
      const updateData = {
        workoutType: 'Cycling',
        duration: 45,
        notes: 'Updated notes',
      };

      const mockUpdated = {
        id: 'entry-1',
        date: new Date('2024-01-01'),
        workoutType: 'Cycling',
        duration: 45,
        notes: 'Updated notes',
        userId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      req.params = { id: 'entry-1' };
      req.body = updateData;
      mockedEntryService.update.mockResolvedValue(mockUpdated);

      // Act
      await EntriesController.update(req as AuthRequest, res as Response);

      // Assert
      expect(mockedEntryService.update).toHaveBeenCalledWith('entry-1', 'user-123', updateData);
      expect(mockJson).toHaveBeenCalledWith(mockUpdated);
    });

    it('should return 404 when entry not found', async () => {
      // Arrange
      req.params = { id: 'non-existent' };
      req.body = { workoutType: 'Cycling' };
      mockedEntryService.update.mockResolvedValue(null);

      // Act
      await EntriesController.update(req as AuthRequest, res as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Entry not found' });
    });

    it('should handle validation errors', async () => {
      // Arrange
      req.params = { id: 'entry-1' };
      req.body = {
        duration: -5, // Invalid duration
      };

      // Act
      await EntriesController.update(req as AuthRequest, res as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(Object) }));
      expect(mockedEntryService.update).not.toHaveBeenCalled();
    });

    it('should handle service errors during update', async () => {
      // Arrange
      req.params = { id: 'entry-1' };
      req.body = { workoutType: 'Cycling' };
      mockedEntryService.update.mockRejectedValue(new Error('Database error'));

      // Act
      await EntriesController.update(req as AuthRequest, res as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('delete', () => {
    it('should delete entry successfully', async () => {
      // Arrange
      req.params = { id: 'entry-1' };
      mockedEntryService.delete.mockResolvedValue(true);

      // Act
      await EntriesController.delete(req as AuthRequest, res as Response);

      // Assert
      expect(mockedEntryService.delete).toHaveBeenCalledWith('entry-1', 'user-123');
      expect(mockStatus).toHaveBeenCalledWith(204);
      expect(mockSend).toHaveBeenCalled();
    });

    it('should return 404 when entry not found', async () => {
      // Arrange
      req.params = { id: 'non-existent' };
      mockedEntryService.delete.mockResolvedValue(null);

      // Act
      await EntriesController.delete(req as AuthRequest, res as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Entry not found' });
    });

    it('should handle service errors during deletion', async () => {
      // Arrange
      req.params = { id: 'entry-1' };
      mockedEntryService.delete.mockRejectedValue(new Error('Database error'));

      // Act
      await EntriesController.delete(req as AuthRequest, res as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});
