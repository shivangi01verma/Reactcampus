export interface ContentAssignment {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  contentType: 'college' | 'page';
  scope: 'individual' | 'category';
  contentId: string | null;
  categories: string[];
  actions: ('read' | 'update' | 'delete' | 'publish')[];
  assignedBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssignmentRequest {
  user: string;
  contentType: 'college' | 'page';
  scope: 'individual' | 'category';
  contentId?: string | null;
  categories?: string[];
  actions: string[];
}

export interface UpdateAssignmentRequest {
  contentType?: 'college' | 'page';
  scope?: 'individual' | 'category';
  contentId?: string | null;
  categories?: string[];
  actions?: string[];
}

export interface AssignmentListParams {
  page?: number;
  limit?: number;
  contentType?: string;
  user?: string;
}
