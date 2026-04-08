/**
 * Comprehensive API test script for ReactCampus backend.
 * Tests: Auth, RBAC, CRUD for all resources, Form Engine, Lead pipeline, Public routes.
 */
const http = require('http');

const BASE = 'http://localhost:5050/api/v1';
let passed = 0, failed = 0, total = 0;

// State stored across tests
const state = {};

// ─── HTTP helper ──────────────────────────────────────────────────────────────
function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const fullPath = '/api/v1' + path;
    const opts = {
      hostname: 'localhost',
      port: 5050,
      path: fullPath,
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (token) opts.headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

const get = (p, t) => request('GET', p, null, t);
const post = (p, b, t) => request('POST', p, b, t);
const patch = (p, b, t) => request('PATCH', p, b, t);
const del = (p, t) => request('DELETE', p, null, t);

// ─── Test helper ──────────────────────────────────────────────────────────────
function assert(name, condition, detail) {
  total++;
  if (condition) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.log(`  ✗ ${name}` + (detail ? ` — ${detail}` : ''));
  }
}

// ─── Test suites ──────────────────────────────────────────────────────────────
async function testAuth() {
  console.log('\n── AUTH ──');

  // Register
  let res = await post('/auth/register', {
    firstName: 'Test', lastName: 'User',
    email: 'test@example.com', password: 'Test@12345',
  });
  assert('Register new user', res.status === 201, `status=${res.status}`);
  assert('Register returns tokens', !!res.body.data?.accessToken && !!res.body.data?.refreshToken);
  state.testUserToken = res.body.data?.accessToken;
  state.testRefreshToken = res.body.data?.refreshToken;

  // Duplicate register
  res = await post('/auth/register', {
    firstName: 'Test', lastName: 'User',
    email: 'test@example.com', password: 'Test@12345',
  });
  assert('Duplicate register rejected', res.status === 409, `status=${res.status}`);

  // Login as admin
  res = await post('/auth/login', {
    email: 'admin@reactcampus.com', password: 'Admin@123456',
  });
  assert('Admin login', res.status === 200, `status=${res.status}`);
  assert('Login returns tokens', !!res.body.data?.accessToken);
  state.adminToken = res.body.data?.accessToken;
  state.adminRefreshToken = res.body.data?.refreshToken;
  state.adminId = res.body.data?.user?.id;

  // Me endpoint
  res = await get('/auth/me', state.adminToken);
  assert('GET /auth/me', res.status === 200 && res.body.data?.user?.email === 'admin@reactcampus.com');
  assert('Me returns permissions', Array.isArray(res.body.data?.permissions) && res.body.data.permissions.length > 0,
    `perms=${res.body.data?.permissions?.length}`);

  // Refresh token
  res = await post('/auth/refresh', { refreshToken: state.adminRefreshToken });
  assert('Refresh token', res.status === 200 && !!res.body.data?.accessToken);
  state.adminToken = res.body.data?.accessToken; // use new token
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

  // Validation error
  res = await post('/auth/register', { firstName: 'X' });
  assert('Validation error on register', res.status === 400);
}

async function testRBAC() {
  console.log('\n── RBAC ──');

  // List permissions
  let res = await get('/permissions', state.adminToken);
  assert('List permissions', res.status === 200 && res.body.data?.length >= 55,
    `count=${res.body.data?.length}`);

  // List roles
  res = await get('/roles', state.adminToken);
  assert('List roles', res.status === 200);
  const roles = res.body.data?.docs || res.body.data;
  assert('4 seeded roles exist', Array.isArray(roles) && roles.length >= 4, `count=${roles?.length}`);

  // Get super_admin role
  const superAdminRole = roles.find(r => r.name === 'super_admin');
  state.superAdminRoleId = superAdminRole?._id;
  assert('super_admin role found', !!state.superAdminRoleId);

  // Get counselor role
  const counselorRole = roles.find(r => r.name === 'counselor');
  state.counselorRoleId = counselorRole?._id;

  // Create custom role
  res = await post('/roles', {
    name: 'test_viewer', displayName: 'Test Viewer',
  }, state.adminToken);
  assert('Create custom role', res.status === 201, `status=${res.status} ${JSON.stringify(res.body)}`);
  state.testRoleId = res.body.data?._id;

  // Assign permissions to custom role
  const permRes = await get('/permissions', state.adminToken);
  const readPerms = permRes.body.data?.filter(p => p.key === 'college:read' || p.key === 'course:read');
  const readPermIds = readPerms?.map(p => p._id) || [];

  if (readPermIds.length > 0) {
    res = await patch(`/roles/${state.testRoleId}/permissions`, {
      permissions: readPermIds,
    }, state.adminToken);
    assert('Assign permissions to role', res.status === 200, `status=${res.status}`);
  }

  // Create a limited user
  res = await post('/users', {
    firstName: 'Limited', lastName: 'User',
    email: 'limited@test.com', password: 'Limited@123',
  }, state.adminToken);
  assert('Create limited user', res.status === 201, `status=${res.status}`);
  state.limitedUserId = res.body.data?._id;

  // Assign test_viewer role to limited user
  if (state.testRoleId) {
    res = await patch(`/users/${state.limitedUserId}/roles`, {
      roles: [state.testRoleId],
    }, state.adminToken);
    assert('Assign role to user', res.status === 200, `status=${res.status}`);
  }

  // Login as limited user
  res = await post('/auth/login', { email: 'limited@test.com', password: 'Limited@123' });
  assert('Login as limited user', res.status === 200);
  state.limitedToken = res.body.data?.accessToken;

  // Limited user CAN read colleges (has college:read)
  res = await get('/colleges', state.limitedToken);
  assert('Limited user can read colleges', res.status === 200, `status=${res.status}`);

  // Limited user CANNOT create colleges (no college:create)
  res = await post('/colleges', { name: 'Test', type: 'public' }, state.limitedToken);
  assert('Limited user blocked from creating colleges', res.status === 403, `status=${res.status}`);

  // Limited user CANNOT manage users
  res = await get('/users', state.limitedToken);
  assert('Limited user blocked from listing users', res.status === 403, `status=${res.status}`);

  // Unauthenticated access denied
  res = await get('/users');
  assert('Unauthenticated access denied', res.status === 401, `status=${res.status}`);

  // Delete system role should fail
  if (state.superAdminRoleId) {
    res = await del(`/roles/${state.superAdminRoleId}`, state.adminToken);
    assert('Cannot delete system role', res.status === 400 || res.status === 403, `status=${res.status}`);
  }
}

async function testUsers() {
  console.log('\n── USERS ──');

  let res = await get('/users', state.adminToken);
  assert('List users', res.status === 200);
  const users = res.body.data?.docs || res.body.data;
  assert('Users list is array', Array.isArray(users));

  // Get specific user
  if (state.limitedUserId) {
    res = await get(`/users/${state.limitedUserId}`, state.adminToken);
    assert('Get user by ID', res.status === 200 && res.body.data?.email === 'limited@test.com');
  }

  // Update user
  res = await patch(`/users/${state.limitedUserId}`, { firstName: 'Updated' }, state.adminToken);
  assert('Update user', res.status === 200, `status=${res.status}`);

  // Deactivate user
  res = await patch(`/users/${state.limitedUserId}/activate`, { isActive: false }, state.adminToken);
  assert('Deactivate user', res.status === 200, `status=${res.status}`);

  // Deactivated user can't login
  res = await post('/auth/login', { email: 'limited@test.com', password: 'Limited@123' });
  assert('Deactivated user login rejected', res.status === 403, `status=${res.status}`);

  // Reactivate
  res = await patch(`/users/${state.limitedUserId}/activate`, { isActive: true }, state.adminToken);
  assert('Reactivate user', res.status === 200);
}

async function testColleges() {
  console.log('\n── COLLEGES ──');

  // Create
  let res = await post('/colleges', {
    name: 'IIT Delhi',
    type: 'public',
    description: 'Indian Institute of Technology Delhi',
    location: { city: 'New Delhi', state: 'Delhi', pincode: '110016' },
    fees: { min: 100000, max: 300000 },
    established: 1961,
    website: 'https://iitd.ac.in',
  }, state.adminToken);
  assert('Create college', res.status === 201, `status=${res.status} ${JSON.stringify(res.body.message)}`);
  state.collegeId = res.body.data?._id;
  assert('College has auto-slug', !!res.body.data?.slug);

  // Create another
  res = await post('/colleges', {
    name: 'IIT Bombay', type: 'public',
    location: { city: 'Mumbai', state: 'Maharashtra' },
  }, state.adminToken);
  state.college2Id = res.body.data?._id;

  // List
  res = await get('/colleges', state.adminToken);
  assert('List colleges', res.status === 200);

  // Get by ID
  res = await get(`/colleges/${state.collegeId}`, state.adminToken);
  assert('Get college by ID', res.status === 200 && res.body.data?.name === 'IIT Delhi');

  // Update
  res = await patch(`/colleges/${state.collegeId}`, { ranking: 1 }, state.adminToken);
  assert('Update college', res.status === 200);

  // Publish
  res = await patch(`/colleges/${state.collegeId}/publish`, { status: 'published' }, state.adminToken);
  assert('Publish college', res.status === 200, `status=${res.status}`);

  // Verify published status
  res = await get(`/colleges/${state.collegeId}`, state.adminToken);
  assert('College status is published', res.body.data?.status === 'published');
}

async function testCourses() {
  console.log('\n── COURSES ──');

  let res = await post('/courses', {
    name: 'B.Tech Computer Science',
    level: 'undergraduate',
    duration: { value: 4, unit: 'years' },
    stream: 'Engineering',
    specializations: ['AI/ML', 'Data Science'],
    fees: { amount: 200000, per: 'year' },
  }, state.adminToken);
  assert('Create course', res.status === 201, `status=${res.status}`);
  state.courseId = res.body.data?._id;

  res = await post('/courses', {
    name: 'MBA', level: 'postgraduate',
    duration: { value: 2, unit: 'years' },
    stream: 'Management',
  }, state.adminToken);
  state.course2Id = res.body.data?._id;

  res = await get('/courses', state.adminToken);
  assert('List courses', res.status === 200);

  // Add courses to college
  if (state.collegeId && state.courseId) {
    res = await patch(`/colleges/${state.collegeId}/courses`, {
      courses: [state.courseId, state.course2Id].filter(Boolean),
    }, state.adminToken);
    assert('Add courses to college', res.status === 200, `status=${res.status}`);
  }
}

async function testExams() {
  console.log('\n── EXAMS ──');

  let res = await post('/exams', {
    name: 'JEE Advanced',
    examType: 'national',
    conductedBy: 'IIT',
    pattern: { mode: 'online', totalMarks: 360 },
    eligibility: 'Class 12 pass',
  }, state.adminToken);
  assert('Create exam', res.status === 201, `status=${res.status}`);
  state.examId = res.body.data?._id;

  res = await get('/exams', state.adminToken);
  assert('List exams', res.status === 200);

  // Add exam to college
  if (state.collegeId && state.examId) {
    res = await patch(`/colleges/${state.collegeId}/exams`, {
      exams: [state.examId],
    }, state.adminToken);
    assert('Add exams to college', res.status === 200, `status=${res.status}`);
  }
}

async function testContentSections() {
  console.log('\n── CONTENT SECTIONS ──');

  if (!state.collegeId) return;

  let res = await post('/content-sections', {
    college: state.collegeId,
    sectionKey: 'about',
    title: 'About IIT Delhi',
    content: '<p>IIT Delhi is a premier engineering institution.</p>',
    contentType: 'richtext',
    order: 1,
  }, state.adminToken);
  assert('Create content section', res.status === 201, `status=${res.status}`);
  state.sectionId = res.body.data?._id;

  res = await post('/content-sections', {
    college: state.collegeId,
    sectionKey: 'faq',
    title: 'FAQs',
    content: [{ question: 'How to apply?', answer: 'Through JEE' }],
    contentType: 'faq',
    order: 2,
  }, state.adminToken);
  assert('Create FAQ section', res.status === 201);

  res = await get(`/content-sections?college=${state.collegeId}`, state.adminToken);
  assert('List sections by college', res.status === 200);
}

async function testFormEngine() {
  console.log('\n── FORM ENGINE ──');

  // Create lead capture form
  let res = await post('/forms', {
    title: 'Get College Info',
    purpose: 'lead_capture',
    description: 'Fill this form to get information',
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

  // Publish form
  res = await patch(`/forms/${state.formId}/publish`, { isPublished: true }, state.adminToken);
  assert('Publish form', res.status === 200, `status=${res.status}`);

  // Assign form to college page
  if (state.collegeId) {
    res = await patch(`/forms/${state.formId}/pages`, {
      assignedPages: [{ pageType: 'college', entityId: state.collegeId }],
    }, state.adminToken);
    assert('Assign form to pages', res.status === 200, `status=${res.status}`);
  }

  // Submit form via public endpoint — VALID submission
  res = await post(`/public/forms/${state.formSlug}/submit`, {
    data: {
      fullName: 'Rahul Kumar',
      email: 'rahul@example.com',
      phone: '9876543210',
      interest: 'btech',
      message: 'Interested in B.Tech CSE',
    },
  });
  assert('Submit form (public)', res.status === 201, `status=${res.status} ${JSON.stringify(res.body.message)}`);
  state.submissionId = res.body.data?._id;

  // Submit form — VALIDATION ERRORS
  res = await post(`/public/forms/${state.formSlug}/submit`, {
    data: {
      fullName: '', // required
      email: 'not-an-email',
      phone: '123', // pattern fail
      interest: 'invalid_option',
    },
  });
  assert('Form validation catches errors', res.status === 422, `status=${res.status}`);
  assert('Validation returns field errors', Array.isArray(res.body.errors) && res.body.errors.length >= 3,
    `errors=${JSON.stringify(res.body.errors)}`);

  // Submit another valid one
  res = await post(`/public/forms/${state.formSlug}/submit`, {
    data: {
      fullName: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '9876500000',
      interest: 'mba',
    },
  });
  assert('Second submission works', res.status === 201);

  // View submissions (admin)
  res = await get(`/submissions?form=${state.formId}`, state.adminToken);
  assert('View submissions', res.status === 200);
  const subs = res.body.data?.docs || res.body.data;
  assert('2 submissions exist', Array.isArray(subs) && subs.length >= 2, `count=${subs?.length}`);

  // Verify lead was auto-created
  res = await get('/leads', state.adminToken);
  assert('Leads auto-created from form', res.status === 200);
  const leads = res.body.data?.docs || res.body.data;
  assert('At least 2 leads created', Array.isArray(leads) && leads.length >= 2, `count=${leads?.length}`);

  // Verify lead data mapping
  const rahulLead = leads?.find(l => l.email === 'rahul@example.com');
  assert('Lead field mapping works (name)', rahulLead?.name === 'Rahul Kumar');
  assert('Lead field mapping works (phone)', rahulLead?.phone === '9876543210');
  state.leadId = rahulLead?._id;
}

async function testLeadPipeline() {
  console.log('\n── LEAD PIPELINE ──');
  if (!state.leadId) return;

  // Change lead status
  let res = await patch(`/leads/${state.leadId}/status`, {
    status: 'contacted', note: 'Called the student',
  }, state.adminToken);
  assert('Change lead status', res.status === 200, `status=${res.status}`);

  // Verify status history
  res = await get(`/leads/${state.leadId}`, state.adminToken);
  assert('Lead status updated', res.body.data?.status === 'contacted');
  assert('Status history recorded', res.body.data?.statusHistory?.length >= 1);

  // Assign lead
  res = await patch(`/leads/${state.leadId}/assign`, {
    assignedTo: state.adminId,
  }, state.adminToken);
  assert('Assign lead', res.status === 200, `status=${res.status}`);

  // Add note
  res = await post(`/leads/${state.leadId}/notes`, {
    content: 'Student is very interested in B.Tech CSE',
  }, state.adminToken);
  assert('Add note to lead', res.status === 200, `status=${res.status}`);

  // Verify note
  res = await get(`/leads/${state.leadId}`, state.adminToken);
  assert('Note added', res.body.data?.notes?.length >= 1);

  // Lead stats
  res = await get('/leads/stats', state.adminToken);
  assert('Lead stats', res.status === 200 && res.body.data);

  // Lead export
  res = await get('/leads/export', state.adminToken);
  assert('Lead export', res.status === 200 && Array.isArray(res.body));
}

async function testReviews() {
  console.log('\n── REVIEWS ──');

  // Submit review via public endpoint
  let res = await post('/public/reviews', {
    college: state.collegeId,
    rating: 4,
    title: 'Great college',
    content: 'Excellent faculty and infrastructure',
    authorName: 'Rahul',
    authorEmail: 'rahul@test.com',
    aspects: { academics: 5, faculty: 4, infrastructure: 4, placement: 3, campus: 5 },
  });
  assert('Submit review (public)', res.status === 201, `status=${res.status}`);
  state.reviewId = res.body.data?._id;

  // Review is pending by default
  res = await get(`/reviews/${state.reviewId}`, state.adminToken);
  assert('Review is pending', res.body.data?.status === 'pending');

  // Moderate — approve
  res = await patch(`/reviews/${state.reviewId}/moderate`, {
    status: 'approved',
  }, state.adminToken);
  assert('Moderate review (approve)', res.status === 200, `status=${res.status}`);

  // Submit another review and reject it
  res = await post('/public/reviews', {
    college: state.collegeId, rating: 1, content: 'Spam', authorName: 'Bot',
  });
  const spamId = res.body.data?._id;
  if (spamId) {
    res = await patch(`/reviews/${spamId}/moderate`, { status: 'rejected' }, state.adminToken);
    assert('Moderate review (reject)', res.status === 200);
  }

  // List reviews
  res = await get('/reviews', state.adminToken);
  assert('List reviews (admin)', res.status === 200);
}

async function testSEO() {
  console.log('\n── SEO ──');

  let res = await post('/seo', {
    targetType: 'college',
    targetId: state.collegeId,
    metaTitle: 'IIT Delhi - Best Engineering College',
    metaDescription: 'Explore IIT Delhi courses, placements, fees and more',
    metaKeywords: ['IIT Delhi', 'engineering', 'B.Tech'],
    ogTitle: 'IIT Delhi',
    ogDescription: 'Premier engineering institution',
  }, state.adminToken);
  assert('Create SEO entry', res.status === 201, `status=${res.status}`);
  state.seoId = res.body.data?._id;

  res = await get('/seo', state.adminToken);
  assert('List SEO entries', res.status === 200);

  res = await patch(`/seo/${state.seoId}`, { metaTitle: 'Updated Title' }, state.adminToken);
  assert('Update SEO', res.status === 200);
}

async function testDashboard() {
  console.log('\n── DASHBOARD ──');

  let res = await get('/dashboard/stats', state.adminToken);
  assert('Dashboard stats', res.status === 200 && res.body.data);
  assert('Stats has college count', typeof res.body.data?.colleges === 'number');
  assert('Stats has lead count', typeof res.body.data?.leads === 'number');

  res = await get('/dashboard/pipeline', state.adminToken);
  assert('Lead pipeline', res.status === 200 && Array.isArray(res.body.data));

  res = await get('/dashboard/activity', state.adminToken);
  assert('Recent activity', res.status === 200 && Array.isArray(res.body.data));
  assert('Audit logs populated', res.body.data.length > 0);
}

async function testPublicRoutes() {
  console.log('\n── PUBLIC ROUTES ──');

  // Browse colleges
  let res = await get('/public/colleges');
  assert('Public: list colleges', res.status === 200);
  const colleges = res.body.data;
  assert('Public: only published colleges', colleges?.every(c => c.status === 'published') || colleges?.length === 0,
    `count=${colleges?.length}`);

  // College detail by slug
  res = await get('/public/colleges/iit-delhi');
  assert('Public: college by slug', res.status === 200, `status=${res.status}`);
  assert('Public: college has courses populated', Array.isArray(res.body.data?.courses));
  assert('Public: college has exams populated', Array.isArray(res.body.data?.exams));

  // College reviews (only approved)
  res = await get('/public/colleges/iit-delhi/reviews');
  assert('Public: college reviews', res.status === 200);
  const reviews = res.body.data;
  assert('Public: only approved reviews', reviews?.every(r => r.status === 'approved'));

  // College sections
  res = await get('/public/colleges/iit-delhi/sections');
  assert('Public: college sections', res.status === 200);

  // Browse courses
  res = await get('/public/courses');
  assert('Public: list courses', res.status === 200);

  // Course by slug
  res = await get('/public/courses/btech-computer-science');
  assert('Public: course by slug', res.status === 200, `status=${res.status}`);

  // Browse exams
  res = await get('/public/exams');
  assert('Public: list exams', res.status === 200);

  // Exam by slug
  res = await get('/public/exams/jee-advanced');
  assert('Public: exam by slug', res.status === 200, `status=${res.status}`);

  // Form schema
  res = await get(`/public/forms/${state.formSlug}`);
  assert('Public: get form schema', res.status === 200);
  assert('Public: form schema has fields', Array.isArray(res.body.data?.fields) && res.body.data.fields.length > 0);
  assert('Public: form has successMessage', !!res.body.data?.successMessage);

  // SEO data
  if (state.seoId) {
    res = await get(`/public/seo/college/${state.collegeId}`);
    assert('Public: SEO data', res.status === 200, `status=${res.status}`);
  }

  // 404 on non-existent
  res = await get('/public/colleges/nonexistent-slug');
  assert('Public: 404 for non-existent', res.status === 404);
}

async function test404AndEdgeCases() {
  console.log('\n── EDGE CASES ──');

  // Invalid route
  let res = await get('/nonexistent');
  assert('404 on invalid route', res.status === 404);

  // Invalid ObjectId
  res = await get('/colleges/invalid-id', state.adminToken);
  assert('Invalid ObjectId handled', res.status === 400 || res.status === 404, `status=${res.status}`);

  // No token on protected route
  res = await post('/colleges', { name: 'Test', type: 'public' });
  assert('Protected route requires auth', res.status === 401);
}

async function cleanup() {
  console.log('\n── CLEANUP ──');

  // Soft delete college
  if (state.college2Id) {
    let res = await del(`/colleges/${state.college2Id}`, state.adminToken);
    assert('Soft delete college', res.status === 200, `status=${res.status}`);
  }

  // Delete user
  if (state.limitedUserId) {
    let res = await del(`/users/${state.limitedUserId}`, state.adminToken);
    assert('Soft delete user', res.status === 200, `status=${res.status}`);
  }

  // Delete custom role
  if (state.testRoleId) {
    let res = await del(`/roles/${state.testRoleId}`, state.adminToken);
    assert('Delete custom role', res.status === 200, `status=${res.status}`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('ReactCampus API Tests');
  console.log('=====================');

  try {
    await testAuth();
    await testRBAC();
    await testUsers();
    await testColleges();
    await testCourses();
    await testExams();
    await testContentSections();
    await testFormEngine();
    await testLeadPipeline();
    await testReviews();
    await testSEO();
    await testDashboard();
    await testPublicRoutes();
    await test404AndEdgeCases();
    await cleanup();
  } catch (err) {
    console.error('\nFATAL:', err);
  }

  console.log('\n=====================');
  console.log(`Results: ${passed}/${total} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
