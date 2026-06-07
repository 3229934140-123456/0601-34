import { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit2,
  Trash2,
  Eye,
  Play,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { mockTestPlans, mockTestCases } from '../data/mockData';
import { TestPlan as TestPlanType } from '../types';

export default function TestPlanPage() {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedPlan, setSelectedPlan] = useState<TestPlanType | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [expandedPlans, setExpandedPlans] = useState<string[]>(['p1']);

  const filteredPlans = mockTestPlans.filter((plan) => {
    const matchSearch = plan.name.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = statusFilter === 'all' || plan.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || plan.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const toggleExpand = (planId: string) => {
    setExpandedPlans((prev) =>
      prev.includes(planId) ? prev.filter((id) => id !== planId) : [...prev, planId]
    );
  };

  const getStatusBadge = (status: TestPlanType['status']) => {
    const config = {
      pending: { label: '待开始', class: 'bg-gray-100 text-gray-600', icon: Clock },
      in_progress: { label: '进行中', class: 'bg-blue-100 text-blue-600', icon: Play },
      completed: { label: '已完成', class: 'bg-green-100 text-green-600', icon: CheckCircle },
    };
    const { label, class: cls, icon: Icon } = config[status];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
        <Icon size={12} />
        {label}
      </span>
    );
  };

  const getPriorityBadge = (priority: TestPlanType['priority']) => {
    const config = {
      high: { label: '高', class: 'bg-red-100 text-red-600' },
      medium: { label: '中', class: 'bg-yellow-100 text-yellow-700' },
      low: { label: '低', class: 'bg-green-100 text-green-600' },
    };
    const { label, class: cls } = config[priority];
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{label}</span>;
  };

  const getProgressPercent = (plan: TestPlanType) => {
    if (plan.caseCount === 0) return 0;
    return Math.round(((plan.passedCount + plan.failedCount + plan.blockedCount) / plan.caseCount) * 100);
  };

  const getPassRate = (plan: TestPlanType) => {
    const executed = plan.passedCount + plan.failedCount + plan.blockedCount;
    if (executed === 0) return 0;
    return Math.round((plan.passedCount / executed) * 100);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">测试计划</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          新建计划
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{mockTestPlans.length}</p>
              <p className="text-sm text-gray-500">全部计划</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {mockTestPlans.filter((p) => p.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-500">待开始</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Play size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {mockTestPlans.filter((p) => p.status === 'in_progress').length}
              </p>
              <p className="text-sm text-gray-500">进行中</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {mockTestPlans.filter((p) => p.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-500">已完成</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 flex flex-col flex-1 min-h-0">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索计划名称..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全部状态</option>
              <option value="pending">待开始</option>
              <option value="in_progress">进行中</option>
              <option value="completed">已完成</option>
            </select>
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
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {filteredPlans.map((plan) => {
            const isExpanded = expandedPlans.includes(plan.id);
            const planCases = mockTestCases.filter((c) => plan.caseIds.includes(c.id));

            return (
              <div key={plan.id} className="border-b border-gray-100 last:border-b-0">
                <div
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedPlan(plan)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(plan.id);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      <div>
                        <h3 className="font-medium text-gray-800">{plan.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar size={12} />
                            版本 {plan.version}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <User size={12} />
                            {plan.assignee}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={12} />
                            {plan.startDate} ~ {plan.endDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getPriorityBadge(plan.priority)}
                      {getStatusBadge(plan.status)}
                      <div className="w-32">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>执行进度</span>
                          <span>{getProgressPercent(plan)}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${getProgressPercent(plan)}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-32">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>通过率</span>
                          <span>{getPassRate(plan)}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full transition-all"
                            style={{ width: `${getPassRate(plan)}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-green-600 font-medium">{plan.passedCount} 通过</span>
                        <span className="text-xs text-gray-300">/</span>
                        <span className="text-xs text-red-600 font-medium">{plan.failedCount} 失败</span>
                        <span className="text-xs text-gray-300">/</span>
                        <span className="text-xs text-yellow-600 font-medium">{plan.blockedCount} 阻塞</span>
                        <span className="text-xs text-gray-300">/</span>
                        <span className="text-xs text-gray-500">{plan.caseCount} 总计</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPlan(plan);
                          }}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="查看"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
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
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="bg-gray-50 px-12 py-3">
                    <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
                    <div className="text-xs text-gray-500 mb-2">关联用例 ({planCases.length})：</div>
                    <div className="flex flex-wrap gap-2">
                      {planCases.length > 0 ? (
                        planCases.map((c) => (
                          <span
                            key={c.id}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600"
                          >
                            <AlertCircle size={12} className="text-blue-500" />
                            {c.title}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">暂未关联用例</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">{selectedPlan.name}</h3>
              <button
                onClick={() => setSelectedPlan(null)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4">
              <div className="flex items-center gap-3">
                {getPriorityBadge(selectedPlan.priority)}
                {getStatusBadge(selectedPlan.status)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">版本</p>
                  <p className="text-sm font-medium text-gray-800">{selectedPlan.version}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">负责人</p>
                  <p className="text-sm font-medium text-gray-800">{selectedPlan.assignee}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">开始日期</p>
                  <p className="text-sm font-medium text-gray-800">{selectedPlan.startDate}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">结束日期</p>
                  <p className="text-sm font-medium text-gray-800">{selectedPlan.endDate}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">计划描述</p>
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                  {selectedPlan.description}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">执行统计</p>
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedPlan.caseCount}</p>
                    <p className="text-xs text-blue-600">总用例</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-green-600">{selectedPlan.passedCount}</p>
                    <p className="text-xs text-green-600">通过</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-red-600">{selectedPlan.failedCount}</p>
                    <p className="text-xs text-red-600">失败</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-yellow-600">{selectedPlan.blockedCount}</p>
                    <p className="text-xs text-yellow-600">阻塞</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  关联用例 ({selectedPlan.caseIds.length})
                </p>
                <div className="space-y-2">
                  {mockTestCases
                    .filter((c) => selectedPlan.caseIds.includes(c.id))
                    .map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                      >
                        <AlertCircle size={14} className="text-blue-500" />
                        <span className="text-sm text-gray-700 flex-1">{c.title}</span>
                        <span className="text-xs text-gray-400">{c.groupName}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setSelectedPlan(null)}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                关闭
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                开始执行
              </button>
            </div>
          </div>
        </div>
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">新建测试计划</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">计划名称</label>
                <input
                  type="text"
                  placeholder="请输入计划名称"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">版本号</label>
                  <input
                    type="text"
                    placeholder="如 v2.0.0"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">优先级</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="high">高</option>
                    <option value="medium">中</option>
                    <option value="low">低</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">负责人</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>张经理</option>
                  <option>李测试</option>
                  <option>王测试</option>
                  <option>赵测试</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">结束日期</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">计划描述</label>
                <textarea
                  rows={3}
                  placeholder="请输入计划描述"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  alert('创建成功');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
