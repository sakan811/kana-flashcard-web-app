import { describe, it, expect, beforeEach } from '@jest/globals';
import { prisma } from './setup';
import { createUser, loginUser } from '../src/lib/auth';

describe('Authentication', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = await createUser(userData);
      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.password).not.toBe(userData.password); // Password should be hashed
    });

    it('should not create user with existing email', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      await createUser(userData);
      await expect(createUser(userData)).rejects.toThrow();
    });
  });

  describe('loginUser', () => {
    it('should login user with correct credentials', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      await createUser(userData);
      const result = await loginUser(userData);
      expect(result).toBeDefined();
      expect(result.user.email).toBe(userData.email);
      expect(result.token).toBeDefined();
    });

    it('should not login with incorrect password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      await createUser(userData);
      await expect(loginUser({
        email: userData.email,
        password: 'wrongpassword',
      })).rejects.toThrow();
    });
  });
}); 