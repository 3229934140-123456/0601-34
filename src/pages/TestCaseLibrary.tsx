import { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileText,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Tag,
  List,
  X,
  GripVertical,
} from 'lucide-react';
import { mockTestCases, mockTestGroups } from '../data/mockData';
import { TestCase, TestStep, TestGroup } from '../types';

export default function TestCaseLibrary() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['g1', 'g2', 'g3']);
  const [searchText, setSearchText] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCase, setSelectedCase] = useState<TestCase | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<TestCase | null>(null);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  const filteredCases = mockTestCases.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(searchText.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchText.toLowerCase()));
    const matchGroup = !selectedGroup || c.groupId === selectedGroup || c.groupId.startsWith(selectedGroup + '-');
    const matchPriority = priorityFilter === 'all' || c.priority === priorityFilter;
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchGroup && matchPriority && matchStatus;
  });

  const getStatusBadge = (status: TestCase['status']) => {
    const config = {
      draft: { label: '草稿', class: 'bg-gray-100 text-gray-600', icon: Clock },
      reviewing: { label: '评审中', class: 'bg-blue-100 text-blue-600', icon: AlertCircle },
      approved: { label: '已通过', class: 'bg-green-100 text-green-600', icon: CheckCircle },
      rejected: { label: '已驳回', class: 'bg-red-100 text-red-600', icon: XCircle },
    };
    const { label, class: cls, icon: Icon } = config[status];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
        <Icon size={12} />
        {label}
      </span>
    );
  };

  const getPriorityBadge = (priority: TestCase['priority']) => {
    const config = {
      high: { label: '高', class: 'bg-red-100 text-red-600' },
      medium: { label: '中', class: 'bg-yellow-100 text-yellow-700' },
      low: { label: '低', class: 'bg-green-100 text-green-600' },
    };
    const { label, class: cls } = config[priority];
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
        {label}
      </span>
    );
  };

  const renderGroupTree = (groups: TestGroup[], level = 0) => {
    return groups.map((group) => {
      const hasChildren = group.children && group.children.length > 0;
      const isExpanded = expandedGroups.includes(group.id);
      const isSelected = selectedGroup === group.id;

      return (
        <div key={group.id}>
          <div
            className={`flex items-center gap-2 px-3 py-2 cursor-pointer rounded-lg transition-colors ${
              isSelected ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'
            }`}
            style={{ paddingLeft: `${level * 16 + 12}px` }}
            onClick={() => setSelectedGroup(group.id)}
          >
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleGroup(group.id);
                }}
                className="p-0.5 hover:bg-gray-200 rounded"
              >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            )}
            {!hasChildren && <span className="w-5" />}
            {isExpanded ? <FolderOpen size={16} className="text-yellow-500" /> : <Folder size={16} className="text-yellow-500" />}
            <span className="flex-1 text-sm truncate">{group.name}</span>
            <span className="text-xs text-gray-400">{group.caseCount}</span>
          </div>
          {hasChildren && isExpanded && renderGroupTree(group.children!, level + 1)}
        </div>
      );
    });
  };

  const handleAddCase = () => {
    const newCase: TestCase = {
      id: `c${Date.now()}`,
      title: '',
      groupId: selectedGroup || 'g1',
      groupName: '',
      preconditions: '',
      steps: [{ id: `s${Date.now()}`, order: 1, action: '', expected: '' }],
      expectedResult: '',
      tags: [],
      priority: 'medium',
      status: 'draft',
      createdBy: '张经理',
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
    };
    setEditingCase(newCase);
    setIsEditModalOpen(true);
  };

  const handleEditCase = (testCase: TestCase) => {
    setEditingCase({ ...testCase, steps: [...testCase.steps] });
    setIsEditModalOpen(true);
  };

  const handleViewCase = (testCase: TestCase) => {
    setSelectedCase(testCase);
  };

  const addStep = () => {
    if (!editingCase) return;
    const newStep: TestStep = {
      id: `s${Date.now()}`,
      order: editingCase.steps.length + 1,
      action: '',
      expected: '',
    };
    setEditingCase({ ...editingCase, steps: [...editingCase.steps, newStep] });
  };

  const removeStep = (stepId: string) => {
    if (!editingCase || editingCase.steps.length <= 1) return;
    setEditingCase({
      ...editingCase,
      steps: editingCase.steps.filter((s) => s.id !== stepId).map((s, i) => ({ ...s, order: i + 1 })),
    });
  };

  const updateStep = (stepId: string, field: 'action' | 'expected', value: string) => {
    if (!editingCase) return;
    setEditingCase({
      ...editingCase,
      steps: editingCase.steps.map((s) => (s.id === stepId ? { ...s, [field]: value } : s)),
    });
  };

  const handleSubmitReview = (testCase: TestCase) => {
    alert('已提交评审');
  };

  const handleApprove = (testCase: TestCase) => {
    alert('用例已通过评审');
  };

  const handleReject = (testCase: TestCase) => {
    alert('用例已驳回');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">用例库</h1>
        <button
          onClick={handleAddCase}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          新建用例
        </button>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <div className="w-64 bg-white rounded-lg border border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-100">
            <h3 className="font-medium text-gray-700 text-sm mb-2">用例分组</h3>
            <button
              onClick={() => setSelectedGroup(null)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                !selectedGroup ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50 text-gray-600'
              }`}
            >
              全部用例
            </button>
          </div>
          <div className="flex-1 overflow-auto p-2">{renderGroupTree(mockTestGroups)}</div>
        </div>

        <div className="flex-1 bg-white rounded-lg border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索用例标题、标签..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部优先级</option>
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部状态</option>
                <option value="draft">草稿</option>
                <option value="reviewing">评审中</option>
                <option value="approved">已通过</option>
                <option value="rejected">已驳回</option>
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    用例标题
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    所属分组
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    优先级
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    创建人
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCases.map((testCase) => (
                  <tr
                    key={testCase.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewCase(testCase)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-800">{testCase.title}</span>
                      </div>
                      <div className="flex gap-1 mt-1 ml-6">
                        {testCase.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-xs"
                          >
                            <Tag size={10} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{testCase.groupName}</td>
                    <td className="px-4 py-3">{getPriorityBadge(testCase.priority)}</td>
                    <td className="px-4 py-3">{getStatusBadge(testCase.status)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{testCase.createdBy}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewCase(testCase);
                          }}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="查看"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCase(testCase);
                          }}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="编辑"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="删除"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCases.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <FileText size={48} className="mb-3 opacity-50" />
                <p>暂无匹配的用例</p>
              </div>
            )}
          </div>
        </div>

        {selectedCase && (
          <div className="w-96 bg-white rounded-lg border border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-medium text-gray-800">用例详情</h3>
              <button
                onClick={() => setSelectedCase(null)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={18} className="text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">{selectedCase.title}</h4>
                <div className="flex gap-2 flex-wrap">
                  {getPriorityBadge(selectedCase.priority)}
                  {getStatusBadge(selectedCase.status)}
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {selectedCase.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs"
                  >
                    <Tag size={12} />
                    {tag}
                  </span>
                ))}
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <AlertCircle size={14} />
                  前置条件
                </h5>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 whitespace-pre-wrap">
                  {selectedCase.preconditions || '无'}
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <List size={14} />
                  测试步骤
                </h5>
                <div className="space-y-2">
                  {selectedCase.steps.map((step) => (
                    <div key={step.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center mt-0.5">
                          {step.order}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800 mb-1">{step.action}</p>
                          <p className="text-xs text-gray-500">预期：{step.expected}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">预期结果</h5>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                  {selectedCase.expectedResult}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">创建人：</span>
                  <span className="text-gray-700">{selectedCase.createdBy}</span>
                </div>
                <div>
                  <span className="text-gray-500">评审人：</span>
                  <span className="text-gray-700">{selectedCase.reviewer || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500">创建时间：</span>
                  <span className="text-gray-700">{selectedCase.createdAt}</span>
                </div>
                <div>
                  <span className="text-gray-500">更新时间：</span>
                  <span className="text-gray-700">{selectedCase.updatedAt}</span>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-2">
              {selectedCase.status === 'draft' && (
                <button
                  onClick={() => handleSubmitReview(selectedCase)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  提交评审
                </button>
              )}
              {selectedCase.status === 'reviewing' && (
                <>
                  <button
                    onClick={() => handleApprove(selectedCase)}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                  >
                    通过
                  </button>
                  <button
                    onClick={() => handleReject(selectedCase)}
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                  >
                    驳回
                  </button>
                </>
              )}
              <button
                onClick={() => handleEditCase(selectedCase)}
                className="flex-1 px-3 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                编辑
              </button>
            </div>
          </div>
        )}
      </div>

      {isEditModalOpen && editingCase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">
                {editingCase.title ? '编辑用例' : '新建用例'}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">用例标题</label>
                <input
                  type="text"
                  value={editingCase.title}
                  onChange={(e) => setEditingCase({ ...editingCase, title: e.target.value })}
                  placeholder="请输入用例标题"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">优先级</label>
                  <select
                    value={editingCase.priority}
                    onChange={(e) =>
                      setEditingCase({
                        ...editingCase,
                        priority: e.target.value as TestCase['priority'],
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="high">高</option>
                    <option value="medium">中</option>
                    <option value="low">低</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">所属分组</label>
                  <select
                    value={editingCase.groupId}
                    onChange={(e) => setEditingCase({ ...editingCase, groupId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {mockTestGroups.flatMap((g) => [
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>,
                      ...(g.children || []).map((child) => (
                        <option key={child.id} value={child.id}>
                          {' 　'}{child.name}
                        </option>
                      )),
                    ])}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
                <input
                  type="text"
                  value={editingCase.tags.join(', ')}
                  onChange={(e) =>
                    setEditingCase({
                      ...editingCase,
                      tags: e.target.value
                        .split(',')
                        .map((t) => t.trim())
                        .filter((t) => t),
                    })
                  }
                  placeholder="多个标签用逗号分隔"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">前置条件</label>
                <textarea
                  value={editingCase.preconditions}
                  onChange={(e) => setEditingCase({ ...editingCase, preconditions: e.target.value })}
                  placeholder="请输入前置条件"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">测试步骤</label>
                  <button
                    onClick={addStep}
                    className="text-blue-600 text-sm hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus size={14} />
                    添加步骤
                  </button>
                </div>
                <div className="space-y-2">
                  {editingCase.steps.map((step) => (
                    <div key={step.id} className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg">
                      <GripVertical size={16} className="text-gray-400 mt-2 cursor-move" />
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center mt-1">
                        {step.order}
                      </span>
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={step.action}
                          onChange={(e) => updateStep(step.id, 'action', e.target.value)}
                          placeholder="操作步骤"
                          className="px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={step.expected}
                          onChange={(e) => updateStep(step.id, 'expected', e.target.value)}
                          placeholder="预期结果"
                          className="px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        onClick={() => removeStep(step.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">预期结果</label>
                <textarea
                  value={editingCase.expectedResult}
                  onChange={(e) => setEditingCase({ ...editingCase, expectedResult: e.target.value })}
                  placeholder="请输入预期结果"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  alert('保存成功');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
