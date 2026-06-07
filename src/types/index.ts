export interface TestCase {
  id: string;
  title: string;
  groupId: string;
  groupName: string;
  preconditions: string;
  steps: TestStep[];
  expectedResult: string;
  tags: string[];
  priority: 'high' | 'medium' | 'low';
  status: 'draft' | 'reviewing' | 'approved' | 'rejected';
  reviewer?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestStep {
  id: string;
  order: number;
  action: string;
  expected: string;
}

export interface TestGroup {
  id: string;
  name: string;
  parentId?: string;
  children?: TestGroup[];
  caseCount: number;
}

export interface TestPlan {
  id: string;
  name: string;
  version: string;
  description: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  caseCount: number;
  passedCount: number;
  failedCount: number;
  blockedCount: number;
  startDate: string;
  endDate: string;
  caseIds: string[];
  createdAt: string;
}

export interface TestExecution {
  id: string;
  planId: string;
  planName: string;
  caseId: string;
  caseTitle: string;
  executor: string;
  result: 'passed' | 'failed' | 'blocked' | 'not_run';
  actualResult: string;
  screenshots: string[];
  logs: string;
  executedAt?: string;
  duration?: number;
}

export interface Defect {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'major' | 'minor' | 'trivial';
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'reopened';
  assignee: string;
  reporter: string;
  executionId?: string;
  caseId?: string;
  caseTitle?: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  updatedAt: string;
  comments: DefectComment[];
}

export interface DefectComment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface TestAccount {
  id: string;
  username: string;
  password: string;
  role: string;
  environment: string;
  status: 'active' | 'disabled';
  description: string;
}

export interface ParameterGroup {
  id: string;
  name: string;
  parameters: Parameter[];
  description: string;
}

export interface Parameter {
  id: string;
  key: string;
  value: string;
  description: string;
}

export interface ReportData {
  totalCases: number;
  passedCases: number;
  failedCases: number;
  blockedCases: number;
  coverageRate: number;
  passRate: number;
}

export interface TrendData {
  date: string;
  passed: number;
  failed: number;
  blocked: number;
}

export interface FailedCaseRank {
  caseId: string;
  caseTitle: string;
  failCount: number;
}

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'tester' | 'developer' | 'viewer';
  avatar?: string;
  joinDate: string;
  status: 'active' | 'disabled';
}

export type RoleType = 'admin' | 'tester' | 'developer' | 'viewer';

export interface RolePermission {
  role: RoleType;
  name: string;
  permissions: string[];
}
