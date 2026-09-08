import { PrismaClient, Role, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { loginAction, registerAction } from './lib/actions/auth-actions';
import { approveUserAction, rejectUserAction, getUsers } from './lib/actions/user-actions';
import { createSessionToken } from './lib/auth/session';

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:3000';

async function testAll() {
  console.log('====================================================');
  console.log('  STARTING COMPREHENSIVE AUTH & ACCESS CONTROL TESTS');
  console.log('====================================================\n');

  // Test 1: Unauthenticated Route Protection
  console.log('1. Testing Unauthenticated Route Protection (Private Catalog)...');
  const protectedRoutes = [
    '/',
    '/services/business',
    '/services/detail/website-nusantara-regas',
    '/search?q=Portal',
    '/admin',
    '/admin/services',
    '/admin/users',
  ];

  for (const route of protectedRoutes) {
    const res = await fetch(`${BASE_URL}${route}`, {
      redirect: 'manual',
    });
    const status = res.status;
    const location = res.headers.get('location') || '';
    if (status === 307 || status === 308 || status === 302) {
      console.log(`   ✓ Unauthenticated [${route}] properly redirected (${status} -> ${location})`);
    } else {
      throw new Error(`FAIL: [${route}] returned ${status} instead of redirect!`);
    }
  }

  // Test 2: Public Routes Access
  console.log('\n2. Testing Public Routes Access (Login, Register, Pending, Unauthorized)...');
  const publicRoutes = ['/login', '/register', '/register/pending', '/unauthorized'];
  for (const route of publicRoutes) {
    const res = await fetch(`${BASE_URL}${route}`);
    if (res.status === 200) {
      console.log(`   ✓ Public Route [${route}] accessible (HTTP 200 OK)`);
    } else {
      throw new Error(`FAIL: Public Route [${route}] returned status ${res.status}`);
    }
  }

  // Test 3: Public User Registration
  console.log('\n3. Testing Public User Registration Flow...');
  const testEmail = `new-worker-${Date.now()}@nusantararegas.com`;
  const regResult = await registerAction({
    name: 'Budi Santoso',
    email: testEmail,
    password: 'password123',
    confirmPassword: 'password123',
  });

  if (!regResult.success || regResult.redirectTo !== '/register/pending') {
    throw new Error(`FAIL: Registration failed: ${JSON.stringify(regResult)}`);
  }
  console.log(`   ✓ Registration succeeded -> redirected to: ${regResult.redirectTo}`);

  // Verify in PostgreSQL database
  const createdUser = await prisma.user.findUnique({
    where: { email: testEmail },
  });

  if (!createdUser) {
    throw new Error('FAIL: User record not found in PostgreSQL database!');
  }

  if (createdUser.role !== Role.USER) {
    throw new Error(`FAIL: Expected role USER, got ${createdUser.role}`);
  }

  if (createdUser.status !== UserStatus.PENDING) {
    throw new Error(`FAIL: Expected status PENDING, got ${createdUser.status}`);
  }

  const isBcrypt = await bcrypt.compare('password123', createdUser.password);
  if (!isBcrypt) {
    throw new Error('FAIL: Password is not hashed with bcrypt!');
  }

  console.log(`   ✓ Verified in PostgreSQL: role=${createdUser.role}, status=${createdUser.status}, bcrypt hashed password.`);

  // Test 4: Pending User Login Blocked
  console.log('\n4. Testing Login for PENDING User (Must Be Denied)...');
  const pendingLogin = await loginAction({
    identifier: testEmail,
    password: 'password123',
  });

  if (pendingLogin.success) {
    throw new Error('FAIL: PENDING user was allowed to log in!');
  }

  if (pendingLogin.error !== 'Your account is waiting for administrator approval.') {
    throw new Error(`FAIL: Unexpected error message: ${pendingLogin.error}`);
  }
  console.log(`   ✓ PENDING login rejected with message: "${pendingLogin.error}"`);

  // Test 5: Admin Approval of User Account
  console.log('\n5. Testing Administrator Approval Flow...');
  const updatedToApproved = await prisma.user.update({
    where: { id: createdUser.id },
    data: { status: UserStatus.APPROVED },
  });
  console.log(`   ✓ Admin approved user: ${updatedToApproved.email} (Status is now ${updatedToApproved.status})`);

  // Test 6: Approved User Login & Catalog Access
  console.log('\n6. Testing Login for APPROVED USER...');
  const approvedLogin = await loginAction({
    identifier: testEmail,
    password: 'password123',
  });

  if (!approvedLogin.success || approvedLogin.redirectTo !== '/') {
    throw new Error(`FAIL: Approved user login failed: ${JSON.stringify(approvedLogin)}`);
  }
  console.log(`   ✓ APPROVED USER logged in successfully -> redirectTo: ${approvedLogin.redirectTo}`);

  // Test 7: User Token accessing Catalog vs Admin
  console.log('\n7. Testing Role-Based Token Authorization...');
  const userToken = await createSessionToken({
    userId: createdUser.id,
    name: createdUser.name,
    email: createdUser.email,
    role: Role.USER,
  });

  // User accesses catalog root /
  const userCatalogRes = await fetch(`${BASE_URL}/`, {
    headers: { Cookie: `nr_session=${userToken}` },
  });
  if (userCatalogRes.status === 200) {
    console.log(`   ✓ APPROVED USER with session cookie can access Catalog Home (HTTP 200 OK)`);
  } else {
    throw new Error(`FAIL: APPROVED USER failed to access Catalog Home (status ${userCatalogRes.status})`);
  }

  // User attempts to access /admin
  const userAdminRes = await fetch(`${BASE_URL}/admin`, {
    headers: { Cookie: `nr_session=${userToken}` },
    redirect: 'manual',
  });
  if (userAdminRes.status === 307 || userAdminRes.status === 308 || userAdminRes.status === 302) {
    const loc = userAdminRes.headers.get('location') || '';
    if (loc.includes('/unauthorized')) {
      console.log(`   ✓ APPROVED USER attempting /admin properly blocked -> redirected to /unauthorized`);
    } else {
      throw new Error(`FAIL: User redirected to ${loc} instead of /unauthorized!`);
    }
  } else {
    throw new Error(`FAIL: USER was allowed into /admin (status ${userAdminRes.status})!`);
  }

  // Test 8: Admin Login & Access
  console.log('\n8. Testing ADMIN Login and Admin Console Access...');
  const adminLogin = await loginAction({
    identifier: 'admin@nusantararegas.com',
    password: 'admin123',
  });

  if (!adminLogin.success || adminLogin.redirectTo !== '/admin') {
    throw new Error(`FAIL: Admin login failed: ${JSON.stringify(adminLogin)}`);
  }
  console.log(`   ✓ ADMIN logged in successfully -> redirectTo: ${adminLogin.redirectTo}`);

  const adminToken = await createSessionToken({
    userId: 'admin-id',
    name: 'Administrator NR',
    email: 'admin@nusantararegas.com',
    role: Role.ADMIN,
  });

  const adminRes = await fetch(`${BASE_URL}/admin`, {
    headers: { Cookie: `nr_session=${adminToken}` },
  });
  if (adminRes.status === 200) {
    console.log(`   ✓ ADMIN can access /admin console (HTTP 200 OK)`);
  } else {
    throw new Error(`FAIL: ADMIN failed to access /admin (status ${adminRes.status})`);
  }

  // Test 9: Rejected User Login Denied
  console.log('\n9. Testing Login for REJECTED User...');
  await prisma.user.update({
    where: { id: createdUser.id },
    data: { status: UserStatus.REJECTED },
  });

  const rejectedLogin = await loginAction({
    identifier: testEmail,
    password: 'password123',
  });

  if (rejectedLogin.success) {
    throw new Error('FAIL: REJECTED user was allowed to log in!');
  }

  if (rejectedLogin.error !== 'Your account has been rejected. Please contact administrator.') {
    throw new Error(`FAIL: Unexpected error message: ${rejectedLogin.error}`);
  }
  console.log(`   ✓ REJECTED user login denied with message: "${rejectedLogin.error}"`);

  // Clean up test user
  await prisma.user.delete({ where: { id: createdUser.id } });
  console.log(`   ✓ Cleaned up test user from database.`);

  console.log('\n====================================================');
  console.log('  ALL ACCESS CONTROL & AUTHENTICATION TESTS PASSED!');
  console.log('====================================================');
}

testAll()
  .catch((err) => {
    console.error('\n❌ TEST FAILED:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
