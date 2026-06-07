import { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  User,
  Calendar,
  Eye,
  Edit2,
  Trash2,
  X,
  MessageSquare,
  Send,
  Bug,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Defect } from '../types';

interface NewDefectForm {
  title: string;
  description: string;
  severity: Defect['severity'];
  priority: Defect['priority'];
  assignee: string;
}

export default function DefectManagement() {
  const {
    defects,
    addDefect,
    addDefectComment,
    changeDefectStatus,
    updateDefect,
  } = useApp();

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [selectedDefectId, setSelectedDefectId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newDefect, setNewDefect] = useState<NewDefectForm>({
    title: '',
    description: '',
    severity: 'major',
    priority: 'medium',
    assignee: '陈开发',
  });

  const selectedDefect = useMemo(
    () => defects.find((d) => d.id === selectedDefectId) || null,
    [defects, selectedDefectId]
  );

  useEffect(() => {
    if (selectedDefectId && !defects.find((d) => d.id === selectedDefectId)) {
      setSelectedDefectId(null);
    }
  }, [defects, selectedDefectId]);

  const filteredDefects = useMemo(() => {
    return defects.filter((defect) => {
      const matchSearch = defect.title.toLowerCase().includes(searchText.toLowerCase());
      const matchStatus = statusFilter === 'all' || defect.status === statusFilter;
      const matchSeverity = severityFilter === 'all' || defect.severity === severityFilter;
      return matchSearch && matchStatus && matchSeverity;
    });
  }, [defects, searchText, statusFilter, severityFilter]);

  const stats = useMemo(() => ({
    total: defects.length,
    open: defects.filter((d) => d.status === 'open').length,
    inProgress: defects.filter((d) => d.status === 'in_progress').length,
    resolved: defects.filter((d) => d.status === 'resolved').length,
  }), [defects]);

  const getStatusBadge = (status: Defect['status']) => {
    const config = {
      open: { label: '待处理', class: 'bg-red-100 text-red-600', icon: AlertCircle },
      in_progress: { label: '处理中', class: 'bg-blue-100 text-blue-600', icon: Clock },
      resolved: { label: '已解决', class: 'bg-green-100 text-green-600', icon: CheckCircle },
      closed: { label: '已关闭', class: 'bg-gray-100 text-gray-600', icon: XCircle },
      reopened: { label: '重新打开', class: 'bg-orange-100 text-orange-600', icon: RotateCcw },
    };
    const { label, class: cls, icon: Icon } = config[status];
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}
      >
        <Icon size={12} />
        {label}
      </span>
    );
  };

  const getSeverityBadge = (severity: Defect['severity']) => {
    const config = {
      critical: { label: '致命', class: 'bg-red-600 text-white' },
      major: { label: '严重', class: 'bg-red-100 text-red-600' },
      minor: { label: '一般', class: 'bg-yellow-100 text-yellow-700' },
      trivial: { label: '轻微', class: 'bg-gray-100 text-gray-600' },
    };
    const { label, class: cls } = config[severity];
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{label}</span>;
  };

  const getPriorityBadge = (priority: Defect['priority']) => {
    const config = {
      high: { label: '高', class: 'bg-red-100 text-red-600' },
      medium: { label: '中', class: 'bg-yellow-100 text-yellow-700' },
      low: { label: '低', class: 'bg-green-100 text-green-600' },
    };
    const { label, class: cls } = config[priority];
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{label}</span>;
  };

  const handleCreateDefect = () => {
    if (!newDefect.title.trim()) {
      alert('请输入缺陷标题');
      return;
    }
    const created = addDefect({
      title: newDefect.title,
      description: newDefect.description,
      severity: newDefect.severity,
      priority: newDefect.priority,
      assignee: newDefect.assignee,
      reporter: '张经理',
      status: 'open',
    });
    setSelectedDefectId(created.id);
    setIsCreateModalOpen(false);
    setNewDefect({
      title: '',
      description: '',
      severity: 'major',
      priority: 'medium',
      assignee: '陈开发',
    });
  };

  const handleSendComment = () => {
    if (!newComment.trim() || !selectedDefect) return;
    addDefectComment(selectedDefect.id, {
      author: '张经理',
      content: newComment.trim(),
    });
    setNewComment('');
  };

  const handleStartProcess = () => {
    if (!selectedDefect) return;
    changeDefectStatus(selectedDefect.id, 'in_progress');
  };

  const handleResolve = () => {
    if (!selectedDefect) return;
    changeDefectStatus(selectedDefect.id, 'resolved');
  };

  const handleVerifyPass = () => {
    if (!selectedDefect) return;
    changeDefectStatus(selectedDefect.id, 'closed');
  };

  const handleReopen = () => {
    if (!selectedDefect) return;
    changeDefectStatus(selectedDefect.id, 'reopened');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">缺陷管理</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          新建缺陷
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Bug size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-sm text-gray-500">全部缺陷</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.open}</p>
              <p className="text-sm text-gray-500">待处理</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              <p className="text-sm text-gray-500">处理中</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              <p className="text-sm text-gray-500">已解决</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <div className="flex-1 bg-white rounded-lg border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="搜索缺陷标题..."
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
                <option value="open">待处理</option>
                <option value="in_progress">处理中</option>
                <option value="resolved">已解决</option>
                <option value="closed">已关闭</option>
                <option value="reopened">重新打开</option>
              </select>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部严重程度</option>
                <option value="critical">致命</option>
                <option value="major">严重</option>
                <option value="minor">一般</option>
                <option value="trivial">轻微</option>
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    缺陷标题
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    严重程度
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    优先级
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    处理人
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    创建人
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    创建时间
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDefects.map((defect) => (
                  <tr
                    key={defect.id}
                    className={`hover:bg-gray-50 cursor-pointer ${
                      selectedDefectId === defect.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedDefectId(defect.id)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={16} className="text-red-400" />
                        <span className="text-sm text-gray-800">{defect.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{getSeverityBadge(defect.severity)}</td>
                    <td className="px-4 py-3">{getStatusBadge(defect.status)}</td>
                    <td className="px-4 py-3">{getPriorityBadge(defect.priority)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{defect.assignee}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{defect.reporter}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{defect.createdAt}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDefectId(defect.id);
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredDefects.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Bug size={48} className="mb-3 opacity-50" />
                <p>暂无匹配的缺陷</p>
              </div>
            )}
          </div>
        </div>

        {selectedDefect && (
          <div className="w-96 bg-white rounded-lg border border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-medium text-gray-800">缺陷详情</h3>
              <button
                onClick={() => setSelectedDefectId(null)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">{selectedDefect.title}</h4>
                <div className="flex gap-2 flex-wrap">
                  {getSeverityBadge(selectedDefect.severity)}
                  {getStatusBadge(selectedDefect.status)}
                  {getPriorityBadge(selectedDefect.priority)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">处理人</p>
                  <p className="text-gray-700 flex items-center gap-1">
                    <User size={12} />
                    {selectedDefect.assignee}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">创建人</p>
                  <p className="text-gray-700 flex items-center gap-1">
                    <User size={12} />
                    {selectedDefect.reporter}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">创建时间</p>
                  <p className="text-gray-700 flex items-center gap-1">
                    <Calendar size={12} />
                    {selectedDefect.createdAt}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">更新时间</p>
                  <p className="text-gray-700 flex items-center gap-1">
                    <Calendar size={12} />
                    {selectedDefect.updatedAt}
                  </p>
                </div>
              </div>

              {selectedDefect.caseTitle && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-500 mb-1">关联用例</p>
                  <p className="text-sm text-blue-700">{selectedDefect.caseTitle}</p>
                </div>
              )}

              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">缺陷描述</h5>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 whitespace-pre-wrap">
                  {selectedDefect.description || '无'}
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MessageSquare size={14} />
                  评论 ({selectedDefect.comments.length})
                </h5>
                <div className="space-y-3">
                  {selectedDefect.comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{comment.author}</span>
                        <span className="text-xs text-gray-400">{comment.createdAt}</span>
                      </div>
                      <p className="text-sm text-gray-600">{comment.content}</p>
                    </div>
                  ))}
                  {selectedDefect.comments.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-2">暂无评论</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="添加评论..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newComment.trim()) {
                      handleSendComment();
                    }
                  }}
                />
                <button
                  onClick={handleSendComment}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex gap-2">
              {(selectedDefect.status === 'open' || selectedDefect.status === 'reopened') && (
                <button
                  onClick={handleStartProcess}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  开始处理
                </button>
              )}
              {selectedDefect.status === 'in_progress' && (
                <button
                  onClick={handleResolve}
                  className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                >
                  标记解决
                </button>
              )}
              {selectedDefect.status === 'resolved' && (
                <>
                  <button
                    onClick={handleVerifyPass}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                  >
                    验证通过
                  </button>
                  <button
                    onClick={handleReopen}
                    className="flex-1 px-3 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition-colors"
                  >
                    重新打开
                  </button>
                </>
              )}
              {selectedDefect.status === 'closed' && (
                <button
                  onClick={handleReopen}
                  className="flex-1 px-3 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition-colors"
                >
                  重新打开
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">新建缺陷</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">缺陷标题</label>
                <input
                  type="text"
                  placeholder="请输入缺陷标题"
                  value={newDefect.title}
                  onChange={(e) =>
                    setNewDefect({ ...newDefect, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">严重程度</label>
                  <select
                    value={newDefect.severity}
                    onChange={(e) =>
                      setNewDefect({
                        ...newDefect,
                        severity: e.target.value as Defect['severity'],
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="critical">致命</option>
                    <option value="major">严重</option>
                    <option value="minor">一般</option>
                    <option value="trivial">轻微</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">优先级</label>
                  <select
                    value={newDefect.priority}
                    onChange={(e) =>
                      setNewDefect({
                        ...newDefect,
                        priority: e.target.value as Defect['priority'],
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="high">高</option>
                    <option value="medium">中</option>
                    <option value="low">低</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">处理人</label>
                <select
                  value={newDefect.assignee}
                  onChange={(e) =>
                    setNewDefect({ ...newDefect, assignee: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option>陈开发</option>
                  <option>刘后端</option>
                  <option>赵前端</option>
                  <option>王测试</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">缺陷描述</label>
                <textarea
                  rows={5}
                  placeholder="请详细描述缺陷现象、复现步骤等"
                  value={newDefect.description}
                  onChange={(e) =>
                    setNewDefect({ ...newDefect, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
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
                onClick={handleCreateDefect}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
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
