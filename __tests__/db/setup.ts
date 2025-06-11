import { execSync } from 'child_process'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest'

// Single persistent client instance
let testPrisma: any = null
let isSetupComplete = false

const TEST_DB_PATH = join(process.cwd(), '__tests__/db/test.db')
const CLIENT_PATH = join(process.cwd(), '__tests__/db/generated/client')

async function ensureTestClient() {
  if (!existsSync(CLIENT_PATH)) {
    console.log('🔧 Generating test Prisma client...')
    
    // Ensure directory exists
    const dbDir = join(process.cwd(), '__tests__/db')
    if (!existsSync(dbDir)) {
      mkdirSync(dbDir, { recursive: true })
    }
    
    execSync('npx prisma generate --schema=__tests__/db/schema.prisma', {
      cwd: process.cwd(),
      stdio: 'inherit'
    })
    
    console.log('✅ Test Prisma client generated')
  }
}

async function getTestPrisma() {
  if (!testPrisma) {
    await ensureTestClient()
    
    const { PrismaClient } = await import('./generated/client')
    testPrisma = new PrismaClient({
      datasources: {
        db: {
          url: `file:${TEST_DB_PATH}`
        }
      },
      // SQLite optimizations
      log: ['error'],
      errorFormat: 'minimal'
    })
  }
  return testPrisma
}

export { getTestPrisma }

async function createDatabase() {
  console.log('🏗️  Creating test database...')
  
  // Create database schema (without force-reset to avoid file locks)
  execSync('npx prisma db push --schema=__tests__/db/schema.prisma', {
    cwd: process.cwd(),
    stdio: 'pipe' // Suppress output to avoid noise
  })
}

async function seedTestData() {
  const prisma = await getTestPrisma()
  
  console.log('🌱 Seeding test data...')
  
  try {
    // Check if data already exists
    const existingKana = await prisma.kana.count()
    if (existingKana > 0) {
      console.log('📦 Test data already exists, skipping seed')
      return
    }
    
    // Seed kana data
    await prisma.kana.deleteMany({});
    await prisma.kana.createMany({
      data: [
        { id: 'test-1', character: 'あ', romaji: 'a' },
        { id: 'test-2', character: 'い', romaji: 'i' },
        { id: 'test-3', character: 'う', romaji: 'u' },
        { id: 'test-4', character: 'ア', romaji: 'a' },
        { id: 'test-5', character: 'イ', romaji: 'i' },
      ],
    })

    // Seed test user
    await prisma.user.upsert({
      where: { id: 'test-user-1' },
      update: {},
      create: {
        id: 'test-user-1',
        email: 'test@example.com',
        name: 'Test User',
      },
    })
    
    console.log('✅ Test data seeded successfully')
  } catch (error) {
    console.error('❌ Error seeding test data:', error)
    throw error
  }
}

export async function setupTestDatabase() {
  if (isSetupComplete) {
    return
  }
  
  try {
    await ensureTestClient()
    await createDatabase()
    await seedTestData()
    isSetupComplete = true
    console.log('✅ Test database setup complete')
  } catch (error) {
    console.error('❌ Test database setup failed:', error)
    throw error
  }
}

export async function cleanupTestDatabase() {
  // Don't disconnect during tests - only at the very end
  if (testPrisma) {
    try {
      await testPrisma.$disconnect()
    } catch (error) {
      // Ignore disconnect errors
    }
    testPrisma = null
  }
  isSetupComplete = false
}

// Clean only progress data between tests, not the entire database
export async function cleanProgressData() {
  const prisma = await getTestPrisma()
  try {
    await prisma.kanaProgress.deleteMany({})
  } catch (error) {
    console.warn('Warning: Could not clean progress data:', error)
  }
}

// Global test hooks - setup once, cleanup once
beforeAll(async () => {
  await setupTestDatabase()
}, 60000)

afterAll(async () => {
  await cleanupTestDatabase()
})

// Clean only progress data between tests
beforeEach(async () => {
  await cleanProgressData()
})