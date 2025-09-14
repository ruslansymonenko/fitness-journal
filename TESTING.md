# Testing Guide

This document describes the testing setup and practices for the Fitness Journal application.

## Overview

The project uses a comprehensive testing strategy covering:

- **Unit Tests**: Individual functions and services
- **Integration Tests**: API endpoints and middleware
- **Build Tests**: TypeScript compilation and build processes
- **Security Audits**: Dependency vulnerability checks
- **Code Quality**: Linting and formatting checks

## Server Testing

### Test Stack

- **Jest**: Testing framework
- **Supertest**: HTTP assertion library
- **Prisma Mock**: Database mocking
- **TypeScript**: Full TypeScript support in tests

### Test Structure

```
server/src/__tests__/
├── setup.ts              # Global test configuration
├── testApp.ts            # Test application setup
├── services/             # Service layer tests
├── controllers/          # Controller layer tests
├── middleware/           # Middleware tests
└── integration/          # API integration tests
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Test Coverage

Current coverage targets:

- **Statements**: 95%+
- **Branches**: 85%+
- **Functions**: 90%+
- **Lines**: 95%+

### Writing Tests

#### Service Tests

```typescript
import { EntryService } from "@/services/entries.service";
import { mockPrisma } from "../setup";

describe("EntryService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create entry successfully", async () => {
    // Test implementation
  });
});
```

#### Controller Tests

```typescript
import { EntriesController } from "@/controllers/entries.controller";

describe("EntriesController", () => {
  let req, res, mockJson, mockStatus;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    req = { user: { userId: "test-id" } };
    res = { json: mockJson, status: mockStatus };
  });

  it("should handle request correctly", async () => {
    // Test implementation
  });
});
```

#### Integration Tests

```typescript
import request from "supertest";
import { createTestApp } from "../testApp";

describe("Auth Routes", () => {
  const app = createTestApp();

  it("should register user", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send(userData)
      .expect(200);
  });
});
```

## CI/CD Pipeline

### GitHub Actions Workflows

#### Main Branch (`ci.yml`)

Comprehensive testing for production readiness:

- ✅ Server tests with PostgreSQL database
- ✅ Client TypeScript checks and build
- ✅ Code formatting validation
- ✅ Security audit
- ✅ Test coverage reporting

#### Dev Branch (`dev-ci.yml`)

Faster feedback for development:

- ✅ Server unit tests (mocked database)
- ✅ Client build verification
- ⚡ Optimized for speed

### Branch Protection

The following rules are enforced:

- **Main Branch**: All CI checks must pass
- **Dev Branch**: Basic tests and build must pass
- Pull request reviews required for main branch
- Up-to-date branches required before merge

### Workflow Triggers

```yaml
on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main, dev]
```

## Test Environment Setup

### Environment Variables

```bash
# Required for tests
JWT_SECRET=test-jwt-secret-key
NODE_ENV=test
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/test_db
```

### Database Setup (Integration Tests)

```bash
# Start test database
docker run -d \
  --name test-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=fitness_journal_test \
  -p 5432:5432 \
  postgres:13

# Run migrations
npx prisma migrate deploy

# Generate client
npx prisma generate
```

## Mocking Strategy

### Prisma Database Mocking

```typescript
export const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    // ... other methods
  },
  entry: {
    findMany: jest.fn(),
    create: jest.fn(),
    // ... other methods
  },
};
```

### External Service Mocking

- JWT verification mocked for auth tests
- Bcrypt mocked for password hashing tests
- HTTP requests mocked in integration tests

## Best Practices

### Test Organization

- **Arrange-Act-Assert** pattern
- Descriptive test names
- Proper setup/teardown
- Mock cleanup between tests

### Coverage Guidelines

- Focus on business logic coverage
- Test error paths and edge cases
- Avoid testing implementation details
- Prioritize integration test coverage for critical paths

### Performance

- Use `beforeEach` for test isolation
- Clear mocks between tests
- Avoid unnecessary database calls
- Use `--maxWorkers=50%` for parallel execution

## Troubleshooting

### Common Issues

#### Jest Configuration

```javascript
// jest.config.cjs
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  // ... other config
};
```

#### TypeScript Issues

- Ensure `@types/jest` is installed
- Check `tsconfig.json` includes test files
- Verify path mapping configuration

#### Mock Issues

- Clear mocks in `beforeEach` hooks
- Use `jest.clearAllMocks()` globally
- Verify mock return values match expected types

### Debug Mode

```bash
# Run tests in debug mode
npm test -- --verbose --detectOpenHandles

# Run specific test file
npm test -- auth.service.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should register user"
```

## Continuous Improvement

### Metrics to Monitor

- Test execution time
- Coverage percentage
- Flaky test rate
- CI/CD pipeline duration

### Regular Maintenance

- Update test dependencies monthly
- Review and update test cases for new features
- Refactor tests when code structure changes
- Monitor test performance and optimize slow tests
