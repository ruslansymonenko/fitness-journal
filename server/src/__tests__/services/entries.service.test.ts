import '@jest/globals';
import {
  EntryService,
  CreateEntryInput,
  UpdateEntryInput,
  ListEntriesOptions,
} from '@/services/entries.service';
import { mockPrisma } from '../setup';

describe('EntryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listAll', () => {
    const options: ListEntriesOptions = {
      userId: 'user-123',
      page: 1,
      limit: 10,
    };

    it('should list entries with pagination', async () => {
      // Arrange
      const mockEntries = [
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
        {
          id: 'entry-2',
          date: new Date('2024-01-02'),
          workoutType: 'Cycling',
          duration: 45,
          notes: null,
          userId: 'user-123',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.entry.findMany.mockResolvedValue(mockEntries);
      mockPrisma.entry.count.mockResolvedValue(25);

      // Act
      const result = await EntryService.listAll(options);

      // Assert
      expect(mockPrisma.entry.findMany).toHaveBeenCalledWith({
        where: { userId: options.userId },
        orderBy: { date: 'desc' },
        skip: 0,
        take: 10,
      });

      expect(mockPrisma.entry.count).toHaveBeenCalledWith({
        where: { userId: options.userId },
      });

      expect(result).toEqual({
        entries: mockEntries,
        pagination: {
          page: 1,
          limit: 10,
          total: 25,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
        },
      });
    });

    it('should filter by workout type', async () => {
      // Arrange
      const optionsWithFilter = { ...options, workoutType: 'Running' };
      mockPrisma.entry.findMany.mockResolvedValue([]);
      mockPrisma.entry.count.mockResolvedValue(0);

      // Act
      await EntryService.listAll(optionsWithFilter);

      // Assert
      expect(mockPrisma.entry.findMany).toHaveBeenCalledWith({
        where: {
          userId: options.userId,
          workoutType: { contains: 'Running', mode: 'insensitive' },
        },
        orderBy: { date: 'desc' },
        skip: 0,
        take: 10,
      });
    });

    it('should filter by date range', async () => {
      // Arrange
      const dateFrom = new Date('2024-01-01');
      const dateTo = new Date('2024-01-31');
      const optionsWithDateFilter = { ...options, dateFrom, dateTo };
      mockPrisma.entry.findMany.mockResolvedValue([]);
      mockPrisma.entry.count.mockResolvedValue(0);

      // Act
      await EntryService.listAll(optionsWithDateFilter);

      // Assert
      expect(mockPrisma.entry.findMany).toHaveBeenCalledWith({
        where: {
          userId: options.userId,
          date: {
            gte: dateFrom,
            lte: dateTo,
          },
        },
        orderBy: { date: 'desc' },
        skip: 0,
        take: 10,
      });
    });

    it('should filter by duration range', async () => {
      // Arrange
      const optionsWithDurationFilter = { ...options, minDuration: 20, maxDuration: 60 };
      mockPrisma.entry.findMany.mockResolvedValue([]);
      mockPrisma.entry.count.mockResolvedValue(0);

      // Act
      await EntryService.listAll(optionsWithDurationFilter);

      // Assert
      expect(mockPrisma.entry.findMany).toHaveBeenCalledWith({
        where: {
          userId: options.userId,
          duration: {
            gte: 20,
            lte: 60,
          },
        },
        orderBy: { date: 'desc' },
        skip: 0,
        take: 10,
      });
    });

    it('should handle custom sorting', async () => {
      // Arrange
      const optionsWithSorting = {
        ...options,
        sortBy: 'duration' as const,
        sortOrder: 'asc' as const,
      };
      mockPrisma.entry.findMany.mockResolvedValue([]);
      mockPrisma.entry.count.mockResolvedValue(0);

      // Act
      await EntryService.listAll(optionsWithSorting);

      // Assert
      expect(mockPrisma.entry.findMany).toHaveBeenCalledWith({
        where: { userId: options.userId },
        orderBy: { duration: 'asc' },
        skip: 0,
        take: 10,
      });
    });

    it('should handle pagination correctly for page 2', async () => {
      // Arrange
      const optionsPage2 = { ...options, page: 2 };
      mockPrisma.entry.findMany.mockResolvedValue([]);
      mockPrisma.entry.count.mockResolvedValue(25);

      // Act
      const result = await EntryService.listAll(optionsPage2);

      // Assert
      expect(mockPrisma.entry.findMany).toHaveBeenCalledWith({
        where: { userId: options.userId },
        orderBy: { date: 'desc' },
        skip: 10, // (2-1) * 10
        take: 10,
      });

      expect(result.pagination).toEqual({
        page: 2,
        limit: 10,
        total: 25,
        totalPages: 3,
        hasNext: true,
        hasPrev: true,
      });
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

      mockPrisma.entry.findFirst.mockResolvedValue(mockEntry);

      // Act
      const result = await EntryService.getById('entry-1', 'user-123');

      // Assert
      expect(mockPrisma.entry.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'entry-1',
          userId: 'user-123',
        },
      });
      expect(result).toEqual(mockEntry);
    });

    it('should return null when entry not found', async () => {
      // Arrange
      mockPrisma.entry.findFirst.mockResolvedValue(null);

      // Act
      const result = await EntryService.getById('non-existent', 'user-123');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new entry', async () => {
      // Arrange
      const createData: CreateEntryInput = {
        date: new Date('2024-01-01'),
        workoutType: 'Running',
        duration: 30,
        notes: 'Morning run',
        userId: 'user-123',
      };

      const mockCreatedEntry = {
        id: 'new-entry-id',
        ...createData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.entry.create.mockResolvedValue(mockCreatedEntry);

      // Act
      const result = await EntryService.create(createData);

      // Assert
      expect(mockPrisma.entry.create).toHaveBeenCalledWith({
        data: {
          date: createData.date,
          workoutType: createData.workoutType,
          duration: createData.duration,
          notes: createData.notes,
          userId: createData.userId,
        },
      });
      expect(result).toEqual(mockCreatedEntry);
    });

    it('should create entry with null notes when not provided', async () => {
      // Arrange
      const createData: CreateEntryInput = {
        date: new Date('2024-01-01'),
        workoutType: 'Running',
        duration: 30,
        userId: 'user-123',
      };

      const mockCreatedEntry = {
        id: 'new-entry-id',
        ...createData,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.entry.create.mockResolvedValue(mockCreatedEntry);

      // Act
      await EntryService.create(createData);

      // Assert
      expect(mockPrisma.entry.create).toHaveBeenCalledWith({
        data: {
          date: createData.date,
          workoutType: createData.workoutType,
          duration: createData.duration,
          notes: null,
          userId: createData.userId,
        },
      });
    });
  });

  describe('update', () => {
    it('should update existing entry', async () => {
      // Arrange
      const existingEntry = {
        id: 'entry-1',
        date: new Date('2024-01-01'),
        workoutType: 'Running',
        duration: 30,
        notes: 'Original notes',
        userId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateData: UpdateEntryInput = {
        workoutType: 'Cycling',
        duration: 45,
        notes: 'Updated notes',
      };

      const updatedEntry = { ...existingEntry, ...updateData };

      mockPrisma.entry.findFirst.mockResolvedValue(existingEntry);
      mockPrisma.entry.update.mockResolvedValue(updatedEntry);

      // Act
      const result = await EntryService.update('entry-1', 'user-123', updateData);

      // Assert
      expect(mockPrisma.entry.findFirst).toHaveBeenCalledWith({
        where: { id: 'entry-1', userId: 'user-123' },
      });
      expect(mockPrisma.entry.update).toHaveBeenCalledWith({
        where: { id: 'entry-1' },
        data: {
          workoutType: 'Cycling',
          duration: 45,
          notes: 'Updated notes',
        },
      });
      expect(result).toEqual(updatedEntry);
    });

    it('should return null when entry not found', async () => {
      // Arrange
      mockPrisma.entry.findFirst.mockResolvedValue(null);

      // Act
      const result = await EntryService.update('non-existent', 'user-123', {});

      // Assert
      expect(mockPrisma.entry.update).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should handle null notes correctly', async () => {
      // Arrange
      const existingEntry = {
        id: 'entry-1',
        userId: 'user-123',
        date: new Date(),
        workoutType: 'Running',
        duration: 30,
        notes: 'Original notes',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.entry.findFirst.mockResolvedValue(existingEntry);
      mockPrisma.entry.update.mockResolvedValue({ ...existingEntry, notes: null });

      // Act
      await EntryService.update('entry-1', 'user-123', { notes: null });

      // Assert
      expect(mockPrisma.entry.update).toHaveBeenCalledWith({
        where: { id: 'entry-1' },
        data: { notes: null },
      });
    });
  });

  describe('delete', () => {
    it('should delete existing entry', async () => {
      // Arrange
      const existingEntry = {
        id: 'entry-1',
        userId: 'user-123',
        date: new Date(),
        workoutType: 'Running',
        duration: 30,
        notes: 'Notes',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.entry.findFirst.mockResolvedValue(existingEntry);
      mockPrisma.entry.delete.mockResolvedValue(existingEntry);

      // Act
      const result = await EntryService.delete('entry-1', 'user-123');

      // Assert
      expect(mockPrisma.entry.findFirst).toHaveBeenCalledWith({
        where: { id: 'entry-1', userId: 'user-123' },
      });
      expect(mockPrisma.entry.delete).toHaveBeenCalledWith({
        where: { id: 'entry-1' },
      });
      expect(result).toBe(true);
    });

    it('should return null when entry not found', async () => {
      // Arrange
      mockPrisma.entry.findFirst.mockResolvedValue(null);

      // Act
      const result = await EntryService.delete('non-existent', 'user-123');

      // Assert
      expect(mockPrisma.entry.delete).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
