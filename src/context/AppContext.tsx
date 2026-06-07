import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import {
  TestCase,
  TestGroup,
  TestPlan,
  TestExecution,
  Defect,
  DefectComment,
  TestAccount,
  ParameterGroup,
  ProjectMember,
  RolePermission,
  TestStep,
} from '../types';
import {
  mockTestCases,
  mockTestGroups,
  mockTestPlans,
  mockExecutions,
  mockDefects,
  mockTestAccounts,
  mockParameterGroups,
  mockProjectMembers,
  mockRolePermissions,
} from '../data/mockData';

interface AppState {
  testCases: TestCase[];
  testGroups: TestGroup[];
  testPlans: TestPlan[];
  testExecutions: TestExecution[];
  defects: Defect[];
  testAccounts: TestAccount[];
  parameterGroups: ParameterGroup[];
  projectMembers: ProjectMember[];
  rolePermissions: RolePermission[];
}

interface AppContextType extends AppState {
  addTestCase: (testCase: Omit<TestCase, 'id' | 'createdAt' | 'updatedAt'>) => TestCase;
  updateTestCase: (id: string, updates: Partial<TestCase>) => void;
  deleteTestCase: (id: string) => void;
  submitTestCaseReview: (id: string) => void;
  approveTestCase: (id: string, reviewer: string) => void;
  rejectTestCase: (id: string, reviewer: string) => void;

  addDefect: (defect: Omit<Defect, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => Defect;
  updateDefect: (id: string, updates: Partial<Defect>) => void;
  addDefectComment: (defectId: string, comment: Omit<DefectComment, 'id' | 'createdAt'>) => void;
  changeDefectStatus: (id: string, status: Defect['status']) => void;

  addTestExecution: (execution: Omit<TestExecution, 'id'>) => TestExecution;
  updateTestExecution: (id: string, updates: Partial<TestExecution>) => void;

  addTestAccount: (account: Omit<TestAccount, 'id'>) => TestAccount;
  updateTestAccount: (id: string, updates: Partial<TestAccount>) => void;
  deleteTestAccount: (id: string) => void;
  toggleTestAccountStatus: (id: string) => void;

  addParameterGroup: (group: Omit<ParameterGroup, 'id'>) => ParameterGroup;
  updateParameterGroup: (id: string, updates: Partial<ParameterGroup>) => void;
  deleteParameterGroup: (id: string) => void;

  addProjectMember: (member: Omit<ProjectMember, 'id' | 'joinDate'>) => ProjectMember;
  updateProjectMember: (id: string, updates: Partial<ProjectMember>) => void;
  changeMemberRole: (id: string, role: ProjectMember['role']) => void;
  toggleMemberStatus: (id: string) => void;

  addTestPlan: (plan: Omit<TestPlan, 'id' | 'createdAt'>) => TestPlan;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substring(2, 11);

const getNowDate = () => new Date().toISOString().split('T')[0];
const getNowDateTime = () => new Date().toLocaleString('zh-CN');

export function AppProvider({ children }: { children: ReactNode }) {
  const [testCases, setTestCases] = useState<TestCase[]>(mockTestCases);
  const [testGroups] = useState<TestGroup[]>(mockTestGroups);
  const [testPlans, setTestPlans] = useState<TestPlan[]>(mockTestPlans);
  const [testExecutions, setTestExecutions] = useState<TestExecution[]>(mockExecutions);
  const [defects, setDefects] = useState<Defect[]>(mockDefects);
  const [testAccounts, setTestAccounts] = useState<TestAccount[]>(mockTestAccounts);
  const [parameterGroups, setParameterGroups] = useState<ParameterGroup[]>(mockParameterGroups);
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>(mockProjectMembers);
  const [rolePermissions] = useState<RolePermission[]>(mockRolePermissions);

  const addTestCase = useCallback(
    (testCase: Omit<TestCase, 'id' | 'createdAt' | 'updatedAt'>): TestCase => {
      const newCase: TestCase = {
        ...testCase,
        id: generateId(),
        createdAt: getNowDate(),
        updatedAt: getNowDate(),
      };
      setTestCases((prev) => [...prev, newCase]);
      return newCase;
    },
    []
  );

  const updateTestCase = useCallback((id: string, updates: Partial<TestCase>) => {
    setTestCases((prev) =>
      prev.map((tc) => (tc.id === id ? { ...tc, ...updates, updatedAt: getNowDate() } : tc))
    );
  }, []);

  const deleteTestCase = useCallback((id: string) => {
    setTestCases((prev) => prev.filter((tc) => tc.id !== id));
  }, []);

  const submitTestCaseReview = useCallback((id: string) => {
    setTestCases((prev) =>
      prev.map((tc) =>
        tc.id === id ? { ...tc, status: 'reviewing', updatedAt: getNowDate() } : tc
      )
    );
  }, []);

  const approveTestCase = useCallback((id: string, reviewer: string) => {
    setTestCases((prev) =>
      prev.map((tc) =>
        tc.id === id
          ? { ...tc, status: 'approved', reviewer, updatedAt: getNowDate() }
          : tc
      )
    );
  }, []);

  const rejectTestCase = useCallback((id: string, reviewer: string) => {
    setTestCases((prev) =>
      prev.map((tc) =>
        tc.id === id
          ? { ...tc, status: 'rejected', reviewer, updatedAt: getNowDate() }
          : tc
      )
    );
  }, []);

  const addDefect = useCallback(
    (defect: Omit<Defect, 'id' | 'createdAt' | 'updatedAt' | 'comments'>): Defect => {
      const newDefect: Defect = {
        ...defect,
        id: generateId(),
        createdAt: getNowDate(),
        updatedAt: getNowDate(),
        comments: [],
      };
      setDefects((prev) => [...prev, newDefect]);
      return newDefect;
    },
    []
  );

  const updateDefect = useCallback((id: string, updates: Partial<Defect>) => {
    setDefects((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates, updatedAt: getNowDate() } : d))
    );
  }, []);

  const addDefectComment = useCallback(
    (defectId: string, comment: Omit<DefectComment, 'id' | 'createdAt'>) => {
      const newComment: DefectComment = {
        ...comment,
        id: generateId(),
        createdAt: getNowDateTime(),
      };
      setDefects((prev) =>
        prev.map((d) =>
          d.id === defectId
            ? { ...d, comments: [...d.comments, newComment], updatedAt: getNowDate() }
            : d
        )
      );
    },
    []
  );

  const changeDefectStatus = useCallback((id: string, status: Defect['status']) => {
    setDefects((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status, updatedAt: getNowDate() } : d))
    );
  }, []);

  const addTestExecution = useCallback(
    (execution: Omit<TestExecution, 'id'>): TestExecution => {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      const h = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const defaultDate = `${y}-${m}-${d} ${h}:${min}:${s}`;

      const newExecution: TestExecution = {
        ...execution,
        id: generateId(),
        executedAt: execution.executedAt || defaultDate,
      };
      setTestExecutions((prev) => [...prev, newExecution]);
      return newExecution;
    },
    []
  );

  const updateTestExecution = useCallback((id: string, updates: Partial<TestExecution>) => {
    setTestExecutions((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  }, []);

  const addTestAccount = useCallback(
    (account: Omit<TestAccount, 'id'>): TestAccount => {
      const newAccount: TestAccount = {
        ...account,
        id: generateId(),
      };
      setTestAccounts((prev) => [...prev, newAccount]);
      return newAccount;
    },
    []
  );

  const updateTestAccount = useCallback((id: string, updates: Partial<TestAccount>) => {
    setTestAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  }, []);

  const deleteTestAccount = useCallback((id: string) => {
    setTestAccounts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const toggleTestAccountStatus = useCallback((id: string) => {
    setTestAccounts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: a.status === 'active' ? 'disabled' : 'active' } : a
      )
    );
  }, []);

  const addParameterGroup = useCallback(
    (group: Omit<ParameterGroup, 'id'>): ParameterGroup => {
      const newGroup: ParameterGroup = {
        ...group,
        id: generateId(),
      };
      setParameterGroups((prev) => [...prev, newGroup]);
      return newGroup;
    },
    []
  );

  const updateParameterGroup = useCallback((id: string, updates: Partial<ParameterGroup>) => {
    setParameterGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    );
  }, []);

  const deleteParameterGroup = useCallback((id: string) => {
    setParameterGroups((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const addProjectMember = useCallback(
    (member: Omit<ProjectMember, 'id' | 'joinDate'>): ProjectMember => {
      const newMember: ProjectMember = {
        ...member,
        id: generateId(),
        joinDate: getNowDate(),
      };
      setProjectMembers((prev) => [...prev, newMember]);
      return newMember;
    },
    []
  );

  const updateProjectMember = useCallback((id: string, updates: Partial<ProjectMember>) => {
    setProjectMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  }, []);

  const changeMemberRole = useCallback((id: string, role: ProjectMember['role']) => {
    setProjectMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role } : m))
    );
  }, []);

  const toggleMemberStatus = useCallback((id: string) => {
    setProjectMembers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: m.status === 'active' ? 'disabled' : 'active' } : m
      )
    );
  }, []);

  const addTestPlan = useCallback(
    (plan: Omit<TestPlan, 'id' | 'createdAt'>): TestPlan => {
      const newPlan: TestPlan = {
        ...plan,
        id: generateId(),
        createdAt: new Date().toLocaleString('zh-CN'),
      };
      setTestPlans((prev) => [...prev, newPlan]);
      return newPlan;
    },
    []
  );

  return (
    <AppContext.Provider
      value={{
        testCases,
        testGroups,
        testPlans,
        testExecutions,
        defects,
        testAccounts,
        parameterGroups,
        projectMembers,
        rolePermissions,
        addTestCase,
        updateTestCase,
        deleteTestCase,
        submitTestCaseReview,
        approveTestCase,
        rejectTestCase,
        addDefect,
        updateDefect,
        addDefectComment,
        changeDefectStatus,
        addTestExecution,
        updateTestExecution,
        addTestAccount,
        updateTestAccount,
        deleteTestAccount,
        toggleTestAccountStatus,
        addParameterGroup,
        updateParameterGroup,
        deleteParameterGroup,
        addProjectMember,
        updateProjectMember,
        changeMemberRole,
        toggleMemberStatus,
        addTestPlan,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
