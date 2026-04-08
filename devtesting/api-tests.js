/**
 * Comprehensive API Test Suite for ReactCampus
 * Zero external dependencies — uses native Node.js http module.
 *
 * Tests every API endpoint across all 19 route modules + edge cases + cleanup.
 * Generates a colored console report and writes devtesting/test-report.txt.
 *
 * Idempotent: uses a unique run ID (timestamp) in all test data so
 * re-runs never collide with leftover soft-deleted records.
 *
 * Usage:
 *   node devtesting/api-tests.js
 *
 * Requires server running on port 5050 with a seeded database.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

// ─── Config ──────────────────────────────────────────────────────────────────
const PORT = 5050;
const HOST = 'localhost';
const BASE_PATH = '/api/v1';

// Unique run ID — prevents slug/email collisions across runs
const RUN = Date.now().toString(36); // e.g. "m1abc2d"

// ─── State ───────────────────────────────────────────────────────────────────
const state = {};
let totalPassed = 0;
let totalFailed = 0;
let totalTests = 0;

// Per-suite tracking
const suites = [];
let currentSuite = null;

// ─── Colors ──────────────────────────────────────────────────────────────────
const C = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
  white: '\x1b[37m',
};

// ─── HTTP helper ─────────────────────────────────────────────────────────────
function request(method, urlPath, body, token) {
  return new Promise((resolve, reject) => {
    const fullPath = BASE_PATH + urlPath;
    const opts = {
      hostname: HOST,
      port: PORT,
      path: fullPath,
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (token) opts.headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        let parsed;
        try { parsed = JSON.parse(data); } catch { parsed = data; }
        resolve({ status: res.statusCode, headers: res.headers, body: parsed });
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function rawRequest(method, urlPath, token) {
  return new Promise((resolve, reject) => {
    const opts = { hostname: HOST, port: PORT, path: urlPath, method, headers: {} };
    if (token) opts.headers['Authorization'] = `Bearer ${token}`;
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        let parsed;
        try { parsed = JSON.parse(data); } catch { parsed = data; }
        resolve({ status: res.statusCode, headers: res.headers, body: parsed });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

const get = (p, t) => request('GET', p, null, t);
const post = (p, b, t) => request('POST', p, b, t);
const patch = (p, b, t) => request('PATCH', p, b, t);
const del = (p, t) => request('DELETE', p, null, t);

// ─── Suite / Assert helpers ──────────────────────────────────────────────────
function suite(name) {
  currentSuite = { name, passed: 0, failed: 0, results: [] };
  suites.push(currentSuite);
  console.log(`\n${C.cyan}${C.bold}── ${name} ──${C.reset}`);
}

function assert(name, condition, detail) {
  totalTests++;
  const ok = !!condition;
  if (ok) {
    totalPassed++;
    currentSuite.passed++;
    console.log(`  ${C.green}✓${C.reset} ${name}`);
  } else {
    totalFailed++;
    currentSuite.failed++;
    const extra = detail ? ` ${C.dim}— ${detail}${C.reset}` : '';
    console.log(`  ${C.red}✗${C.reset} ${name}${extra}`);
  }
  currentSuite.results.push({ name, ok, detail: ok ? null : detail || null });
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST SUITES
// ═══════════════════════════════════════════════════════════════════════════════

// ─── 1. Health Check ─────────────────────────────────────────────────────────
async function testHealthCheck() {
  suite('Health Check');
  const res = await rawRequest('GET', '/health');
  assert('GET /health returns 200', res.status === 200, `status=${res.status}`);
}

// ─── 2. Auth ─────────────────────────────────────────────────────────────────
async function testAuth() {
  suite('Auth');

  const email = `devtest-${RUN}@example.com`;

  // Register
  let res = await post('/auth/register', {
    firstName: 'DevTest', lastName: 'User',
    email, password: 'DevTest@12345',
  });
  assert('Register new user', res.status === 201, `status=${res.status}`);
  assert('Register returns tokens', !!res.body.data?.accessToken && !!res.body.data?.refreshToken);
  state.testUserEmail = email;
  state.testUserToken = res.body.data?.accessToken;
  state.testRefreshToken = res.body.data?.refreshToken;

  // Duplicate register
  res = await post('/auth/register', {
    firstName: 'DevTest', lastName: 'User',
    email, password: 'DevTest@12345',
  });
  assert('Duplicate register rejected (409)', res.status === 409, `status=${res.status}`);

  // Validation error — missing fields
  res = await post('/auth/register', { firstName: 'X' });
  assert('Validation error on register', res.status === 400, `status=${res.status}`);

  // Login admin
  res = await post('/auth/login', {
    email: 'admin@reactcampus.com', password: 'Admin@123456',
  });
  assert('Admin login', res.status === 200, `status=${res.status}`);
  assert('Login returns tokens', !!res.body.data?.accessToken);
  state.adminToken = res.body.data?.accessToken;
  state.adminRefreshToken = res.body.data?.refreshToken;
  state.adminId = res.body.data?.user?.id;

  // GET /auth/me
  res = await get('/auth/me', state.adminToken);
  assert('GET /auth/me returns profile', res.status === 200 && res.body.data?.user?.email === 'admin@reactcampus.com');
  assert('Me includes permissions array', Array.isArray(res.body.data?.permissions) && res.body.data.permissions.length > 0,
    `perms=${res.body.data?.permissions?.length}`);

  // Refresh token
  res = await post('/auth/refresh', { refreshToken: state.adminRefreshToken });
  assert('Refresh token', res.status === 200 && !!res.body.data?.accessToken);
  state.adminToken = res.body.data?.accessToken;
  state.adminRefreshToken = res.body.data?.refreshToken;

  // Change password
  res = await post('/auth/change-password', {
    currentPassword: 'Admin@123456', newPassword: 'Admin@654321',
  }, state.adminToken);
  assert('Change password', res.status === 200, `status=${res.status}`);

  // Login with new password
  res = await post('/auth/login', { email: 'admin@reactcampus.com', password: 'Admin@654321' });
  assert('Login with new password', res.status === 200);
  state.adminToken = res.body.data?.accessToken;
  state.adminRefreshToken = res.body.data?.refreshToken;

  // Update profile
  res = await patch('/auth/me', { firstName: 'SuperAdmin' }, state.adminToken);
  assert('Update profile', res.status === 200 && res.body.data?.firstName === 'SuperAdmin');

  // Logout
  res = await post('/auth/logout', { refreshToken: state.adminRefreshToken });
  assert('Logout', res.status === 200);

  // Re-login for remaining tests
  res = await post('/auth/login', { email: 'admin@reactcampus.com', password: 'Admin@654321' });
  state.adminToken = res.body.data?.accessToken;
  state.adminRefreshToken = res.body.data?.refreshToken;
}

// ─── 3. RBAC ─────────────────────────────────────────────────────────────────
async function testRBAC() {
  suite('RBAC');

  const limitedEmail = `limited-${RUN}@test.com`;
  const roleName = `devtest_viewer_${RUN}`;

  // List permissions
  let res = await get('/permissions', state.adminToken);
  assert('List permissions', res.status === 200 && res.body.data?.length >= 55,
    `count=${res.body.data?.length}`);

  // List roles
  res = await get('/roles', state.adminToken);
  assert('List roles', res.status === 200);
  const roles = res.body.data?.docs || res.body.data;
  assert('4 seeded roles exist', Array.isArray(roles) && roles.length >= 4, `count=${roles?.length}`);

  // Find system roles
  const superAdminRole = roles.find(r => r.name === 'super_admin');
  state.superAdminRoleId = superAdminRole?._id;
  assert('super_admin role found', !!state.superAdminRoleId);

  const counselorRole = roles.find(r => r.name === 'counselor');
  state.counselorRoleId = counselorRole?._id;

  // Get role by ID
  if (state.superAdminRoleId) {
    res = await get(`/roles/${state.superAdminRoleId}`, state.adminToken);
    assert('Get role by ID', res.status === 200 && res.body.data?.name === 'super_admin');
  }

  // Create custom role
  res = await post('/roles', {
    name: roleName, displayName: `DevTest Viewer ${RUN}`,
  }, state.adminToken);
  assert('Create custom role', res.status === 201, `status=${res.status}`);
  state.testRoleId = res.body.data?._id;

  // Update role
  if (state.testRoleId) {
    res = await patch(`/roles/${state.testRoleId}`, {
      displayName: `DevTest Viewer Updated ${RUN}`,
    }, state.adminToken);
    assert('Update role', res.status === 200, `status=${res.status}`);
  }

  // Assign permissions to custom role
  const permRes = await get('/permissions', state.adminToken);
  const readPerms = permRes.body.data?.filter(p => p.key === 'college:read' || p.key === 'course:read');
  const readPermIds = readPerms?.map(p => p._id) || [];

  if (readPermIds.length > 0 && state.testRoleId) {
    res = await patch(`/roles/${state.testRoleId}/permissions`, {
      permissions: readPermIds,
    }, state.adminToken);
    assert('Assign permissions to role', res.status === 200, `status=${res.status}`);
  }

  // Create limited user
  res = await post('/users', {
    firstName: 'Limited', lastName: `DT${RUN}`,
    email: limitedEmail, password: 'Limited@123',
  }, state.adminToken);
  assert('Create limited user', res.status === 201, `status=${res.status}`);
  state.limitedUserId = res.body.data?._id;
  state.limitedEmail = limitedEmail;

  // Assign role to limited user
  if (state.testRoleId && state.limitedUserId) {
    res = await patch(`/users/${state.limitedUserId}/roles`, {
      roles: [state.testRoleId],
    }, state.adminToken);
    assert('Assign role to user', res.status === 200, `status=${res.status}`);
  }

  // Login as limited user
  res = await post('/auth/login', { email: limitedEmail, password: 'Limited@123' });
  assert('Login as limited user', res.status === 200);
  state.limitedToken = res.body.data?.accessToken;

  // Limited user CAN read colleges (has college:read)
  res = await get('/colleges', state.limitedToken);
  assert('Limited user can read colleges', res.status === 200, `status=${res.status}`);

  // Limited user CANNOT create colleges
  res = await post('/colleges', { name: 'Test', type: 'public' }, state.limitedToken);
  assert('Limited user blocked from creating colleges', res.status === 403, `status=${res.status}`);

  // Limited user CANNOT manage users
  res = await get('/users', state.limitedToken);
  assert('Limited user blocked from listing users', res.status === 403, `status=${res.status}`);

  // Unauthenticated access denied
  res = await get('/users');
  assert('Unauthenticated access denied', res.status === 401, `status=${res.status}`);

  // Cannot delete system role
  if (state.superAdminRoleId) {
    res = await del(`/roles/${state.superAdminRoleId}`, state.adminToken);
    assert('Cannot delete system role', res.status === 400 || res.status === 403, `status=${res.status}`);
  }
}

// ─── 4. Users ────────────────────────────────────────────────────────────────
async function testUsers() {
  suite('Users');

  let res = await get('/users', state.adminToken);
  assert('List users', res.status === 200);
  const users = res.body.data?.docs || res.body.data;
  assert('Users list is array', Array.isArray(users));

  // Get by ID
  if (state.limitedUserId) {
    res = await get(`/users/${state.limitedUserId}`, state.adminToken);
    assert('Get user by ID', res.status === 200 && res.body.data?.email === state.limitedEmail);
  }

  // Update user
  if (state.limitedUserId) {
    res = await patch(`/users/${state.limitedUserId}`, { firstName: 'UpdatedLimited' }, state.adminToken);
    assert('Update user', res.status === 200, `status=${res.status}`);
  }

  // Deactivate
  if (state.limitedUserId) {
    res = await patch(`/users/${state.limitedUserId}/activate`, { isActive: false }, state.adminToken);
    assert('Deactivate user', res.status === 200, `status=${res.status}`);

    // Deactivated user cannot login
    res = await post('/auth/login', { email: state.limitedEmail, password: 'Limited@123' });
    assert('Deactivated user login rejected', res.status === 403, `status=${res.status}`);

    // Reactivate
    res = await patch(`/users/${state.limitedUserId}/activate`, { isActive: true }, state.adminToken);
    assert('Reactivate user', res.status === 200);
  }

  // Assign roles
  if (state.counselorRoleId && state.limitedUserId) {
    res = await patch(`/users/${state.limitedUserId}/roles`, {
      roles: [state.counselorRoleId],
    }, state.adminToken);
    assert('Assign roles to user', res.status === 200, `status=${res.status}`);
  }
}

// ─── 5. Categories ───────────────────────────────────────────────────────────
async function testCategories() {
  suite('Categories');

  const catName = `DevTest Engineering ${RUN}`;

  let res = await post('/categories', {
    name: catName, icon: 'gear', order: 99,
  }, state.adminToken);
  assert('Create category', res.status === 201, `status=${res.status}`);
  state.categoryId = res.body.data?._id;

  res = await get('/categories', state.adminToken);
  assert('List categories', res.status === 200);

  if (state.categoryId) {
    res = await get(`/categories/${state.categoryId}`, state.adminToken);
    assert('Get category by ID', res.status === 200 && res.body.data?.name === catName);

    res = await patch(`/categories/${state.categoryId}`, { name: `${catName} Updated` }, state.adminToken);
    assert('Update category', res.status === 200);
  }
}

// ─── 6. Colleges ─────────────────────────────────────────────────────────────
async function testColleges() {
  suite('Colleges');

  const collegeName = `DevTest IIT Delhi ${RUN}`;

  let res = await post('/colleges', {
    name: collegeName,
    type: 'public',
    description: 'Test institution for DevTest suite',
    location: { city: 'New Delhi', state: 'Delhi', pincode: '110016' },
    fees: { min: 100000, max: 300000 },
    established: 1961,
    website: 'https://iitd.ac.in',
  }, state.adminToken);
  assert('Create college', res.status === 201, `status=${res.status} ${JSON.stringify(res.body.message)}`);
  state.collegeId = res.body.data?._id;
  state.collegeSlug = res.body.data?.slug;
  assert('College has auto-slug', !!res.body.data?.slug);

  // Create second college
  res = await post('/colleges', {
    name: `DevTest IIT Bombay ${RUN}`, type: 'public',
    location: { city: 'Mumbai', state: 'Maharashtra' },
  }, state.adminToken);
  state.college2Id = res.body.data?._id;

  // List
  res = await get('/colleges', state.adminToken);
  assert('List colleges', res.status === 200);

  // Get by ID
  if (state.collegeId) {
    res = await get(`/colleges/${state.collegeId}`, state.adminToken);
    assert('Get college by ID', res.status === 200 && res.body.data?.name === collegeName);
  }

  // Update
  if (state.collegeId) {
    res = await patch(`/colleges/${state.collegeId}`, { ranking: 1 }, state.adminToken);
    assert('Update college', res.status === 200);
  }

  // Publish
  if (state.collegeId) {
    res = await patch(`/colleges/${state.collegeId}/publish`, { status: 'published' }, state.adminToken);
    assert('Publish college', res.status === 200, `status=${res.status}`);

    // Verify published status
    res = await get(`/colleges/${state.collegeId}`, state.adminToken);
    assert('College status is published', res.body.data?.status === 'published');
  }
}

// ─── 7. Courses ──────────────────────────────────────────────────────────────
async function testCourses() {
  suite('Courses');

  let res = await post('/courses', {
    name: `DevTest BTech CS ${RUN}`,
    level: 'undergraduate',
    duration: { value: 4, unit: 'years' },
    stream: 'Engineering',
    specializations: ['AI/ML', 'Data Science'],
    fees: { amount: 200000, per: 'year' },
  }, state.adminToken);
  assert('Create course', res.status === 201, `status=${res.status}`);
  state.courseId = res.body.data?._id;
  state.courseSlug = res.body.data?.slug;

  res = await post('/courses', {
    name: `DevTest MBA ${RUN}`, level: 'postgraduate',
    duration: { value: 2, unit: 'years' },
    stream: 'Management',
  }, state.adminToken);
  state.course2Id = res.body.data?._id;

  // List
  res = await get('/courses', state.adminToken);
  assert('List courses', res.status === 200);

  // Get by ID
  if (state.courseId) {
    res = await get(`/courses/${state.courseId}`, state.adminToken);
    assert('Get course by ID', res.status === 200, `status=${res.status}`);
  }

  // Update
  if (state.courseId) {
    res = await patch(`/courses/${state.courseId}`, { stream: 'Computer Science' }, state.adminToken);
    assert('Update course', res.status === 200, `status=${res.status}`);
  }

  // Add courses to college
  if (state.collegeId && state.courseId) {
    res = await patch(`/colleges/${state.collegeId}/courses`, {
      courses: [state.courseId, state.course2Id].filter(Boolean),
    }, state.adminToken);
    assert('Add courses to college', res.status === 200, `status=${res.status}`);
  }

  // Get colleges by course
  if (state.courseId) {
    res = await get(`/courses/${state.courseId}/colleges`, state.adminToken);
    assert('Get colleges by course', res.status === 200, `status=${res.status}`);
  }
}

// ─── 8. Exams ────────────────────────────────────────────────────────────────
async function testExams() {
  suite('Exams');

  let res = await post('/exams', {
    name: `DevTest JEE Advanced ${RUN}`,
    examType: 'national',
    conductedBy: 'IIT',
    pattern: { mode: 'online', totalMarks: 360 },
    eligibility: 'Class 12 pass',
  }, state.adminToken);
  assert('Create exam', res.status === 201, `status=${res.status}`);
  state.examId = res.body.data?._id;
  state.examSlug = res.body.data?.slug;

  // List
  res = await get('/exams', state.adminToken);
  assert('List exams', res.status === 200);

  // Get by ID
  if (state.examId) {
    res = await get(`/exams/${state.examId}`, state.adminToken);
    assert('Get exam by ID', res.status === 200, `status=${res.status}`);
  }

  // Update
  if (state.examId) {
    res = await patch(`/exams/${state.examId}`, { conductedBy: 'IIT System' }, state.adminToken);
    assert('Update exam', res.status === 200, `status=${res.status}`);
  }

  // Add exam to college
  if (state.collegeId && state.examId) {
    res = await patch(`/colleges/${state.collegeId}/exams`, {
      exams: [state.examId],
    }, state.adminToken);
    assert('Add exams to college', res.status === 200, `status=${res.status}`);
  }
}

// ─── 9. Content Sections ─────────────────────────────────────────────────────
async function testContentSections() {
  suite('Content Sections');
  if (!state.collegeId) { assert('Skipped — no college', false, 'no collegeId'); return; }

  let res = await post('/content-sections', {
    college: state.collegeId,
    sectionKey: 'about',
    title: `About DevTest College ${RUN}`,
    content: '<p>DevTest institution — premier engineering.</p>',
    contentType: 'richtext',
    order: 1,
  }, state.adminToken);
  assert('Create richtext section', res.status === 201, `status=${res.status}`);
  state.sectionId = res.body.data?._id;

  res = await post('/content-sections', {
    college: state.collegeId,
    sectionKey: 'faq',
    title: 'FAQs',
    content: [{ question: 'How to apply?', answer: 'Through JEE' }],
    contentType: 'faq',
    order: 2,
  }, state.adminToken);
  assert('Create FAQ section', res.status === 201, `status=${res.status}`);
  state.faqSectionId = res.body.data?._id;

  res = await get(`/content-sections?college=${state.collegeId}`, state.adminToken);
  assert('List sections by college', res.status === 200);

  if (state.sectionId) {
    res = await get(`/content-sections/${state.sectionId}`, state.adminToken);
    assert('Get section by ID', res.status === 200, `status=${res.status}`);

    res = await patch(`/content-sections/${state.sectionId}`, {
      title: `About DevTest College ${RUN} (Updated)`,
    }, state.adminToken);
    assert('Update section', res.status === 200, `status=${res.status}`);
  }
}

// ─── 10. Forms ───────────────────────────────────────────────────────────────
async function testForms() {
  suite('Forms');

  let res = await post('/forms', {
    title: `DevTest Get Info ${RUN}`,
    purpose: 'lead_capture',
    description: 'DevTest form for lead capture',
    fields: [
      { type: 'text', label: 'Full Name', name: 'fullName', validation: { required: true, minLength: 2 }, order: 1, leadFieldMapping: 'name' },
      { type: 'email', label: 'Email', name: 'email', validation: { required: true }, order: 2, leadFieldMapping: 'email' },
      { type: 'phone', label: 'Phone', name: 'phone', validation: { required: true, pattern: '^[0-9]{10}$', customMessage: 'Enter 10-digit number' }, order: 3, leadFieldMapping: 'phone' },
      { type: 'dropdown', label: 'Interested In', name: 'interest', options: [{ label: 'B.Tech', value: 'btech' }, { label: 'MBA', value: 'mba' }], order: 4 },
      { type: 'textarea', label: 'Message', name: 'message', validation: { maxLength: 500 }, order: 5, leadFieldMapping: 'message' },
    ],
    successMessage: 'Thank you! We will contact you soon.',
  }, state.adminToken);
  assert('Create lead capture form', res.status === 201, `status=${res.status}`);
  state.formId = res.body.data?._id;
  state.formSlug = res.body.data?.slug;

  // List forms
  res = await get('/forms', state.adminToken);
  assert('List forms', res.status === 200);

  // Get by ID
  if (state.formId) {
    res = await get(`/forms/${state.formId}`, state.adminToken);
    assert('Get form by ID', res.status === 200);

    res = await patch(`/forms/${state.formId}`, {
      description: 'Updated DevTest form description',
    }, state.adminToken);
    assert('Update form', res.status === 200, `status=${res.status}`);
  }

  // Publish form
  if (state.formId) {
    res = await patch(`/forms/${state.formId}/publish`, { isPublished: true }, state.adminToken);
    assert('Publish form', res.status === 200, `status=${res.status}`);
  }

  // Assign form to college page
  if (state.collegeId && state.formId) {
    res = await patch(`/forms/${state.formId}/pages`, {
      assignedPages: [{ pageType: 'college', entityId: state.collegeId }],
    }, state.adminToken);
    assert('Assign form to pages', res.status === 200, `status=${res.status}`);
  }
}

// ─── 11. Submissions ─────────────────────────────────────────────────────────
async function testSubmissions() {
  suite('Submissions');
  if (!state.formSlug) { assert('Skipped — no form', false, 'no formSlug'); return; }

  // Valid public submission
  let res = await post(`/public/forms/${state.formSlug}/submit`, {
    data: {
      fullName: `Rahul DT${RUN}`,
      email: `rahul-${RUN}@example.com`,
      phone: '9876543210',
      interest: 'btech',
      message: 'Interested in B.Tech CSE',
    },
  });
  assert('Submit form (public, valid)', res.status === 201, `status=${res.status} ${JSON.stringify(res.body.message)}`);
  state.submissionId = res.body.data?._id;
  state.rahulEmail = `rahul-${RUN}@example.com`;

  // Validation errors
  res = await post(`/public/forms/${state.formSlug}/submit`, {
    data: {
      fullName: '',
      email: 'not-an-email',
      phone: '123',
      interest: 'invalid_option',
    },
  });
  assert('Form validation catches errors', res.status === 422, `status=${res.status}`);
  assert('Validation returns field errors', Array.isArray(res.body.errors) && res.body.errors.length >= 3,
    `errors=${JSON.stringify(res.body.errors)}`);

  // Second valid submission
  res = await post(`/public/forms/${state.formSlug}/submit`, {
    data: {
      fullName: `Priya DT${RUN}`,
      email: `priya-${RUN}@example.com`,
      phone: '9876500000',
      interest: 'mba',
    },
  });
  assert('Second submission works', res.status === 201);
  state.priyaEmail = `priya-${RUN}@example.com`;

  // Third submission for bulk action tests
  res = await post(`/public/forms/${state.formSlug}/submit`, {
    data: {
      fullName: `Amit DT${RUN}`,
      email: `amit-${RUN}@example.com`,
      phone: '9876511111',
      interest: 'btech',
    },
  });
  assert('Third submission works', res.status === 201);
  state.amitEmail = `amit-${RUN}@example.com`;

  // List submissions (admin)
  res = await get(`/submissions?form=${state.formId}`, state.adminToken);
  assert('List submissions (admin)', res.status === 200);
  const subs = res.body.data?.docs || res.body.data;
  assert('At least 3 submissions exist', Array.isArray(subs) && subs.length >= 3, `count=${subs?.length}`);

  // Get submission by ID
  if (state.submissionId) {
    res = await get(`/submissions/${state.submissionId}`, state.adminToken);
    assert('Get submission by ID', res.status === 200, `status=${res.status}`);
  }
}

// ─── 12. Leads ───────────────────────────────────────────────────────────────
async function testLeads() {
  suite('Leads');

  // Leads auto-created from form submissions
  let res = await get('/leads', state.adminToken);
  assert('Leads auto-created from form', res.status === 200);
  let leads = res.body.data?.docs || res.body.data;
  assert('At least 3 leads exist', Array.isArray(leads) && leads.length >= 3, `count=${leads?.length}`);

  // Find our test leads by unique emails
  const rahulLead = leads?.find(l => l.email === state.rahulEmail);
  assert('Lead field mapping — name', rahulLead?.name === `Rahul DT${RUN}`);
  assert('Lead field mapping — phone', rahulLead?.phone === '9876543210');
  state.leadId = rahulLead?._id;

  const priyaLead = leads?.find(l => l.email === state.priyaEmail);
  state.lead2Id = priyaLead?._id;

  const amitLead = leads?.find(l => l.email === state.amitEmail);
  state.lead3Id = amitLead?._id;

  // Get lead by ID
  if (state.leadId) {
    res = await get(`/leads/${state.leadId}`, state.adminToken);
    assert('Get lead by ID', res.status === 200 && res.body.data?.email === state.rahulEmail);
  }

  // Create lead directly
  res = await post('/leads', {
    name: `Direct DT${RUN}`,
    email: `direct-${RUN}@example.com`,
    phone: '9999999999',
    priority: 'high',
  }, state.adminToken);
  assert('Create lead directly', res.status === 201, `status=${res.status}`);
  state.directLeadId = res.body.data?._id;

  // Update lead
  if (state.leadId) {
    res = await patch(`/leads/${state.leadId}`, { priority: 'high' }, state.adminToken);
    assert('Update lead (priority)', res.status === 200, `status=${res.status}`);
  }

  // Change status
  if (state.leadId) {
    res = await patch(`/leads/${state.leadId}/status`, {
      status: 'contacted', note: 'Called the student',
    }, state.adminToken);
    assert('Change lead status', res.status === 200, `status=${res.status}`);

    res = await get(`/leads/${state.leadId}`, state.adminToken);
    assert('Lead status updated', res.body.data?.status === 'contacted');
    assert('Status history recorded', res.body.data?.statusHistory?.length >= 1);
  }

  // Assign lead
  if (state.leadId) {
    res = await patch(`/leads/${state.leadId}/assign`, {
      assignedTo: state.adminId,
    }, state.adminToken);
    assert('Assign lead', res.status === 200, `status=${res.status}`);
  }

  // Add note
  if (state.leadId) {
    res = await post(`/leads/${state.leadId}/notes`, {
      content: `DevTest ${RUN}: Student very interested in B.Tech CSE`,
    }, state.adminToken);
    assert('Add note to lead', res.status === 200, `status=${res.status}`);

    res = await get(`/leads/${state.leadId}`, state.adminToken);
    assert('Note recorded', res.body.data?.notes?.length >= 1);
  }

  // ── Filters ──
  res = await get('/leads?status=contacted', state.adminToken);
  assert('Filter leads by status', res.status === 200, `status=${res.status}`);

  res = await get('/leads?priority=high', state.adminToken);
  assert('Filter leads by priority', res.status === 200, `status=${res.status}`);
  const highLeads = res.body.data?.docs || res.body.data;
  assert('Priority filter returns results', Array.isArray(highLeads) && highLeads.length >= 1, `count=${highLeads?.length}`);

  if (state.adminId) {
    res = await get(`/leads?assignedTo=${state.adminId}`, state.adminToken);
    assert('Filter leads by assignedTo', res.status === 200, `status=${res.status}`);
  }

  const today = new Date().toISOString().split('T')[0];
  res = await get(`/leads?dateFrom=${today}`, state.adminToken);
  assert('Filter leads by dateFrom', res.status === 200, `status=${res.status}`);

  res = await get(`/leads?dateTo=${today}T23:59:59`, state.adminToken);
  assert('Filter leads by dateTo', res.status === 200, `status=${res.status}`);

  // ── Stats ──
  res = await get('/leads/stats', state.adminToken);
  assert('Lead stats endpoint', res.status === 200 && res.body.data);
  assert('Stats has byStatus', typeof res.body.data?.byStatus === 'object');
  assert('Stats has byPriority', typeof res.body.data?.byPriority === 'object');
  assert('Stats has newToday', typeof res.body.data?.newToday === 'number');
  assert('Stats has newThisWeek', typeof res.body.data?.newThisWeek === 'number');

  // ── CSV Export ──
  res = await get('/leads/export', state.adminToken);
  assert('Lead export returns 200', res.status === 200, `status=${res.status}`);
  assert('Export Content-Type is text/csv', (res.headers['content-type'] || '').includes('text/csv'),
    `content-type=${res.headers['content-type']}`);
  assert('Export body is string (CSV)', typeof res.body === 'string', `type=${typeof res.body}`);
  assert('CSV has header row', typeof res.body === 'string' && res.body.startsWith('Name,Email'),
    `starts=${typeof res.body === 'string' ? res.body.substring(0, 30) : 'N/A'}`);

  // ── Bulk Actions ──
  const bulkIds = [state.lead2Id, state.lead3Id].filter(Boolean);
  if (bulkIds.length >= 2) {
    // Bulk changeStatus
    res = await post('/leads/bulk', {
      ids: bulkIds,
      action: 'changeStatus',
      value: 'qualified',
    }, state.adminToken);
    assert('Bulk changeStatus', res.status === 200, `status=${res.status}`);
    assert('Bulk changeStatus count', res.body.data?.count === bulkIds.length,
      `count=${res.body.data?.count}`);

    // Verify status actually changed
    res = await get(`/leads/${state.lead2Id}`, state.adminToken);
    assert('Bulk status verified on lead', res.body.data?.status === 'qualified');
    assert('Bulk status history entry', res.body.data?.statusHistory?.some(h => h.note === 'Bulk status change'));

    // Bulk assign
    res = await post('/leads/bulk', {
      ids: bulkIds,
      action: 'assign',
      value: state.adminId,
    }, state.adminToken);
    assert('Bulk assign', res.status === 200, `status=${res.status}`);
    assert('Bulk assign count', res.body.data?.count === bulkIds.length,
      `count=${res.body.data?.count}`);

    // Verify assign
    res = await get(`/leads/${state.lead2Id}`, state.adminToken);
    assert('Bulk assign verified', res.body.data?.assignedTo?._id === state.adminId ||
      res.body.data?.assignedTo === state.adminId);

    // Bulk delete
    res = await post('/leads/bulk', {
      ids: bulkIds,
      action: 'delete',
    }, state.adminToken);
    assert('Bulk delete', res.status === 200, `status=${res.status}`);
    assert('Bulk delete count', res.body.data?.count === bulkIds.length,
      `count=${res.body.data?.count}`);
  } else {
    assert('Bulk actions (skipped — not enough leads)', false, 'need 2+ lead IDs');
  }
}

// ─── 13. Reviews ─────────────────────────────────────────────────────────────
async function testReviews() {
  suite('Reviews');

  let res = await post('/public/reviews', {
    college: state.collegeId,
    rating: 4,
    title: `DevTest Great College ${RUN}`,
    content: `DevTest ${RUN}: Excellent faculty and infrastructure`,
    authorName: `Reviewer${RUN}`,
    authorEmail: `reviewer-${RUN}@test.com`,
    aspects: { academics: 5, faculty: 4, infrastructure: 4, placement: 3, campus: 5 },
  });
  assert('Submit review (public)', res.status === 201, `status=${res.status}`);
  state.reviewId = res.body.data?._id;

  // List (admin)
  res = await get('/reviews', state.adminToken);
  assert('List reviews (admin)', res.status === 200);

  // Review is pending
  if (state.reviewId) {
    res = await get(`/reviews/${state.reviewId}`, state.adminToken);
    assert('Review is pending by default', res.body.data?.status === 'pending');

    // Moderate — approve
    res = await patch(`/reviews/${state.reviewId}/moderate`, { status: 'approved' }, state.adminToken);
    assert('Moderate review (approve)', res.status === 200, `status=${res.status}`);
  }

  // Submit and reject spam
  res = await post('/public/reviews', {
    college: state.collegeId, rating: 1,
    content: `DevTest Spam ${RUN}`,
    authorName: `Bot${RUN}`,
  });
  state.spamReviewId = res.body.data?._id;
  if (state.spamReviewId) {
    res = await patch(`/reviews/${state.spamReviewId}/moderate`, { status: 'rejected' }, state.adminToken);
    assert('Moderate review (reject)', res.status === 200);
  }
}

// ─── 14. Discussions ─────────────────────────────────────────────────────────
async function testDiscussions() {
  suite('Discussions');

  let res = await post('/public/discussions', {
    college: state.collegeId,
    content: `DevTest ${RUN}: What is the admission process for B.Tech?`,
    authorName: `Student${RUN}`,
    authorEmail: `student-${RUN}@test.com`,
  });
  assert('Submit discussion (public)', res.status === 201, `status=${res.status}`);
  state.discussionId = res.body.data?._id;

  // List (admin)
  res = await get('/discussions', state.adminToken);
  assert('List discussions (admin)', res.status === 200);

  // Get by ID
  if (state.discussionId) {
    res = await get(`/discussions/${state.discussionId}`, state.adminToken);
    assert('Get discussion by ID', res.status === 200);

    // Moderate — approve
    res = await patch(`/discussions/${state.discussionId}/moderate`, { status: 'approved' }, state.adminToken);
    assert('Moderate discussion (approve)', res.status === 200, `status=${res.status}`);
  }
}

// ─── 15. SEO ─────────────────────────────────────────────────────────────────
async function testSEO() {
  suite('SEO');

  if (!state.collegeId) { assert('Skipped — no college', false, 'no collegeId'); return; }

  let res = await post('/seo', {
    targetType: 'college',
    targetId: state.collegeId,
    metaTitle: `DevTest IIT Delhi ${RUN} - Best`,
    metaDescription: 'Explore DevTest IIT Delhi courses, placements, fees',
    metaKeywords: ['IIT Delhi', 'engineering', 'B.Tech'],
    ogTitle: `DevTest IIT Delhi ${RUN}`,
    ogDescription: 'Premier engineering institution',
  }, state.adminToken);
  assert('Create SEO entry', res.status === 201, `status=${res.status}`);
  state.seoId = res.body.data?._id;

  res = await get('/seo', state.adminToken);
  assert('List SEO entries', res.status === 200);

  if (state.seoId) {
    res = await get(`/seo/${state.seoId}`, state.adminToken);
    assert('Get SEO by ID', res.status === 200, `status=${res.status}`);

    res = await patch(`/seo/${state.seoId}`, { metaTitle: `Updated Title ${RUN}` }, state.adminToken);
    assert('Update SEO', res.status === 200, `status=${res.status}`);
  }
}

// ─── 16. Pages ───────────────────────────────────────────────────────────────
async function testPages() {
  suite('Pages');

  let res = await post('/pages', {
    title: `DevTest Admission Guide ${RUN}`,
    description: 'A guide to admissions',
    contentBlocks: [
      { title: 'Overview', contentType: 'richtext', content: '<p>DevTest content</p>', order: 1 },
    ],
  }, state.adminToken);
  assert('Create page', res.status === 201, `status=${res.status}`);
  state.pageId = res.body.data?._id;
  state.pageSlug = res.body.data?.slug;

  res = await get('/pages', state.adminToken);
  assert('List pages', res.status === 200);

  if (state.pageId) {
    res = await get(`/pages/${state.pageId}`, state.adminToken);
    assert('Get page by ID', res.status === 200, `status=${res.status}`);

    res = await patch(`/pages/${state.pageId}`, { description: 'Updated guide' }, state.adminToken);
    assert('Update page', res.status === 200, `status=${res.status}`);

    res = await patch(`/pages/${state.pageId}/publish`, { status: 'published' }, state.adminToken);
    assert('Publish page', res.status === 200, `status=${res.status}`);
  }
}

// ─── 17. Dashboard ───────────────────────────────────────────────────────────
async function testDashboard() {
  suite('Dashboard');

  let res = await get('/dashboard/stats', state.adminToken);
  assert('Dashboard stats', res.status === 200 && res.body.data);
  assert('Stats has totalColleges', typeof res.body.data?.totalColleges === 'number');
  assert('Stats has totalLeads', typeof res.body.data?.totalLeads === 'number');

  res = await get('/dashboard/pipeline', state.adminToken);
  assert('Lead pipeline', res.status === 200 && Array.isArray(res.body.data));

  res = await get('/dashboard/activity', state.adminToken);
  assert('Recent activity', res.status === 200 && Array.isArray(res.body.data));
  assert('Audit logs populated', res.body.data.length > 0);
}

// ─── 18. Site Settings ───────────────────────────────────────────────────────
async function testSiteSettings() {
  suite('Site Settings');

  let res = await get('/site-settings', state.adminToken);
  assert('Get site settings', res.status === 200, `status=${res.status}`);

  res = await patch('/site-settings', {
    hero: { title: `DevTest Campus ${RUN}`, titleHighlight: 'DevTest' },
  }, state.adminToken);
  assert('Update site settings', res.status === 200, `status=${res.status}`);
}

// ─── 19. Public Routes ───────────────────────────────────────────────────────
async function testPublicRoutes() {
  suite('Public Routes');

  // ── Colleges ──
  let res = await get('/public/colleges');
  assert('Public: list colleges', res.status === 200);
  const colleges = res.body.data;
  assert('Public: only published colleges',
    !colleges || colleges.length === 0 || colleges.every(c => c.status === 'published'),
    `count=${colleges?.length}`);

  if (state.collegeSlug) {
    res = await get(`/public/colleges/${state.collegeSlug}`);
    assert('Public: college by slug', res.status === 200, `status=${res.status}`);
    assert('Public: college has courses populated', Array.isArray(res.body.data?.courses));
    assert('Public: college has exams populated', Array.isArray(res.body.data?.exams));

    res = await get(`/public/colleges/${state.collegeSlug}/reviews`);
    assert('Public: college reviews', res.status === 200);
    const reviews = res.body.data;
    assert('Public: only approved reviews', !reviews || reviews.length === 0 || reviews.every(r => r.status === 'approved'));

    res = await get(`/public/colleges/${state.collegeSlug}/sections`);
    assert('Public: college sections', res.status === 200);

    res = await get(`/public/colleges/${state.collegeSlug}/discussions`);
    assert('Public: college discussions', res.status === 200);
  }

  // ── Courses ──
  res = await get('/public/courses');
  assert('Public: list courses', res.status === 200);

  if (state.courseSlug) {
    res = await get(`/public/courses/${state.courseSlug}`);
    assert('Public: course by slug', res.status === 200, `status=${res.status}`);

    res = await get(`/public/courses/${state.courseSlug}/colleges`);
    assert('Public: colleges for course', res.status === 200, `status=${res.status}`);

    res = await get(`/public/courses/${state.courseSlug}/sections`);
    assert('Public: course sections', res.status === 200, `status=${res.status}`);

    res = await get(`/public/courses/${state.courseSlug}/discussions`);
    assert('Public: course discussions', res.status === 200, `status=${res.status}`);
  }

  // ── Exams ──
  res = await get('/public/exams');
  assert('Public: list exams', res.status === 200);

  if (state.examSlug) {
    res = await get(`/public/exams/${state.examSlug}`);
    assert('Public: exam by slug', res.status === 200, `status=${res.status}`);

    res = await get(`/public/exams/${state.examSlug}/sections`);
    assert('Public: exam sections', res.status === 200, `status=${res.status}`);

    res = await get(`/public/exams/${state.examSlug}/discussions`);
    assert('Public: exam discussions', res.status === 200, `status=${res.status}`);
  }

  // ── Forms ──
  if (state.formSlug) {
    res = await get(`/public/forms/${state.formSlug}`);
    assert('Public: get form schema', res.status === 200);
    assert('Public: form has fields', Array.isArray(res.body.data?.fields) && res.body.data.fields.length > 0);
    assert('Public: form has successMessage', !!res.body.data?.successMessage);
  }

  if (state.collegeId) {
    res = await get(`/public/forms/for-page?pageType=college&entityId=${state.collegeId}`);
    assert('Public: forms for page', res.status === 200, `status=${res.status}`);
  }

  // ── Pages ──
  res = await get('/public/pages');
  assert('Public: list pages', res.status === 200);

  if (state.pageSlug) {
    res = await get(`/public/pages/${state.pageSlug}`);
    assert('Public: page by slug', res.status === 200, `status=${res.status}`);
  }

  // ── SEO ──
  if (state.collegeId) {
    res = await get(`/public/seo/college/${state.collegeId}`);
    assert('Public: SEO data', res.status === 200, `status=${res.status}`);
  }

  // ── Site Settings ──
  res = await get('/public/site-settings');
  assert('Public: site settings', res.status === 200, `status=${res.status}`);

  // ── Contact Form ──
  res = await post('/public/contact', {
    name: `DevTest Contact ${RUN}`,
    email: `contact-${RUN}@example.com`,
    message: 'DevTest contact form submission',
  });
  assert('Public: contact form', res.status === 201, `status=${res.status}`);

  // ── Categories ──
  res = await get('/public/categories');
  assert('Public: list categories', res.status === 200, `status=${res.status}`);

  // ── 404 ──
  res = await get('/public/colleges/nonexistent-slug-devtest-xyz');
  assert('Public: 404 for non-existent college', res.status === 404);
}

// ─── 20. Edge Cases ──────────────────────────────────────────────────────────
async function testEdgeCases() {
  suite('Edge Cases');

  // 404 invalid route
  let res = await get('/nonexistent-route');
  assert('404 on invalid route', res.status === 404);

  // Invalid ObjectId
  res = await get('/colleges/invalid-id', state.adminToken);
  assert('Invalid ObjectId handled', res.status === 400 || res.status === 404, `status=${res.status}`);

  // No token on protected route
  res = await post('/colleges', { name: 'Test', type: 'public' });
  assert('Protected route requires auth', res.status === 401);

  // Invalid token
  res = await get('/auth/me', 'totally.invalid.token');
  assert('Invalid token rejected', res.status === 401, `status=${res.status}`);

  // Expired/malformed JWT
  res = await get('/users', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsImlhdCI6MTAwMDAwMDAwMCwiZXhwIjoxMDAwMDAwMDAxfQ.invalid');
  assert('Expired/malformed token rejected', res.status === 401, `status=${res.status}`);

  // Duplicate college name — allowed (slug auto-unique)
  if (state.collegeId) {
    res = await post('/colleges', {
      name: `DevTest IIT Delhi ${RUN}`, type: 'public',
    }, state.adminToken);
    assert('Duplicate college name creates with unique slug', res.status === 201, `status=${res.status}`);
    state.duplicateCollegeId = res.body.data?._id;
  }

  // Non-existent ID on GET
  res = await get('/colleges/000000000000000000000000', state.adminToken);
  assert('Non-existent ObjectId returns 404', res.status === 404, `status=${res.status}`);
}

// ─── 21. Cleanup ─────────────────────────────────────────────────────────────
async function testCleanup() {
  suite('Cleanup');

  // Delete SEO
  if (state.seoId) {
    let res = await del(`/seo/${state.seoId}`, state.adminToken);
    assert('Delete SEO entry', res.status === 200, `status=${res.status}`);
  }

  // Delete content sections
  if (state.sectionId) {
    let res = await del(`/content-sections/${state.sectionId}`, state.adminToken);
    assert('Delete richtext section', res.status === 200, `status=${res.status}`);
  }
  if (state.faqSectionId) {
    let res = await del(`/content-sections/${state.faqSectionId}`, state.adminToken);
    assert('Delete FAQ section', res.status === 200, `status=${res.status}`);
  }

  // Delete discussion
  if (state.discussionId) {
    let res = await del(`/discussions/${state.discussionId}`, state.adminToken);
    assert('Delete discussion', res.status === 200, `status=${res.status}`);
  }

  // Delete reviews
  if (state.reviewId) {
    let res = await del(`/reviews/${state.reviewId}`, state.adminToken);
    assert('Delete approved review', res.status === 200, `status=${res.status}`);
  }
  if (state.spamReviewId) {
    let res = await del(`/reviews/${state.spamReviewId}`, state.adminToken);
    assert('Delete rejected review', res.status === 200, `status=${res.status}`);
  }

  // Delete leads
  if (state.leadId) {
    let res = await del(`/leads/${state.leadId}`, state.adminToken);
    assert('Delete lead', res.status === 200, `status=${res.status}`);
  }
  if (state.directLeadId) {
    let res = await del(`/leads/${state.directLeadId}`, state.adminToken);
    assert('Delete direct lead', res.status === 200, `status=${res.status}`);
  }

  // Delete form
  if (state.formId) {
    let res = await del(`/forms/${state.formId}`, state.adminToken);
    assert('Delete form', res.status === 200, `status=${res.status}`);
  }

  // Delete page
  if (state.pageId) {
    let res = await del(`/pages/${state.pageId}`, state.adminToken);
    assert('Delete page', res.status === 200, `status=${res.status}`);
  }

  // Delete exams
  if (state.examId) {
    let res = await del(`/exams/${state.examId}`, state.adminToken);
    assert('Delete exam', res.status === 200, `status=${res.status}`);
  }

  // Delete courses
  if (state.courseId) {
    let res = await del(`/courses/${state.courseId}`, state.adminToken);
    assert('Delete course', res.status === 200, `status=${res.status}`);
  }
  if (state.course2Id) {
    let res = await del(`/courses/${state.course2Id}`, state.adminToken);
    assert('Delete second course', res.status === 200, `status=${res.status}`);
  }

  // Delete colleges
  if (state.collegeId) {
    let res = await del(`/colleges/${state.collegeId}`, state.adminToken);
    assert('Delete college', res.status === 200, `status=${res.status}`);
  }
  if (state.college2Id) {
    let res = await del(`/colleges/${state.college2Id}`, state.adminToken);
    assert('Delete second college', res.status === 200, `status=${res.status}`);
  }
  if (state.duplicateCollegeId) {
    let res = await del(`/colleges/${state.duplicateCollegeId}`, state.adminToken);
    assert('Delete duplicate college', res.status === 200, `status=${res.status}`);
  }

  // Delete category
  if (state.categoryId) {
    let res = await del(`/categories/${state.categoryId}`, state.adminToken);
    assert('Delete category', res.status === 200, `status=${res.status}`);
  }

  // Delete limited user
  if (state.limitedUserId) {
    let res = await del(`/users/${state.limitedUserId}`, state.adminToken);
    assert('Delete limited user', res.status === 200, `status=${res.status}`);
  }

  // Delete registered test user
  if (state.testUserEmail) {
    let res = await get(`/users?search=${state.testUserEmail}`, state.adminToken);
    const users = res.body.data?.docs || res.body.data;
    const devTestUser = Array.isArray(users) ? users.find(u => u.email === state.testUserEmail) : null;
    if (devTestUser) {
      res = await del(`/users/${devTestUser._id}`, state.adminToken);
      assert('Delete registered test user', res.status === 200, `status=${res.status}`);
    }
  }

  // Delete custom role
  if (state.testRoleId) {
    let res = await del(`/roles/${state.testRoleId}`, state.adminToken);
    assert('Delete custom role', res.status === 200, `status=${res.status}`);
  }

  // Reset admin password back to original
  let res = await post('/auth/change-password', {
    currentPassword: 'Admin@654321', newPassword: 'Admin@123456',
  }, state.adminToken);
  assert('Reset admin password to original', res.status === 200, `status=${res.status}`);
}

// ─── Report Generation ───────────────────────────────────────────────────────
function generateReport() {
  const reportPath = path.join(__dirname, 'test-report.txt');
  const lines = [];
  const timestamp = new Date().toISOString();

  lines.push('═══════════════════════════════════════════════════════════════');
  lines.push('  ReactCampus API Test Report');
  lines.push(`  Generated: ${timestamp}`);
  lines.push(`  Run ID: ${RUN}`);
  lines.push('═══════════════════════════════════════════════════════════════');
  lines.push('');

  lines.push('┌─────────────────────────────┬────────┬────────┬────────┐');
  lines.push('│ Suite                       │ Passed │ Failed │ Total  │');
  lines.push('├─────────────────────────────┼────────┼────────┼────────┤');

  // Console summary
  console.log('');
  console.log(`${C.bold}${'═'.repeat(65)}${C.reset}`);
  console.log(`${C.bold}  Summary by Suite${C.reset}  ${C.dim}(run: ${RUN})${C.reset}`);
  console.log(`${'═'.repeat(65)}`);
  console.log(`  ${'Suite'.padEnd(28)} ${'Pass'.padStart(6)} ${'Fail'.padStart(6)} ${'Total'.padStart(6)}`);
  console.log(`  ${'─'.repeat(50)}`);

  for (const s of suites) {
    const total = s.passed + s.failed;
    const icon = s.failed === 0 ? `${C.green}✓${C.reset}` : `${C.red}✗${C.reset}`;
    console.log(`  ${icon} ${s.name.padEnd(26)} ${String(s.passed).padStart(6)} ${String(s.failed).padStart(6)} ${String(total).padStart(6)}`);

    const status = s.failed === 0 ? 'PASS' : 'FAIL';
    lines.push(`│ ${(status + ' ' + s.name).padEnd(27)} │ ${String(s.passed).padStart(6)} │ ${String(s.failed).padStart(6)} │ ${String(total).padStart(6)} │`);
  }

  lines.push('├─────────────────────────────┼────────┼────────┼────────┤');
  lines.push(`│ ${'TOTAL'.padEnd(27)} │ ${String(totalPassed).padStart(6)} │ ${String(totalFailed).padStart(6)} │ ${String(totalTests).padStart(6)} │`);
  lines.push('└─────────────────────────────┴────────┴────────┴────────┘');

  console.log(`  ${'─'.repeat(50)}`);
  const totalColor = totalFailed === 0 ? C.green : C.red;
  console.log(`  ${totalColor}${'TOTAL'.padEnd(28)} ${String(totalPassed).padStart(6)} ${String(totalFailed).padStart(6)} ${String(totalTests).padStart(6)}${C.reset}`);
  console.log(`${'═'.repeat(65)}`);

  // Detailed results
  lines.push('');
  lines.push('');
  lines.push('DETAILED RESULTS');
  lines.push('─────────────────────────────────────────────────────────────────');

  for (const s of suites) {
    lines.push('');
    lines.push(`── ${s.name} ──`);
    for (const r of s.results) {
      const mark = r.ok ? '✓' : '✗';
      const detail = r.detail ? ` — ${r.detail}` : '';
      lines.push(`  ${mark} ${r.name}${detail}`);
    }
  }

  // Failed tests summary
  const allFailed = [];
  for (const s of suites) {
    for (const r of s.results) {
      if (!r.ok) allFailed.push({ suite: s.name, ...r });
    }
  }

  if (allFailed.length > 0) {
    lines.push('');
    lines.push('');
    lines.push('FAILED TESTS');
    lines.push('─────────────────────────────────────────────────────────────────');
    for (const f of allFailed) {
      const detail = f.detail ? ` — ${f.detail}` : '';
      lines.push(`  ✗ [${f.suite}] ${f.name}${detail}`);
    }
  }

  lines.push('');
  lines.push(`Result: ${totalPassed}/${totalTests} passed, ${totalFailed} failed`);
  lines.push(`Status: ${totalFailed === 0 ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);

  fs.writeFileSync(reportPath, lines.join('\n'), 'utf-8');
  console.log(`\n${C.dim}Report written to ${reportPath}${C.reset}`);
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`${C.bold}${C.cyan}ReactCampus API Test Suite${C.reset}`);
  console.log(`${C.dim}Target: http://${HOST}:${PORT}${BASE_PATH}${C.reset}`);
  console.log(`${C.dim}Run ID: ${RUN}  •  Time: ${new Date().toISOString()}${C.reset}`);

  try {
    await testHealthCheck();
    await testAuth();
    await testRBAC();
    await testUsers();
    await testCategories();
    await testColleges();
    await testCourses();
    await testExams();
    await testContentSections();
    await testForms();
    await testSubmissions();
    await testLeads();
    await testReviews();
    await testDiscussions();
    await testSEO();
    await testPages();
    await testDashboard();
    await testSiteSettings();
    await testPublicRoutes();
    await testEdgeCases();
    await testCleanup();
  } catch (err) {
    console.error(`\n${C.red}FATAL ERROR:${C.reset}`, err.message || err);
    if (err.code === 'ECONNREFUSED') {
      console.error(`${C.yellow}Is the server running on port ${PORT}?${C.reset}`);
    }
  }

  generateReport();

  const exitCode = totalFailed > 0 ? 1 : 0;
  console.log(`\n${totalFailed === 0 ? C.green : C.red}${totalPassed}/${totalTests} passed, ${totalFailed} failed${C.reset}`);
  process.exit(exitCode);
}

main();
