import { useState } from 'react';
import {
  Play,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  Image as ImageIcon,
  FileText,
  User,
  Calendar,
  X,
  ChevronRight,
} from 'lucide-react';
import { mockExecutions, mockTestPlans } from '../data/mockData';
import { TestExecution } from '../types';

export default function TestExecutionPage() {
  const [searchText, setSearchText] = useState('');
  const [resultFilter, setResultFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [selectedExecution, setSelectedExecution] = useState<TestExecution | null>(null);
  const [activeTab, setActiveTab] = useState<'detail' | 'screenshot' | 'log'>('detail');

  const filteredExecutions = mockExecutions.filter((exec) => {
    const matchSearch = exec.caseTitle.toLowerCase().includes(searchText.toLowerCase());
    const matchResult = resultFilter === 'all' || exec.result === resultFilter;
    const matchPlan = planFilter === 'all' || exec.planId === planFilter;
    return matchSearch && matchResult && matchPlan;
  });

  const getResultBadge = (result: TestExecution['result']) => {
    const config = {
      passed: { label: '通过', class: 'bg-green-100 text-green-600', icon: CheckCircle },
      failed: { label: '失败', class: 'bg-red-100 text-red-600', icon: XCircle },
      blocked: { label: '阻塞', class: 'bg-yellow-100 text-yellow-700', icon: AlertTriangle },
      not_run: { label: '未执行', class: 'bg-gray-100 text-gray-500', icon: Clock },
    };
    const { label, class: cls, icon: Icon } = config[result];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
        <Icon size={12} />
        {label}
      </span>
    );
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}分${secs}秒` : `${secs}秒`;
  };

  const stats = {
    total: mockExecutions.length,
    passed: mockExecutions.filter((e) => e.result === 'passed').length,
    failed: mockExecutions.filter((e) => e.result === 'failed').length,
    blocked: mockExecutions.filter((e) => e.result === 'blocked').length,
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">测试执行</h1>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          <Play size={16} />
          开始执行
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <FileText size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-sm text-gray-500">总执行数</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.passed}</p>
              <p className="text-sm text-gray-500">通过</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              <p className="text-sm text-gray-500">失败</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.blocked}</p>
              <p className="text-sm text-gray-500">阻塞</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <div className="flex-1 bg-white rounded-lg border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索用例标题..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部计划</option>
                {mockTestPlans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>
              <select
                value={resultFilter}
                onChange={(e) => setResultFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部结果</option>
                <option value="passed">通过</option>
                <option value="failed">失败</option>
                <option value="blocked">阻塞</option>
                <option value="not_run">未执行</option>
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
                    所属计划
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    执行结果
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    执行人
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    执行时间
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    耗时
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredExecutions.map((exec) => (
                  <tr
                    key={exec.id}
                    className={`hover:bg-gray-50 cursor-pointer ${
                      selectedExecution?.id === exec.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedExecution(exec)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-800">{exec.caseTitle}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{exec.planName}</td>
                    <td className="px-4 py-3">{getResultBadge(exec.result)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{exec.executor}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{exec.executedAt || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDuration(exec.duration)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedExecution(exec);
                        }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="查看详情"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredExecutions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <FileText size={48} className="mb-3 opacity-50" />
                <p>暂无执行记录</p>
              </div>
            )}
          </div>
        </div>

        {selectedExecution && (
          <div className="w-96 bg-white rounded-lg border border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-medium text-gray-800">执行详情</h3>
              <button
                onClick={() => setSelectedExecution(null)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <div className="border-b border-gray-100">
              <div className="flex">
                {[
                  { key: 'detail', label: '详情' },
                  { key: 'screenshot', label: '截图' },
                  { key: 'log', label: '日志' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    className={`flex-1 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.key
                        ? 'text-blue-600 border-blue-600'
                        : 'text-gray-500 border-transparent hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {activeTab === 'detail' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">{selectedExecution.caseTitle}</h4>
                    {getResultBadge(selectedExecution.result)}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">执行计划</p>
                      <p className="text-gray-700">{selectedExecution.planName}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">执行人</p>
                      <p className="text-gray-700">{selectedExecution.executor}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">执行时间</p>
                      <p className="text-gray-700">{selectedExecution.executedAt || '-'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">执行耗时</p>
                      <p className="text-gray-700">{formatDuration(selectedExecution.duration)}</p>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">实际结果</h5>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                      {selectedExecution.actualResult || '无'}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">附件</h5>
                    <div className="flex gap-2">
                      {selectedExecution.screenshots.length > 0 ? (
                        selectedExecution.screenshots.map((ss, i) => (
                          <div
                            key={i}
                            className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                            onClick={() => setActiveTab('screenshot')}
                          >
                            <ImageIcon size={20} className="text-gray-400" />
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400">无截图</span>
                      )}
                    </div>
                  </div>

                  {selectedExecution.result === 'failed' && (
                    <button className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition-colors font-medium">
                      提报缺陷
                    </button>
                  )}
                </div>
              )}

              {activeTab === 'screenshot' && (
                <div className="space-y-3">
                  {selectedExecution.screenshots.length > 0 ? (
                    selectedExecution.screenshots.map((ss, i) => (
                      <div
                        key={i}
                        className="w-full aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400"
                      >
                        <ImageIcon size={32} className="mb-2" />
                        <span className="text-xs">截图 {i + 1}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                      <ImageIcon size={48} className="mb-3 opacity-50" />
                      <p>暂无截图</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'log' && (
                <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs text-green-400 overflow-auto max-h-96 whitespace-pre-wrap">
                  {selectedExecution.logs || '暂无日志'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
