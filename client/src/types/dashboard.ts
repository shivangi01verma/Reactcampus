export interface DashboardStats {
  totalColleges: number;
  publishedColleges: number;
  totalCourses: number;
  totalExams: number;
  totalLeads: number;
  totalUsers: number;
}

export interface PipelineData {
  status: string;
  count: number;
}

export interface ActivityItem {
  type: string;
  message: string;
  timestamp: string;
  user?: string;
}
