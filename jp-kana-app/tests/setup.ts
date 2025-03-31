import '@testing-library/jest-dom';
import { PrismaClient } from '@prisma/client';
import { afterEach, afterAll } from '@jest/globals';

// Create a new PrismaClient instance for testing
export const prisma = new PrismaClient();

// Clean up database after each test
afterEach(async () => {
  await prisma.userProgress.deleteMany();
  await prisma.user.deleteMany();
});

// Close Prisma connection after all tests
afterAll(async () => {
  await prisma.$disconnect();
}); 