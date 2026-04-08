/**
 * Comprehensive Frontend Test Suite for ReactCampus
 * Zero external dependencies — native Node.js http module.
 *
 * Tests the Vite dev server (port 3000):
 *   1. Static asset & HTML serving
 *   2. All public page routes return the SPA shell
 *   3. All admin page routes return the SPA shell
 *   4. Auth routes return the SPA shell
 *   5. API proxy — backend API accessible through :3000/api/v1
 *   6. API proxy auth flow — login, authenticated requests, token refresh
 *   7. API proxy public endpoints — colleges, courses, exams, forms, etc.
 *   8. API proxy error handling — 404, 401, invalid routes
 *   9. Content verification — SPA HTML contains React root, scripts, CSS
 *  10. Login + admin data flow — login via proxy, fetch protected data
 *
 * Usage:
 *   node devtesting/frontend-tests.js
 *
 * Requires:
 *   - Frontend dev server on port 3000 (npm run dev in client/)
 *   - Backend server on port 5050 with seeded DB
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const FE_PORT = 3000;
const BE_PORT = 5050;
const HOST = 'localhost';
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
  bold: '\x1b[1m',
};

// ─── HTTP helpers ────────────────────────────────────────────────────────────

// Generic HTTP request — returns { status, headers, body (raw string) }
function httpGet(port, urlPath, headers = {}) {
  return new Promise((resolve, reject) => {
    const opts = { hostname: HOST, port, path: urlPath, method: 'GET', headers };
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    req.end();
  });
}

function httpPost(port, urlPath, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const hdrs = { 'Content-Type': 'application/json', ...headers };
    const opts = { hostname: HOST, port, path: urlPath, method: 'POST', headers: hdrs };
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
    req.write(JSON.stringify(body));
    req.end();
  });
}

function httpReq(port, method, urlPath, body, token) {
  return new Promise((resolve, reject) => {
    const hdrs = { 'Content-Type': 'application/json' };
    if (token) hdrs['Authorization'] = `Bearer ${token}`;
    const opts = { hostname: HOST, port, path: urlPath, method, headers: hdrs };
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

// ═══════════════════════════════════════════════════════════════════════════════
// 1. Dev Server Health
// ═══════════════════════════════════════════════════════════════════════════════
async function testDevServerHealth() {
  suite('Dev Server Health');

  // Frontend serves HTML on root
  const res = await httpGet(FE_PORT, '/');
  assert('GET / returns 200', res.status === 200, `status=${res.status}`);
  assert('GET / returns HTML', (res.headers['content-type'] || '').includes('text/html'),
    `ct=${res.headers['content-type']}`);
  assert('HTML has <!DOCTYPE html>', res.body.includes('<!DOCTYPE html>') || res.body.includes('<!doctype html>'));
  assert('HTML has <div id="root">', res.body.includes('id="root"'));
  assert('HTML has <script', res.body.includes('<script'));

  // Store the SPA shell for later comparison
  state.spaHtml = res.body;

  // Backend still reachable directly
  const be = await httpGet(BE_PORT, '/health');
  assert('Backend /health reachable', be.status === 200, `status=${be.status}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Static Assets
// ═══════════════════════════════════════════════════════════════════════════════
async function testStaticAssets() {
  suite('Static Assets');

  // Vite serves its own client scripts
  const res = await httpGet(FE_PORT, '/@vite/client');
  assert('Vite client script loads', res.status === 200, `status=${res.status}`);
  assert('Vite client is JavaScript', (res.headers['content-type'] || '').includes('javascript') ||
    (res.headers['content-type'] || '').includes('text/plain'),
    `ct=${res.headers['content-type']}`);

  // Main entry point resolves (Vite transforms .tsx on the fly)
  const mainRes = await httpGet(FE_PORT, '/src/main.tsx');
  assert('main.tsx transforms and loads', mainRes.status === 200, `status=${mainRes.status}`);
  assert('main.tsx is JS content', (mainRes.headers['content-type'] || '').includes('javascript') ||
    mainRes.body.includes('import'),
    `ct=${mainRes.headers['content-type']}`);

  // CSS entry point
  const cssRes = await httpGet(FE_PORT, '/src/index.css');
  assert('index.css loads', cssRes.status === 200, `status=${cssRes.status}`);

  // favicon / vite.svg
  const svgRes = await httpGet(FE_PORT, '/vite.svg');
  assert('vite.svg loads', svgRes.status === 200, `status=${svgRes.status}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. Public Page Routes — all return SPA shell HTML
// ═══════════════════════════════════════════════════════════════════════════════
async function testPublicPageRoutes() {
  suite('Public Page Routes (SPA shell)');

  const publicPaths = [
    '/',
    '/colleges',
    '/colleges/some-college-slug',
    '/courses',
    '/courses/some-course-slug',
    '/exams',
    '/exams/some-exam-slug',
    '/about',
    '/contact',
    '/forms/some-form-slug',
    '/pages/some-page-slug',
  ];

  for (const p of publicPaths) {
    const res = await httpGet(FE_PORT, p);
    assert(`GET ${p} → 200 + HTML`, res.status === 200 && res.body.includes('id="root"'),
      `status=${res.status}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. Auth Page Routes
// ═══════════════════════════════════════════════════════════════════════════════
async function testAuthPageRoutes() {
  suite('Auth Page Routes (SPA shell)');

  const authPaths = ['/login', '/register'];

  for (const p of authPaths) {
    const res = await httpGet(FE_PORT, p);
    assert(`GET ${p} → 200 + HTML`, res.status === 200 && res.body.includes('id="root"'),
      `status=${res.status}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. Admin Page Routes — SPA shell returned (React handles auth redirect)
// ═══════════════════════════════════════════════════════════════════════════════
async function testAdminPageRoutes() {
  suite('Admin Page Routes (SPA shell)');

  const adminPaths = [
    '/admin',
    '/admin/users',
    '/admin/users/new',
    '/admin/roles',
    '/admin/roles/new',
    '/admin/categories',
    '/admin/categories/new',
    '/admin/colleges',
    '/admin/colleges/new',
    '/admin/courses',
    '/admin/courses/new',
    '/admin/exams',
    '/admin/exams/new',
    '/admin/forms',
    '/admin/forms/new',
    '/admin/submissions',
    '/admin/leads',
    '/admin/leads/pipeline',
    '/admin/reviews',
    '/admin/discussions',
    '/admin/pages',
    '/admin/pages/new',
    '/admin/seo',
    '/admin/seo/new',
    '/admin/site-settings',
    '/admin/settings/profile',
    '/admin/settings/password',
  ];

  for (const p of adminPaths) {
    const res = await httpGet(FE_PORT, p);
    assert(`GET ${p} → 200 + SPA`, res.status === 200 && res.body.includes('id="root"'),
      `status=${res.status}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. API Proxy — Public Endpoints via Frontend Port
// ═══════════════════════════════════════════════════════════════════════════════
async function testApiProxyPublic() {
  suite('API Proxy — Public Endpoints (via :3000)');

  // Health check through proxy
  const health = await httpGet(FE_PORT, '/api/v1/../health');
  // /health is not under /api, so it won't be proxied — that's expected
  // Instead test actual API endpoints
  const colleges = await httpGet(FE_PORT, '/api/v1/public/colleges');
  assert('Proxy: GET /api/v1/public/colleges', colleges.status === 200, `status=${colleges.status}`);
  let body;
  try { body = JSON.parse(colleges.body); } catch { body = null; }
  assert('Proxy: response is JSON', body && body.success === true, `body=${typeof colleges.body}`);
  assert('Proxy: data is array', Array.isArray(body?.data));

  // Courses
  const courses = await httpGet(FE_PORT, '/api/v1/public/courses');
  assert('Proxy: GET /api/v1/public/courses', courses.status === 200, `status=${courses.status}`);

  // Exams
  const exams = await httpGet(FE_PORT, '/api/v1/public/exams');
  assert('Proxy: GET /api/v1/public/exams', exams.status === 200, `status=${exams.status}`);

  // Categories
  const cats = await httpGet(FE_PORT, '/api/v1/public/categories');
  assert('Proxy: GET /api/v1/public/categories', cats.status === 200, `status=${cats.status}`);

  // Site settings
  const settings = await httpGet(FE_PORT, '/api/v1/public/site-settings');
  assert('Proxy: GET /api/v1/public/site-settings', settings.status === 200, `status=${settings.status}`);

  // Pages
  const pages = await httpGet(FE_PORT, '/api/v1/public/pages');
  assert('Proxy: GET /api/v1/public/pages', pages.status === 200, `status=${pages.status}`);

  // Contact form
  const contact = await httpPost(FE_PORT, '/api/v1/public/contact', {
    name: `FE Test ${RUN}`, email: `fe-test-${RUN}@example.com`,
    message: 'Frontend proxy test',
  });
  assert('Proxy: POST /api/v1/public/contact', contact.status === 201, `status=${contact.status}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. API Proxy — Auth Flow via Frontend Port
// ═══════════════════════════════════════════════════════════════════════════════
async function testApiProxyAuth() {
  suite('API Proxy — Auth Flow (via :3000)');

  // Register via proxy
  const regEmail = `feproxy-${RUN}@test.com`;
  const reg = await httpPost(FE_PORT, '/api/v1/auth/register', {
    firstName: 'FEProxy', lastName: `Test${RUN}`,
    email: regEmail, password: 'FEProxy@12345',
  });
  assert('Proxy: register', reg.status === 201, `status=${reg.status}`);
  assert('Proxy: register returns tokens', !!reg.body?.data?.accessToken);
  state.feTestToken = reg.body?.data?.accessToken;
  state.feTestRefreshToken = reg.body?.data?.refreshToken;
  state.feTestEmail = regEmail;

  // Login as admin via proxy
  const login = await httpPost(FE_PORT, '/api/v1/auth/login', {
    email: 'admin@reactcampus.com', password: 'Admin@123456',
  });
  assert('Proxy: admin login', login.status === 200, `status=${login.status}`);
  assert('Proxy: login returns accessToken', !!login.body?.data?.accessToken);
  assert('Proxy: login returns user object', !!login.body?.data?.user?.id);
  state.adminToken = login.body?.data?.accessToken;
  state.adminRefreshToken = login.body?.data?.refreshToken;
  state.adminId = login.body?.data?.user?.id;

  // GET /auth/me via proxy
  const me = await httpReq(FE_PORT, 'GET', '/api/v1/auth/me', null, state.adminToken);
  assert('Proxy: GET /auth/me', me.status === 200, `status=${me.status}`);
  assert('Proxy: me returns email', me.body?.data?.user?.email === 'admin@reactcampus.com');
  assert('Proxy: me returns permissions', Array.isArray(me.body?.data?.permissions) && me.body.data.permissions.length > 0);

  // Refresh via proxy
  const refresh = await httpPost(FE_PORT, '/api/v1/auth/refresh', {
    refreshToken: state.adminRefreshToken,
  });
  assert('Proxy: refresh token', refresh.status === 200 && !!refresh.body?.data?.accessToken);
  state.adminToken = refresh.body?.data?.accessToken;
  state.adminRefreshToken = refresh.body?.data?.refreshToken;

  // Logout via proxy
  const logout = await httpPost(FE_PORT, '/api/v1/auth/logout', {
    refreshToken: state.adminRefreshToken,
  });
  assert('Proxy: logout', logout.status === 200, `status=${logout.status}`);

  // Re-login for remaining tests
  const relogin = await httpPost(FE_PORT, '/api/v1/auth/login', {
    email: 'admin@reactcampus.com', password: 'Admin@123456',
  });
  state.adminToken = relogin.body?.data?.accessToken;
  state.adminRefreshToken = relogin.body?.data?.refreshToken;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 8. API Proxy — Protected Endpoints (admin CRUD via :3000)
// ═══════════════════════════════════════════════════════════════════════════════
async function testApiProxyProtected() {
  suite('API Proxy — Protected Endpoints (via :3000)');

  const t = state.adminToken;

  // Users
  const users = await httpReq(FE_PORT, 'GET', '/api/v1/users', null, t);
  assert('Proxy: GET /users', users.status === 200, `status=${users.status}`);

  // Roles
  const roles = await httpReq(FE_PORT, 'GET', '/api/v1/roles', null, t);
  assert('Proxy: GET /roles', roles.status === 200, `status=${roles.status}`);

  // Permissions
  const perms = await httpReq(FE_PORT, 'GET', '/api/v1/permissions', null, t);
  assert('Proxy: GET /permissions', perms.status === 200, `status=${perms.status}`);

  // Colleges
  const colleges = await httpReq(FE_PORT, 'GET', '/api/v1/colleges', null, t);
  assert('Proxy: GET /colleges (admin)', colleges.status === 200, `status=${colleges.status}`);

  // Courses
  const courses = await httpReq(FE_PORT, 'GET', '/api/v1/courses', null, t);
  assert('Proxy: GET /courses (admin)', courses.status === 200, `status=${courses.status}`);

  // Exams
  const exams = await httpReq(FE_PORT, 'GET', '/api/v1/exams', null, t);
  assert('Proxy: GET /exams (admin)', exams.status === 200, `status=${exams.status}`);

  // Categories
  const cats = await httpReq(FE_PORT, 'GET', '/api/v1/categories', null, t);
  assert('Proxy: GET /categories (admin)', cats.status === 200, `status=${cats.status}`);

  // Forms
  const forms = await httpReq(FE_PORT, 'GET', '/api/v1/forms', null, t);
  assert('Proxy: GET /forms (admin)', forms.status === 200, `status=${forms.status}`);

  // Leads
  const leads = await httpReq(FE_PORT, 'GET', '/api/v1/leads', null, t);
  assert('Proxy: GET /leads (admin)', leads.status === 200, `status=${leads.status}`);

  // Lead stats
  const stats = await httpReq(FE_PORT, 'GET', '/api/v1/leads/stats', null, t);
  assert('Proxy: GET /leads/stats', stats.status === 200, `status=${stats.status}`);

  // Lead export (CSV)
  const csv = await httpReq(FE_PORT, 'GET', '/api/v1/leads/export', null, t);
  assert('Proxy: GET /leads/export (CSV)', csv.status === 200, `status=${csv.status}`);
  assert('Proxy: CSV Content-Type', (csv.headers['content-type'] || '').includes('text/csv'),
    `ct=${csv.headers['content-type']}`);

  // Reviews
  const reviews = await httpReq(FE_PORT, 'GET', '/api/v1/reviews', null, t);
  assert('Proxy: GET /reviews', reviews.status === 200, `status=${reviews.status}`);

  // Discussions
  const discussions = await httpReq(FE_PORT, 'GET', '/api/v1/discussions', null, t);
  assert('Proxy: GET /discussions', discussions.status === 200, `status=${discussions.status}`);

  // SEO
  const seo = await httpReq(FE_PORT, 'GET', '/api/v1/seo', null, t);
  assert('Proxy: GET /seo', seo.status === 200, `status=${seo.status}`);

  // Pages
  const pages = await httpReq(FE_PORT, 'GET', '/api/v1/pages', null, t);
  assert('Proxy: GET /pages (admin)', pages.status === 200, `status=${pages.status}`);

  // Submissions
  const subs = await httpReq(FE_PORT, 'GET', '/api/v1/submissions', null, t);
  assert('Proxy: GET /submissions', subs.status === 200, `status=${subs.status}`);

  // Dashboard
  const dash = await httpReq(FE_PORT, 'GET', '/api/v1/dashboard/stats', null, t);
  assert('Proxy: GET /dashboard/stats', dash.status === 200, `status=${dash.status}`);

  const pipeline = await httpReq(FE_PORT, 'GET', '/api/v1/dashboard/pipeline', null, t);
  assert('Proxy: GET /dashboard/pipeline', pipeline.status === 200, `status=${pipeline.status}`);

  const activity = await httpReq(FE_PORT, 'GET', '/api/v1/dashboard/activity', null, t);
  assert('Proxy: GET /dashboard/activity', activity.status === 200, `status=${activity.status}`);

  // Site settings
  const ss = await httpReq(FE_PORT, 'GET', '/api/v1/site-settings', null, t);
  assert('Proxy: GET /site-settings', ss.status === 200, `status=${ss.status}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 9. API Proxy — CRUD Flow (create → read → update → delete via :3000)
// ═══════════════════════════════════════════════════════════════════════════════
async function testApiProxyCRUD() {
  suite('API Proxy — Full CRUD Flow (via :3000)');

  const t = state.adminToken;

  // Create college
  let res = await httpReq(FE_PORT, 'POST', '/api/v1/colleges', {
    name: `FE Proxy College ${RUN}`, type: 'private',
    location: { city: 'Test City', state: 'Test State' },
  }, t);
  assert('Proxy CRUD: create college', res.status === 201, `status=${res.status}`);
  const collegeId = res.body?.data?._id;

  // Read
  if (collegeId) {
    res = await httpReq(FE_PORT, 'GET', `/api/v1/colleges/${collegeId}`, null, t);
    assert('Proxy CRUD: read college', res.status === 200 && res.body?.data?.name === `FE Proxy College ${RUN}`);
  }

  // Update
  if (collegeId) {
    res = await httpReq(FE_PORT, 'PATCH', `/api/v1/colleges/${collegeId}`, { ranking: 42 }, t);
    assert('Proxy CRUD: update college', res.status === 200, `status=${res.status}`);
  }

  // Delete
  if (collegeId) {
    res = await httpReq(FE_PORT, 'DELETE', `/api/v1/colleges/${collegeId}`, null, t);
    assert('Proxy CRUD: delete college', res.status === 200, `status=${res.status}`);
  }

  // Create lead directly
  res = await httpReq(FE_PORT, 'POST', '/api/v1/leads', {
    name: `FE Lead ${RUN}`, email: `fe-lead-${RUN}@test.com`, phone: '1234567890',
  }, t);
  assert('Proxy CRUD: create lead', res.status === 201, `status=${res.status}`);
  const leadId = res.body?.data?._id;

  // Status change
  if (leadId) {
    res = await httpReq(FE_PORT, 'PATCH', `/api/v1/leads/${leadId}/status`, {
      status: 'contacted', note: 'FE proxy test',
    }, t);
    assert('Proxy CRUD: change lead status', res.status === 200, `status=${res.status}`);
  }

  // Add note
  if (leadId) {
    res = await httpReq(FE_PORT, 'POST', `/api/v1/leads/${leadId}/notes`, {
      content: 'Note from frontend proxy test',
    }, t);
    assert('Proxy CRUD: add lead note', res.status === 200, `status=${res.status}`);
  }

  // Delete lead
  if (leadId) {
    res = await httpReq(FE_PORT, 'DELETE', `/api/v1/leads/${leadId}`, null, t);
    assert('Proxy CRUD: delete lead', res.status === 200, `status=${res.status}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 10. API Proxy — Error Handling
// ═══════════════════════════════════════════════════════════════════════════════
async function testApiProxyErrors() {
  suite('API Proxy — Error Handling');

  // Unauthenticated → 401
  const unauth = await httpReq(FE_PORT, 'GET', '/api/v1/users', null, null);
  assert('Proxy: 401 without token', unauth.status === 401, `status=${unauth.status}`);

  // Invalid token → 401
  const badToken = await httpReq(FE_PORT, 'GET', '/api/v1/users', null, 'invalid.token.here');
  assert('Proxy: 401 with bad token', badToken.status === 401, `status=${badToken.status}`);

  // Non-existent API route → 404
  const notFound = await httpReq(FE_PORT, 'GET', '/api/v1/nonexistent', null, state.adminToken);
  assert('Proxy: 404 on unknown API route', notFound.status === 404, `status=${notFound.status}`);

  // Invalid ObjectId → 400/404
  const badId = await httpReq(FE_PORT, 'GET', '/api/v1/colleges/bad-id', null, state.adminToken);
  assert('Proxy: bad ObjectId handled', badId.status === 400 || badId.status === 404, `status=${badId.status}`);

  // Validation error via proxy
  const valErr = await httpPost(FE_PORT, '/api/v1/auth/register', { firstName: 'X' });
  assert('Proxy: validation error 400', valErr.status === 400, `status=${valErr.status}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 11. SPA Fallback — unknown routes still serve the SPA
// ═══════════════════════════════════════════════════════════════════════════════
async function testSPAFallback() {
  suite('SPA Fallback (unknown routes → SPA shell)');

  const unknownPaths = [
    '/unknown-page',
    '/some/deeply/nested/path',
    '/admin/unknown-section',
    '/colleges/does-not-exist/extra',
  ];

  for (const p of unknownPaths) {
    const res = await httpGet(FE_PORT, p);
    assert(`GET ${p} → 200 + SPA`, res.status === 200 && res.body.includes('id="root"'),
      `status=${res.status}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 12. Cleanup
// ═══════════════════════════════════════════════════════════════════════════════
async function testCleanup() {
  suite('Cleanup');

  // Delete registered test user
  if (state.feTestEmail && state.adminToken) {
    const res = await httpReq(FE_PORT, 'GET', `/api/v1/users?search=${state.feTestEmail}`, null, state.adminToken);
    const users = res.body?.data?.docs || res.body?.data;
    const testUser = Array.isArray(users) ? users.find(u => u.email === state.feTestEmail) : null;
    if (testUser) {
      const del = await httpReq(FE_PORT, 'DELETE', `/api/v1/users/${testUser._id}`, null, state.adminToken);
      assert('Delete FE test user', del.status === 200, `status=${del.status}`);
    }
  }
}

// ─── Report ──────────────────────────────────────────────────────────────────
function generateReport() {
  const reportPath = path.join(__dirname, 'frontend-report.txt');
  const lines = [];
  lines.push('═══════════════════════════════════════════════════════════════');
  lines.push('  ReactCampus Frontend Test Report');
  lines.push(`  Generated: ${new Date().toISOString()}`);
  lines.push(`  Run ID: ${RUN}`);
  lines.push('═══════════════════════════════════════════════════════════════');
  lines.push('');
  lines.push('┌──────────────────────────────────────────────┬────────┬────────┬────────┐');
  lines.push('│ Suite                                        │ Passed │ Failed │ Total  │');
  lines.push('├──────────────────────────────────────────────┼────────┼────────┼────────┤');

  console.log('');
  console.log(`${C.bold}${'═'.repeat(72)}${C.reset}`);
  console.log(`${C.bold}  Frontend Test Summary${C.reset}  ${C.dim}(run: ${RUN})${C.reset}`);
  console.log(`${'═'.repeat(72)}`);
  console.log(`  ${'Suite'.padEnd(44)} ${'Pass'.padStart(6)} ${'Fail'.padStart(6)} ${'Total'.padStart(6)}`);
  console.log(`  ${'─'.repeat(64)}`);

  for (const s of suites) {
    const total = s.passed + s.failed;
    const icon = s.failed === 0 ? `${C.green}✓${C.reset}` : `${C.red}✗${C.reset}`;
    console.log(`  ${icon} ${s.name.padEnd(42)} ${String(s.passed).padStart(6)} ${String(s.failed).padStart(6)} ${String(total).padStart(6)}`);
    const st = s.failed === 0 ? 'PASS' : 'FAIL';
    lines.push(`│ ${(st + ' ' + s.name).padEnd(44)} │ ${String(s.passed).padStart(6)} │ ${String(s.failed).padStart(6)} │ ${String(total).padStart(6)} │`);
  }

  lines.push('├──────────────────────────────────────────────┼────────┼────────┼────────┤');
  lines.push(`│ ${'TOTAL'.padEnd(44)} │ ${String(totalPassed).padStart(6)} │ ${String(totalFailed).padStart(6)} │ ${String(totalTests).padStart(6)} │`);
  lines.push('└──────────────────────────────────────────────┴────────┴────────┴────────┘');

  console.log(`  ${'─'.repeat(64)}`);
  const tc = totalFailed === 0 ? C.green : C.red;
  console.log(`  ${tc}${'TOTAL'.padEnd(44)} ${String(totalPassed).padStart(6)} ${String(totalFailed).padStart(6)} ${String(totalTests).padStart(6)}${C.reset}`);
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
  console.log(`${C.bold}${C.cyan}ReactCampus Frontend Test Suite${C.reset}`);
  console.log(`${C.dim}Frontend: http://${HOST}:${FE_PORT}  •  Backend: http://${HOST}:${BE_PORT}${C.reset}`);
  console.log(`${C.dim}Run ID: ${RUN}  •  Time: ${new Date().toISOString()}${C.reset}`);

  try {
    await testDevServerHealth();
    await testStaticAssets();
    await testPublicPageRoutes();
    await testAuthPageRoutes();
    await testAdminPageRoutes();
    await testApiProxyPublic();
    await testApiProxyAuth();
    await testApiProxyProtected();
    await testApiProxyCRUD();
    await testApiProxyErrors();
    await testSPAFallback();
    await testCleanup();
  } catch (err) {
    console.error(`\n${C.red}FATAL ERROR:${C.reset}`, err.message || err);
    if (err.code === 'ECONNREFUSED') {
      console.error(`${C.yellow}Is the frontend (port ${FE_PORT}) and backend (port ${BE_PORT}) running?${C.reset}`);
    }
  }

  generateReport();
  console.log(`\n${totalFailed === 0 ? C.green : C.red}${totalPassed}/${totalTests} passed, ${totalFailed} failed${C.reset}`);
  process.exit(totalFailed > 0 ? 1 : 0);
}

main();
