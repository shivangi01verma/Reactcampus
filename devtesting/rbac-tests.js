/**
 * Comprehensive RBAC (Role-Based Access Control) Test Suite
 * Zero external dependencies — native Node.js http module.
 *
 * Creates multiple roles with single/multiple permissions, assigns them to users,
 * and verifies that each user can ONLY access what they're permitted to — and
 * gets 403 Forbidden on everything else.
 *
 * Tested roles:
 *   1. college_reader      — only college:read
 *   2. lead_manager        — lead:read + lead:update + lead:manage + lead:assign
 *   3. content_editor      — college:read + college:update + course:read + content-section:* + page:* + seo:*
 *   4. form_admin          — form:* + lead:read + lead:export + lead:view-stats
 *   5. review_mod          — review:read + review:moderate + discussion:read + discussion:moderate
 *   6. dashboard_viewer    — dashboard:view + dashboard:analytics
 *   7. no_perms            — zero permissions (should get 403 on everything)
 *
 * Usage:
 *   node devtesting/rbac-tests.js
 *
 * Requires server running on port 5050 with a seeded database.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5050;
const HOST = 'localhost';
const BASE_PATH = '/api/v1';
const RUN = Date.now().toString(36);

const state = {};
let totalPassed = 0;
let totalFailed = 0;
let totalTests = 0;
const suites = [];
let currentSuite = null;

const C = {
  reset: '\x1b[0m', green: '\x1b[32m', red: '\x1b[31m',
  yellow: '\x1b[33m', cyan: '\x1b[36m', dim: '\x1b[2m',
  bold: '\x1b[1m', white: '\x1b[37m',
};

// ─── HTTP ────────────────────────────────────────────────────────────────────
function request(method, urlPath, body, token) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: HOST, port: PORT,
      path: BASE_PATH + urlPath, method,
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
const get = (p, t) => request('GET', p, null, t);
const post = (p, b, t) => request('POST', p, b, t);
const patch = (p, b, t) => request('PATCH', p, b, t);
const del = (p, t) => request('DELETE', p, null, t);

// ─── Suite / Assert ──────────────────────────────────────────────────────────
function suite(name) {
  currentSuite = { name, passed: 0, failed: 0, results: [] };
  suites.push(currentSuite);
  console.log(`\n${C.cyan}${C.bold}── ${name} ──${C.reset}`);
}
function assert(name, condition, detail) {
  totalTests++;
  const ok = !!condition;
  if (ok) { totalPassed++; currentSuite.passed++; console.log(`  ${C.green}✓${C.reset} ${name}`); }
  else { totalFailed++; currentSuite.failed++; console.log(`  ${C.red}✗${C.reset} ${name}${detail ? ` ${C.dim}— ${detail}${C.reset}` : ''}`); }
  currentSuite.results.push({ name, ok, detail: ok ? null : detail || null });
}

// Helper: expect 200 (allowed)
async function expectAllowed(label, method, urlPath, token, body) {
  const res = method === 'GET' ? await get(urlPath, token)
    : method === 'POST' ? await post(urlPath, body, token)
    : method === 'PATCH' ? await patch(urlPath, body, token)
    : await del(urlPath, token);
  assert(`ALLOW ${label}`, res.status >= 200 && res.status < 300, `status=${res.status}`);
  return res;
}

// Helper: expect 403 (forbidden)
async function expectForbidden(label, method, urlPath, token, body) {
  const res = method === 'GET' ? await get(urlPath, token)
    : method === 'POST' ? await post(urlPath, body, token)
    : method === 'PATCH' ? await patch(urlPath, body, token)
    : await del(urlPath, token);
  assert(`DENY  ${label}`, res.status === 403, `status=${res.status}`);
  return res;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SETUP: Login admin, load permissions, create test data, create roles & users
// ═══════════════════════════════════════════════════════════════════════════════

async function setup() {
  suite('Setup');

  // Admin login
  let res = await post('/auth/login', {
    email: 'admin@reactcampus.com', password: 'Admin@123456',
  });
  assert('Admin login', res.status === 200, `status=${res.status}`);
  state.adminToken = res.body.data?.accessToken;
  state.adminId = res.body.data?.user?.id;

  // Load all permissions
  res = await get('/permissions', state.adminToken);
  assert('Load permissions', res.status === 200);
  const allPerms = res.body.data;
  state.permMap = {};
  for (const p of allPerms) {
    state.permMap[p.key] = p._id;
  }
  assert('Permission map built', Object.keys(state.permMap).length >= 55,
    `count=${Object.keys(state.permMap).length}`);

  // Helper to get permission IDs by keys
  const permIds = (keys) => keys.map(k => state.permMap[k]).filter(Boolean);

  // ── Create test data (as admin) that roles will try to access ──

  // College
  res = await post('/colleges', {
    name: `RBAC Test College ${RUN}`, type: 'public',
    location: { city: 'Delhi', state: 'Delhi' },
  }, state.adminToken);
  state.collegeId = res.body.data?._id;
  state.collegeSlug = res.body.data?.slug;
  assert('Create test college', res.status === 201, `status=${res.status}`);

  // Publish college
  await patch(`/colleges/${state.collegeId}/publish`, { status: 'published' }, state.adminToken);

  // Course
  res = await post('/courses', {
    name: `RBAC Test Course ${RUN}`, level: 'undergraduate',
    duration: { value: 4, unit: 'years' }, stream: 'Engineering',
  }, state.adminToken);
  state.courseId = res.body.data?._id;
  assert('Create test course', res.status === 201, `status=${res.status}`);

  // Exam
  res = await post('/exams', {
    name: `RBAC Test Exam ${RUN}`, examType: 'national',
    conductedBy: 'Board', eligibility: 'Class 12',
  }, state.adminToken);
  state.examId = res.body.data?._id;
  assert('Create test exam', res.status === 201, `status=${res.status}`);

  // Category
  res = await post('/categories', {
    name: `RBAC Cat ${RUN}`, order: 99,
  }, state.adminToken);
  state.categoryId = res.body.data?._id;

  // Content section
  res = await post('/content-sections', {
    college: state.collegeId, sectionKey: 'about',
    title: `RBAC Section ${RUN}`, content: '<p>Test</p>',
    contentType: 'richtext', order: 1,
  }, state.adminToken);
  state.sectionId = res.body.data?._id;

  // Form
  res = await post('/forms', {
    title: `RBAC Form ${RUN}`, purpose: 'lead_capture',
    fields: [
      { type: 'text', label: 'Name', name: 'name', validation: { required: true }, order: 1, leadFieldMapping: 'name' },
      { type: 'email', label: 'Email', name: 'email', validation: { required: true }, order: 2, leadFieldMapping: 'email' },
    ],
    successMessage: 'Thanks',
  }, state.adminToken);
  state.formId = res.body.data?._id;
  state.formSlug = res.body.data?.slug;
  await patch(`/forms/${state.formId}/publish`, { isPublished: true }, state.adminToken);

  // Create a submission + lead
  res = await post(`/public/forms/${state.formSlug}/submit`, {
    data: { name: `RBAC Lead ${RUN}`, email: `rbac-${RUN}@test.com` },
  });
  state.submissionId = res.body.data?._id;

  // Find the lead
  res = await get('/leads', state.adminToken);
  const leads = res.body.data?.docs || res.body.data;
  const testLead = leads?.find(l => l.email === `rbac-${RUN}@test.com`);
  state.leadId = testLead?._id;
  assert('Test lead created', !!state.leadId);

  // Review
  res = await post('/public/reviews', {
    college: state.collegeId, rating: 4,
    content: `RBAC Review ${RUN}`, authorName: `RBAC${RUN}`,
  });
  state.reviewId = res.body.data?._id;

  // Discussion
  res = await post('/public/discussions', {
    college: state.collegeId,
    content: `RBAC Discussion ${RUN}`,
    authorName: `RBAC${RUN}`, authorEmail: `rbac-disc-${RUN}@test.com`,
  });
  state.discussionId = res.body.data?._id;

  // SEO
  res = await post('/seo', {
    targetType: 'college', targetId: state.collegeId,
    metaTitle: `RBAC SEO ${RUN}`,
  }, state.adminToken);
  state.seoId = res.body.data?._id;

  // Page
  res = await post('/pages', {
    title: `RBAC Page ${RUN}`, description: 'Test page',
    contentBlocks: [{ title: 'Block', contentType: 'richtext', content: '<p>T</p>', order: 1 }],
  }, state.adminToken);
  state.pageId = res.body.data?._id;
  state.pageSlug = res.body.data?.slug;

  // ── Define roles ──
  const roleDefs = [
    {
      name: `college_reader_${RUN}`,
      displayName: 'College Reader Only',
      perms: ['college:read'],
    },
    {
      name: `lead_manager_${RUN}`,
      displayName: 'Lead Manager',
      perms: ['lead:read', 'lead:update', 'lead:manage', 'lead:assign'],
    },
    {
      name: `content_editor_${RUN}`,
      displayName: 'Content Editor',
      perms: [
        'college:read', 'college:update',
        'course:read',
        'content-section:create', 'content-section:read', 'content-section:update', 'content-section:delete',
        'page:create', 'page:read', 'page:update', 'page:delete', 'page:publish',
        'seo:create', 'seo:read', 'seo:update', 'seo:delete',
      ],
    },
    {
      name: `form_admin_${RUN}`,
      displayName: 'Form Admin',
      perms: [
        'form:create', 'form:read', 'form:update', 'form:delete', 'form:publish', 'form:view-submissions',
        'lead:read', 'lead:export', 'lead:view-stats',
      ],
    },
    {
      name: `review_mod_${RUN}`,
      displayName: 'Review Moderator',
      perms: ['review:read', 'review:moderate', 'discussion:read', 'discussion:moderate'],
    },
    {
      name: `dashboard_viewer_${RUN}`,
      displayName: 'Dashboard Viewer',
      perms: ['dashboard:view', 'dashboard:analytics'],
    },
    {
      name: `no_perms_${RUN}`,
      displayName: 'No Permissions',
      perms: [],
    },
  ];

  state.roles = {};
  state.users = {};
  state.tokens = {};

  for (const def of roleDefs) {
    // Create role
    res = await post('/roles', { name: def.name, displayName: def.displayName }, state.adminToken);
    assert(`Create role: ${def.displayName}`, res.status === 201, `status=${res.status}`);
    const roleId = res.body.data?._id;
    state.roles[def.name] = roleId;

    // Assign permissions
    if (def.perms.length > 0) {
      const ids = permIds(def.perms);
      res = await patch(`/roles/${roleId}/permissions`, { permissions: ids }, state.adminToken);
      assert(`Assign ${def.perms.length} perms to ${def.displayName}`, res.status === 200, `status=${res.status}`);
    }

    // Create user
    const email = `${def.name}@rbactest.com`;
    res = await post('/users', {
      firstName: def.displayName.split(' ')[0],
      lastName: `RBAC${RUN}`,
      email, password: 'RbacTest@123',
    }, state.adminToken);
    assert(`Create user for ${def.displayName}`, res.status === 201, `status=${res.status}`);
    const userId = res.body.data?._id;
    state.users[def.name] = { id: userId, email };

    // Assign role
    res = await patch(`/users/${userId}/roles`, { roles: [roleId] }, state.adminToken);
    assert(`Assign role to ${def.displayName}`, res.status === 200, `status=${res.status}`);

    // Login
    res = await post('/auth/login', { email, password: 'RbacTest@123' });
    assert(`Login as ${def.displayName}`, res.status === 200, `status=${res.status}`);
    state.tokens[def.name] = res.body.data?.accessToken;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// RBAC TESTS: For each role, verify ALLOW and DENY on relevant endpoints
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Role 1: college_reader — only college:read ──────────────────────────────
async function testCollegeReader() {
  const roleName = `college_reader_${RUN}`;
  const token = state.tokens[roleName];
  suite('Role: College Reader (college:read only)');

  // ALLOWED
  await expectAllowed('GET /colleges', 'GET', '/colleges', token);
  await expectAllowed('GET /colleges/:id', 'GET', `/colleges/${state.collegeId}`, token);

  // DENIED — everything else
  await expectForbidden('POST /colleges', 'POST', '/colleges', token, { name: 'X', type: 'public' });
  await expectForbidden('PATCH /colleges/:id', 'PATCH', `/colleges/${state.collegeId}`, token, { ranking: 5 });
  await expectForbidden('DELETE /colleges/:id', 'DELETE', `/colleges/${state.collegeId}`, token);
  await expectForbidden('PATCH /colleges/:id/publish', 'PATCH', `/colleges/${state.collegeId}/publish`, token, { status: 'draft' });
  await expectForbidden('PATCH /colleges/:id/courses', 'PATCH', `/colleges/${state.collegeId}/courses`, token, { courses: [] });
  await expectForbidden('PATCH /colleges/:id/exams', 'PATCH', `/colleges/${state.collegeId}/exams`, token, { exams: [] });
  await expectForbidden('GET /users', 'GET', '/users', token);
  await expectForbidden('GET /courses', 'GET', '/courses', token);
  await expectForbidden('GET /exams', 'GET', '/exams', token);
  await expectForbidden('GET /leads', 'GET', '/leads', token);
  await expectForbidden('GET /forms', 'GET', '/forms', token);
  await expectForbidden('GET /reviews', 'GET', '/reviews', token);
  await expectForbidden('GET /discussions', 'GET', '/discussions', token);
  await expectForbidden('GET /seo', 'GET', '/seo', token);
  await expectForbidden('GET /pages', 'GET', '/pages', token);
  await expectForbidden('GET /dashboard/stats', 'GET', '/dashboard/stats', token);
  await expectForbidden('GET /site-settings', 'GET', '/site-settings', token);
  await expectForbidden('GET /categories', 'GET', '/categories', token);
  await expectForbidden('GET /permissions', 'GET', '/permissions', token);
  await expectForbidden('GET /roles', 'GET', '/roles', token);
  await expectForbidden('GET /submissions', 'GET', '/submissions', token);
  await expectForbidden('GET /leads/stats', 'GET', '/leads/stats', token);
  await expectForbidden('GET /leads/export', 'GET', '/leads/export', token);
}

// ─── Role 2: lead_manager — lead:read + lead:update + lead:manage + lead:assign
async function testLeadManager() {
  const roleName = `lead_manager_${RUN}`;
  const token = state.tokens[roleName];
  suite('Role: Lead Manager (read+update+manage+assign)');

  // ALLOWED
  await expectAllowed('GET /leads', 'GET', '/leads', token);
  await expectAllowed('GET /leads/:id', 'GET', `/leads/${state.leadId}`, token);
  await expectAllowed('PATCH /leads/:id (update)', 'PATCH', `/leads/${state.leadId}`, token, { priority: 'urgent' });
  await expectAllowed('POST /leads/:id/notes', 'POST', `/leads/${state.leadId}/notes`, token, { content: 'RBAC note' });
  await expectAllowed('PATCH /leads/:id/status', 'PATCH', `/leads/${state.leadId}/status`, token, { status: 'contacted', note: 'RBAC test' });
  await expectAllowed('PATCH /leads/:id/assign', 'PATCH', `/leads/${state.leadId}/assign`, token, { assignedTo: state.adminId });

  // DENIED — lead perms they DON'T have
  await expectForbidden('POST /leads (create)', 'POST', '/leads', token, { name: 'X', email: 'x@x.com' });
  await expectForbidden('DELETE /leads/:id', 'DELETE', `/leads/${state.leadId}`, token);
  await expectForbidden('GET /leads/export', 'GET', '/leads/export', token);
  await expectForbidden('GET /leads/stats', 'GET', '/leads/stats', token);

  // DENIED — other resources
  await expectForbidden('GET /colleges', 'GET', '/colleges', token);
  await expectForbidden('GET /courses', 'GET', '/courses', token);
  await expectForbidden('GET /forms', 'GET', '/forms', token);
  await expectForbidden('GET /users', 'GET', '/users', token);
  await expectForbidden('GET /reviews', 'GET', '/reviews', token);
  await expectForbidden('GET /dashboard/stats', 'GET', '/dashboard/stats', token);
  await expectForbidden('GET /site-settings', 'GET', '/site-settings', token);
}

// ─── Role 3: content_editor — multi-resource write access ────────────────────
async function testContentEditor() {
  const roleName = `content_editor_${RUN}`;
  const token = state.tokens[roleName];
  suite('Role: Content Editor (colleges+courses+sections+pages+seo)');

  // ALLOWED — college read + update
  await expectAllowed('GET /colleges', 'GET', '/colleges', token);
  await expectAllowed('GET /colleges/:id', 'GET', `/colleges/${state.collegeId}`, token);
  await expectAllowed('PATCH /colleges/:id', 'PATCH', `/colleges/${state.collegeId}`, token, { description: 'Updated by content editor' });

  // DENIED — college create, delete, publish
  await expectForbidden('POST /colleges', 'POST', '/colleges', token, { name: 'X', type: 'public' });
  await expectForbidden('DELETE /colleges/:id', 'DELETE', `/colleges/${state.collegeId}`, token);
  await expectForbidden('PATCH /colleges/:id/publish', 'PATCH', `/colleges/${state.collegeId}/publish`, token, { status: 'draft' });

  // ALLOWED — course read
  await expectAllowed('GET /courses', 'GET', '/courses', token);
  await expectAllowed('GET /courses/:id', 'GET', `/courses/${state.courseId}`, token);

  // DENIED — course create/update/delete
  await expectForbidden('POST /courses', 'POST', '/courses', token, { name: 'X', level: 'undergraduate', duration: { value: 4, unit: 'years' } });
  await expectForbidden('PATCH /courses/:id', 'PATCH', `/courses/${state.courseId}`, token, { stream: 'X' });
  await expectForbidden('DELETE /courses/:id', 'DELETE', `/courses/${state.courseId}`, token);

  // ALLOWED — content sections CRUD
  await expectAllowed('GET /content-sections', 'GET', `/content-sections?college=${state.collegeId}`, token);
  await expectAllowed('GET /content-sections/:id', 'GET', `/content-sections/${state.sectionId}`, token);
  let res = await expectAllowed('POST /content-sections', 'POST', '/content-sections', token, {
    college: state.collegeId, sectionKey: 'test', title: `CE Section ${RUN}`,
    content: '<p>Editor test</p>', contentType: 'richtext', order: 10,
  });
  const editorSectionId = res.body.data?._id;
  if (editorSectionId) {
    await expectAllowed('PATCH /content-sections/:id', 'PATCH', `/content-sections/${editorSectionId}`, token, { title: 'Updated' });
    await expectAllowed('DELETE /content-sections/:id', 'DELETE', `/content-sections/${editorSectionId}`, token);
  }

  // ALLOWED — pages CRUD
  await expectAllowed('GET /pages', 'GET', '/pages', token);
  await expectAllowed('GET /pages/:id', 'GET', `/pages/${state.pageId}`, token);
  res = await expectAllowed('POST /pages', 'POST', '/pages', token, {
    title: `CE Page ${RUN}`, description: 'Editor page',
    contentBlocks: [{ title: 'B', contentType: 'richtext', content: '<p>E</p>', order: 1 }],
  });
  const editorPageId = res.body.data?._id;
  if (editorPageId) {
    await expectAllowed('PATCH /pages/:id', 'PATCH', `/pages/${editorPageId}`, token, { description: 'Upd' });
    await expectAllowed('PATCH /pages/:id/publish', 'PATCH', `/pages/${editorPageId}/publish`, token, { status: 'published' });
    await expectAllowed('DELETE /pages/:id', 'DELETE', `/pages/${editorPageId}`, token);
  }

  // ALLOWED — SEO CRUD
  await expectAllowed('GET /seo', 'GET', '/seo', token);
  await expectAllowed('GET /seo/:id', 'GET', `/seo/${state.seoId}`, token);
  res = await expectAllowed('POST /seo (for course)', 'POST', '/seo', token, {
    targetType: 'course', targetId: state.courseId, metaTitle: `CE SEO ${RUN}`,
  });
  const editorSeoId = res.body.data?._id;
  if (editorSeoId) {
    await expectAllowed('PATCH /seo/:id', 'PATCH', `/seo/${editorSeoId}`, token, { metaTitle: 'Updated' });
    await expectAllowed('DELETE /seo/:id', 'DELETE', `/seo/${editorSeoId}`, token);
  }

  // DENIED — other resources
  await expectForbidden('GET /leads', 'GET', '/leads', token);
  await expectForbidden('GET /forms', 'GET', '/forms', token);
  await expectForbidden('GET /users', 'GET', '/users', token);
  await expectForbidden('GET /reviews', 'GET', '/reviews', token);
  await expectForbidden('GET /discussions', 'GET', '/discussions', token);
  await expectForbidden('GET /dashboard/stats', 'GET', '/dashboard/stats', token);
  await expectForbidden('GET /site-settings', 'GET', '/site-settings', token);
}

// ─── Role 4: form_admin — forms + submissions + lead read/export/stats ───────
async function testFormAdmin() {
  const roleName = `form_admin_${RUN}`;
  const token = state.tokens[roleName];
  suite('Role: Form Admin (forms+submissions+lead-read/export/stats)');

  // ALLOWED — form CRUD
  await expectAllowed('GET /forms', 'GET', '/forms', token);
  await expectAllowed('GET /forms/:id', 'GET', `/forms/${state.formId}`, token);
  let res = await expectAllowed('POST /forms', 'POST', '/forms', token, {
    title: `FA Form ${RUN}`, purpose: 'generic',
    fields: [{ type: 'text', label: 'X', name: 'x', order: 1 }],
    successMessage: 'OK',
  });
  const faFormId = res.body.data?._id;
  if (faFormId) {
    await expectAllowed('PATCH /forms/:id', 'PATCH', `/forms/${faFormId}`, token, { description: 'Upd' });
    await expectAllowed('PATCH /forms/:id/publish', 'PATCH', `/forms/${faFormId}/publish`, token, { isPublished: true });
    await expectAllowed('PATCH /forms/:id/pages', 'PATCH', `/forms/${faFormId}/pages`, token, { assignedPages: [] });
    await expectAllowed('DELETE /forms/:id', 'DELETE', `/forms/${faFormId}`, token);
  }

  // ALLOWED — submissions
  await expectAllowed('GET /submissions', 'GET', `/submissions?form=${state.formId}`, token);
  if (state.submissionId) {
    await expectAllowed('GET /submissions/:id', 'GET', `/submissions/${state.submissionId}`, token);
  }

  // ALLOWED — lead read, export, stats
  await expectAllowed('GET /leads', 'GET', '/leads', token);
  await expectAllowed('GET /leads/:id', 'GET', `/leads/${state.leadId}`, token);
  await expectAllowed('GET /leads/export', 'GET', '/leads/export', token);
  await expectAllowed('GET /leads/stats', 'GET', '/leads/stats', token);

  // DENIED — lead write operations
  await expectForbidden('POST /leads (create)', 'POST', '/leads', token, { name: 'X', email: 'x@x.com' });
  await expectForbidden('PATCH /leads/:id (update)', 'PATCH', `/leads/${state.leadId}`, token, { priority: 'low' });
  await expectForbidden('DELETE /leads/:id', 'DELETE', `/leads/${state.leadId}`, token);
  await expectForbidden('PATCH /leads/:id/status', 'PATCH', `/leads/${state.leadId}/status`, token, { status: 'lost' });
  await expectForbidden('PATCH /leads/:id/assign', 'PATCH', `/leads/${state.leadId}/assign`, token, { assignedTo: state.adminId });
  await expectForbidden('POST /leads/bulk', 'POST', '/leads/bulk', token, { ids: [state.leadId], action: 'delete' });

  // DENIED — other resources
  await expectForbidden('GET /colleges', 'GET', '/colleges', token);
  await expectForbidden('GET /users', 'GET', '/users', token);
  await expectForbidden('GET /dashboard/stats', 'GET', '/dashboard/stats', token);
}

// ─── Role 5: review_mod — review + discussion read + moderate ────────────────
async function testReviewMod() {
  const roleName = `review_mod_${RUN}`;
  const token = state.tokens[roleName];
  suite('Role: Review Moderator (reviews+discussions read+moderate)');

  // ALLOWED — reviews
  await expectAllowed('GET /reviews', 'GET', '/reviews', token);
  await expectAllowed('GET /reviews/:id', 'GET', `/reviews/${state.reviewId}`, token);
  await expectAllowed('PATCH /reviews/:id/moderate', 'PATCH', `/reviews/${state.reviewId}/moderate`, token, { status: 'approved' });

  // DENIED — review delete (no review:delete)
  await expectForbidden('DELETE /reviews/:id', 'DELETE', `/reviews/${state.reviewId}`, token);

  // ALLOWED — discussions
  await expectAllowed('GET /discussions', 'GET', '/discussions', token);
  await expectAllowed('GET /discussions/:id', 'GET', `/discussions/${state.discussionId}`, token);
  await expectAllowed('PATCH /discussions/:id/moderate', 'PATCH', `/discussions/${state.discussionId}/moderate`, token, { status: 'approved' });

  // DENIED — discussion delete (no discussion:delete)
  await expectForbidden('DELETE /discussions/:id', 'DELETE', `/discussions/${state.discussionId}`, token);

  // DENIED — everything else
  await expectForbidden('GET /colleges', 'GET', '/colleges', token);
  await expectForbidden('GET /leads', 'GET', '/leads', token);
  await expectForbidden('GET /forms', 'GET', '/forms', token);
  await expectForbidden('GET /users', 'GET', '/users', token);
  await expectForbidden('GET /courses', 'GET', '/courses', token);
  await expectForbidden('GET /pages', 'GET', '/pages', token);
  await expectForbidden('GET /seo', 'GET', '/seo', token);
  await expectForbidden('GET /dashboard/stats', 'GET', '/dashboard/stats', token);
  await expectForbidden('GET /site-settings', 'GET', '/site-settings', token);
}

// ─── Role 6: dashboard_viewer — dashboard:view + dashboard:analytics ─────────
async function testDashboardViewer() {
  const roleName = `dashboard_viewer_${RUN}`;
  const token = state.tokens[roleName];
  suite('Role: Dashboard Viewer (dashboard:view+analytics)');

  // ALLOWED
  await expectAllowed('GET /dashboard/stats', 'GET', '/dashboard/stats', token);
  await expectAllowed('GET /dashboard/pipeline', 'GET', '/dashboard/pipeline', token);
  await expectAllowed('GET /dashboard/activity', 'GET', '/dashboard/activity', token);

  // DENIED — everything else
  await expectForbidden('GET /colleges', 'GET', '/colleges', token);
  await expectForbidden('GET /courses', 'GET', '/courses', token);
  await expectForbidden('GET /leads', 'GET', '/leads', token);
  await expectForbidden('GET /forms', 'GET', '/forms', token);
  await expectForbidden('GET /users', 'GET', '/users', token);
  await expectForbidden('GET /reviews', 'GET', '/reviews', token);
  await expectForbidden('GET /discussions', 'GET', '/discussions', token);
  await expectForbidden('GET /seo', 'GET', '/seo', token);
  await expectForbidden('GET /pages', 'GET', '/pages', token);
  await expectForbidden('GET /site-settings', 'GET', '/site-settings', token);
  await expectForbidden('GET /categories', 'GET', '/categories', token);
  await expectForbidden('GET /submissions', 'GET', '/submissions', token);
}

// ─── Role 7: no_perms — 403 on everything ───────────────────────────────────
async function testNoPerms() {
  const roleName = `no_perms_${RUN}`;
  const token = state.tokens[roleName];
  suite('Role: No Permissions (403 on everything)');

  await expectForbidden('GET /colleges', 'GET', '/colleges', token);
  await expectForbidden('GET /courses', 'GET', '/courses', token);
  await expectForbidden('GET /exams', 'GET', '/exams', token);
  await expectForbidden('GET /categories', 'GET', '/categories', token);
  await expectForbidden('GET /users', 'GET', '/users', token);
  await expectForbidden('GET /roles', 'GET', '/roles', token);
  await expectForbidden('GET /permissions', 'GET', '/permissions', token);
  await expectForbidden('GET /leads', 'GET', '/leads', token);
  await expectForbidden('GET /leads/stats', 'GET', '/leads/stats', token);
  await expectForbidden('GET /leads/export', 'GET', '/leads/export', token);
  await expectForbidden('GET /forms', 'GET', '/forms', token);
  await expectForbidden('GET /submissions', 'GET', '/submissions', token);
  await expectForbidden('GET /reviews', 'GET', '/reviews', token);
  await expectForbidden('GET /discussions', 'GET', '/discussions', token);
  await expectForbidden('GET /seo', 'GET', '/seo', token);
  await expectForbidden('GET /pages', 'GET', '/pages', token);
  await expectForbidden('GET /content-sections', 'GET', `/content-sections?college=${state.collegeId}`, token);
  await expectForbidden('GET /dashboard/stats', 'GET', '/dashboard/stats', token);
  await expectForbidden('GET /dashboard/pipeline', 'GET', '/dashboard/pipeline', token);
  await expectForbidden('GET /dashboard/activity', 'GET', '/dashboard/activity', token);
  await expectForbidden('GET /site-settings', 'GET', '/site-settings', token);
  await expectForbidden('POST /colleges', 'POST', '/colleges', token, { name: 'X', type: 'public' });
  await expectForbidden('POST /leads', 'POST', '/leads', token, { name: 'X', email: 'x@x.com' });
  await expectForbidden('POST /forms', 'POST', '/forms', token, { title: 'X', purpose: 'generic', fields: [] });
  await expectForbidden('PATCH /colleges/:id', 'PATCH', `/colleges/${state.collegeId}`, token, { ranking: 1 });
  await expectForbidden('DELETE /colleges/:id', 'DELETE', `/colleges/${state.collegeId}`, token);
}

// ─── Cross-role: verify single-perm doesn't bleed into other resources ───────
async function testCrossRole() {
  suite('Cross-Role Isolation');

  const crToken = state.tokens[`college_reader_${RUN}`];
  const lmToken = state.tokens[`lead_manager_${RUN}`];
  const rmToken = state.tokens[`review_mod_${RUN}`];
  const dvToken = state.tokens[`dashboard_viewer_${RUN}`];

  // college_reader can't see leads
  await expectForbidden('college_reader → GET /leads', 'GET', '/leads', crToken);
  await expectForbidden('college_reader → GET /leads/stats', 'GET', '/leads/stats', crToken);
  await expectForbidden('college_reader → POST /leads/bulk', 'POST', '/leads/bulk', crToken, { ids: [], action: 'delete' });

  // lead_manager can't see colleges
  await expectForbidden('lead_manager → GET /colleges', 'GET', '/colleges', lmToken);
  await expectForbidden('lead_manager → GET /reviews', 'GET', '/reviews', lmToken);

  // review_mod can't manage leads
  await expectForbidden('review_mod → GET /leads', 'GET', '/leads', rmToken);
  await expectForbidden('review_mod → PATCH /leads/:id/status', 'PATCH', `/leads/${state.leadId}/status`, rmToken, { status: 'lost' });

  // dashboard_viewer can't modify anything
  await expectForbidden('dashboard_viewer → POST /colleges', 'POST', '/colleges', dvToken, { name: 'X', type: 'public' });
  await expectForbidden('dashboard_viewer → PATCH /leads/:id', 'PATCH', `/leads/${state.leadId}`, dvToken, { priority: 'low' });
  await expectForbidden('dashboard_viewer → DELETE /reviews/:id', 'DELETE', `/reviews/${state.reviewId}`, dvToken);

  // No auth at all
  let res = await get('/colleges');
  assert('DENY  No token → GET /colleges', res.status === 401, `status=${res.status}`);
  res = await get('/leads');
  assert('DENY  No token → GET /leads', res.status === 401, `status=${res.status}`);
  res = await get('/dashboard/stats');
  assert('DENY  No token → GET /dashboard/stats', res.status === 401, `status=${res.status}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLEANUP
// ═══════════════════════════════════════════════════════════════════════════════
async function cleanup() {
  suite('Cleanup');
  const t = state.adminToken;

  // Delete test data
  if (state.seoId) { let r = await del(`/seo/${state.seoId}`, t); assert('Delete SEO', r.status === 200, `s=${r.status}`); }
  if (state.sectionId) { let r = await del(`/content-sections/${state.sectionId}`, t); assert('Delete section', r.status === 200, `s=${r.status}`); }
  if (state.reviewId) { let r = await del(`/reviews/${state.reviewId}`, t); assert('Delete review', r.status === 200, `s=${r.status}`); }
  if (state.discussionId) { let r = await del(`/discussions/${state.discussionId}`, t); assert('Delete discussion', r.status === 200, `s=${r.status}`); }
  if (state.leadId) { let r = await del(`/leads/${state.leadId}`, t); assert('Delete lead', r.status === 200, `s=${r.status}`); }
  if (state.formId) { let r = await del(`/forms/${state.formId}`, t); assert('Delete form', r.status === 200, `s=${r.status}`); }
  if (state.pageId) { let r = await del(`/pages/${state.pageId}`, t); assert('Delete page', r.status === 200, `s=${r.status}`); }
  if (state.examId) { let r = await del(`/exams/${state.examId}`, t); assert('Delete exam', r.status === 200, `s=${r.status}`); }
  if (state.courseId) { let r = await del(`/courses/${state.courseId}`, t); assert('Delete course', r.status === 200, `s=${r.status}`); }
  if (state.collegeId) { let r = await del(`/colleges/${state.collegeId}`, t); assert('Delete college', r.status === 200, `s=${r.status}`); }
  if (state.categoryId) { let r = await del(`/categories/${state.categoryId}`, t); assert('Delete category', r.status === 200, `s=${r.status}`); }

  // Delete users and roles
  for (const [roleName, userData] of Object.entries(state.users)) {
    let r = await del(`/users/${userData.id}`, t);
    assert(`Delete user ${roleName}`, r.status === 200, `s=${r.status}`);
  }
  for (const [roleName, roleId] of Object.entries(state.roles)) {
    let r = await del(`/roles/${roleId}`, t);
    assert(`Delete role ${roleName}`, r.status === 200, `s=${r.status}`);
  }
}

// ─── Report ──────────────────────────────────────────────────────────────────
function generateReport() {
  const reportPath = path.join(__dirname, 'rbac-report.txt');
  const lines = [];
  lines.push('═══════════════════════════════════════════════════════════════');
  lines.push('  ReactCampus RBAC Test Report');
  lines.push(`  Generated: ${new Date().toISOString()}`);
  lines.push(`  Run ID: ${RUN}`);
  lines.push('═══════════════════════════════════════════════════════════════');
  lines.push('');
  lines.push('┌──────────────────────────────────────────┬────────┬────────┬────────┐');
  lines.push('│ Suite                                    │ Passed │ Failed │ Total  │');
  lines.push('├──────────────────────────────────────────┼────────┼────────┼────────┤');

  console.log('');
  console.log(`${C.bold}${'═'.repeat(72)}${C.reset}`);
  console.log(`${C.bold}  RBAC Summary${C.reset}  ${C.dim}(run: ${RUN})${C.reset}`);
  console.log(`${'═'.repeat(72)}`);
  console.log(`  ${'Suite'.padEnd(40)} ${'Pass'.padStart(6)} ${'Fail'.padStart(6)} ${'Total'.padStart(6)}`);
  console.log(`  ${'─'.repeat(60)}`);

  for (const s of suites) {
    const total = s.passed + s.failed;
    const icon = s.failed === 0 ? `${C.green}✓${C.reset}` : `${C.red}✗${C.reset}`;
    console.log(`  ${icon} ${s.name.padEnd(38)} ${String(s.passed).padStart(6)} ${String(s.failed).padStart(6)} ${String(total).padStart(6)}`);
    const st = s.failed === 0 ? 'PASS' : 'FAIL';
    lines.push(`│ ${(st + ' ' + s.name).padEnd(40)} │ ${String(s.passed).padStart(6)} │ ${String(s.failed).padStart(6)} │ ${String(total).padStart(6)} │`);
  }

  lines.push('├──────────────────────────────────────────┼────────┼────────┼────────┤');
  lines.push(`│ ${'TOTAL'.padEnd(40)} │ ${String(totalPassed).padStart(6)} │ ${String(totalFailed).padStart(6)} │ ${String(totalTests).padStart(6)} │`);
  lines.push('└──────────────────────────────────────────┴────────┴────────┴────────┘');

  console.log(`  ${'─'.repeat(60)}`);
  const tc = totalFailed === 0 ? C.green : C.red;
  console.log(`  ${tc}${'TOTAL'.padEnd(40)} ${String(totalPassed).padStart(6)} ${String(totalFailed).padStart(6)} ${String(totalTests).padStart(6)}${C.reset}`);
  console.log(`${'═'.repeat(72)}`);

  // Detailed
  lines.push(''); lines.push(''); lines.push('DETAILED RESULTS');
  lines.push('─'.repeat(65));
  for (const s of suites) {
    lines.push(''); lines.push(`── ${s.name} ──`);
    for (const r of s.results) {
      lines.push(`  ${r.ok ? '✓' : '✗'} ${r.name}${r.detail ? ` — ${r.detail}` : ''}`);
    }
  }

  // Failed
  const fails = [];
  for (const s of suites) for (const r of s.results) if (!r.ok) fails.push({ suite: s.name, ...r });
  if (fails.length > 0) {
    lines.push(''); lines.push(''); lines.push('FAILED TESTS');
    lines.push('─'.repeat(65));
    for (const f of fails) lines.push(`  ✗ [${f.suite}] ${f.name}${f.detail ? ` — ${f.detail}` : ''}`);
  }

  lines.push('');
  lines.push(`Result: ${totalPassed}/${totalTests} passed, ${totalFailed} failed`);
  lines.push(`Status: ${totalFailed === 0 ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
  fs.writeFileSync(reportPath, lines.join('\n'), 'utf-8');
  console.log(`\n${C.dim}Report written to ${reportPath}${C.reset}`);
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`${C.bold}${C.cyan}ReactCampus RBAC Test Suite${C.reset}`);
  console.log(`${C.dim}Target: http://${HOST}:${PORT}${BASE_PATH}${C.reset}`);
  console.log(`${C.dim}Run ID: ${RUN}  •  Time: ${new Date().toISOString()}${C.reset}`);

  try {
    await setup();
    await testCollegeReader();
    await testLeadManager();
    await testContentEditor();
    await testFormAdmin();
    await testReviewMod();
    await testDashboardViewer();
    await testNoPerms();
    await testCrossRole();
    await cleanup();
  } catch (err) {
    console.error(`\n${C.red}FATAL ERROR:${C.reset}`, err.message || err);
    if (err.code === 'ECONNREFUSED') {
      console.error(`${C.yellow}Is the server running on port ${PORT}?${C.reset}`);
    }
  }

  generateReport();
  console.log(`\n${totalFailed === 0 ? C.green : C.red}${totalPassed}/${totalTests} passed, ${totalFailed} failed${C.reset}`);
  process.exit(totalFailed > 0 ? 1 : 0);
}

main();
