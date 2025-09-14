import '@jest/globals';

// Mock Prisma Client
export const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  entry: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  $disconnect: jest.fn(),
};

// Mock the database module
jest.mock('@/db', () => ({
  prisma: mockPrisma,
}));

// Mock JWT_SECRET for testing
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.NODE_ENV = 'test';

// Clean up mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Global test utilities
declare global {
  var mockPrisma: any;
}

(global as any).mockPrisma = mockPrisma;