export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  users: {
    all: ['users'] as const,
    list: (params: Record<string, unknown>) => ['users', 'list', params] as const,
    detail: (id: string) => ['users', id] as const,
  },
  roles: {
    all: ['roles'] as const,
    list: (params: Record<string, unknown>) => ['roles', 'list', params] as const,
    detail: (id: string) => ['roles', id] as const,
  },
  permissions: {
    all: ['permissions'] as const,
  },
  colleges: {
    all: ['colleges'] as const,
    list: (params: Record<string, unknown>) => ['colleges', 'list', params] as const,
    detail: (id: string) => ['colleges', id] as const,
  },
  courses: {
    all: ['courses'] as const,
    list: (params: Record<string, unknown>) => ['courses', 'list', params] as const,
    detail: (id: string) => ['courses', id] as const,
  },
  exams: {
    all: ['exams'] as const,
    list: (params: Record<string, unknown>) => ['exams', 'list', params] as const,
    detail: (id: string) => ['exams', id] as const,
  },
  categories: {
    all: ['categories'] as const,
    list: (params: Record<string, unknown>) => ['categories', 'list', params] as const,
    detail: (id: string) => ['categories', id] as const,
  },
  contentSections: {
    all: ['content-sections'] as const,
    byCollege: (collegeId: string) => ['content-sections', 'college', collegeId] as const,
    byExam: (examId: string) => ['content-sections', 'exam', examId] as const,
    byCourse: (courseId: string) => ['content-sections', 'course', courseId] as const,
    detail: (id: string) => ['content-sections', id] as const,
  },
  forms: {
    all: ['forms'] as const,
    list: (params: Record<string, unknown>) => ['forms', 'list', params] as const,
    detail: (id: string) => ['forms', id] as const,
  },
  submissions: {
    all: ['submissions'] as const,
    list: (params: Record<string, unknown>) => ['submissions', 'list', params] as const,
    detail: (id: string) => ['submissions', id] as const,
  },
  leads: {
    all: ['leads'] as const,
    list: (params: Record<string, unknown>) => ['leads', 'list', params] as const,
    detail: (id: string) => ['leads', id] as const,
    stats: ['leads', 'stats'] as const,
  },
  reviews: {
    all: ['reviews'] as const,
    list: (params: Record<string, unknown>) => ['reviews', 'list', params] as const,
    detail: (id: string) => ['reviews', id] as const,
  },
  discussions: {
    all: ['discussions'] as const,
    list: (params: Record<string, unknown>) => ['discussions', 'list', params] as const,
    detail: (id: string) => ['discussions', id] as const,
  },
  seo: {
    all: ['seo'] as const,
    list: (params: Record<string, unknown>) => ['seo', 'list', params] as const,
    detail: (id: string) => ['seo', id] as const,
  },
  pages: {
    all: ['pages'] as const,
    list: (params: Record<string, unknown>) => ['pages', 'list', params] as const,
    detail: (id: string) => ['pages', id] as const,
  },
  contentAssignments: {
    all: ['content-assignments'] as const,
    list: (params: Record<string, unknown>) => ['content-assignments', 'list', params] as const,
    detail: (id: string) => ['content-assignments', id] as const,
  },
  siteSettings: {
    detail: ['site-settings'] as const,
  },
  dashboard: {
    stats: ['dashboard', 'stats'] as const,
    pipeline: ['dashboard', 'pipeline'] as const,
    activity: ['dashboard', 'activity'] as const,
    analytics: ['dashboard', 'analytics'] as const,
  },
  public: {
    colleges: {
      list: (params: Record<string, unknown>) => ['public', 'colleges', 'list', params] as const,
      detail: (slug: string) => ['public', 'colleges', slug] as const,
      reviews: (slug: string, params: Record<string, unknown>) => ['public', 'colleges', slug, 'reviews', params] as const,
      sections: (slug: string) => ['public', 'colleges', slug, 'sections'] as const,
      discussions: (slug: string, params: Record<string, unknown>) => ['public', 'colleges', slug, 'discussions', params] as const,
    },
    courses: {
      list: (params: Record<string, unknown>) => ['public', 'courses', 'list', params] as const,
      detail: (slug: string) => ['public', 'courses', slug] as const,
      sections: (slug: string) => ['public', 'courses', slug, 'sections'] as const,
      discussions: (slug: string, params: Record<string, unknown>) => ['public', 'courses', slug, 'discussions', params] as const,
    },
    exams: {
      list: (params: Record<string, unknown>) => ['public', 'exams', 'list', params] as const,
      detail: (slug: string) => ['public', 'exams', slug] as const,
      sections: (slug: string) => ['public', 'exams', slug, 'sections'] as const,
      discussions: (slug: string, params: Record<string, unknown>) => ['public', 'exams', slug, 'discussions', params] as const,
    },
    categories: {
      list: ['public', 'categories', 'list'] as const,
    },
    forms: {
      detail: (slug: string) => ['public', 'forms', slug] as const,
      forPage: (pageType: string, entityId?: string) => ['public', 'forms', 'for-page', pageType, entityId ?? ''] as const,
    },
    pages: {
      list: (params: Record<string, unknown>) => ['public', 'pages', 'list', params] as const,
      detail: (slug: string) => ['public', 'pages', slug] as const,
    },
    siteSettings: {
      detail: ['public', 'site-settings'] as const,
    },
    insights: ['public', 'college-insights'] as const,
  },
};
