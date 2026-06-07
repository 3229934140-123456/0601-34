import { useState } from 'react';
import {
  Download,
  FileText,
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar,
  Filter,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  mockReportData,
  mockTrendData,
  mockFailedCaseRank,
  mockTestPlans,
} from '../data/mockData';

export default function TestReport() {
  const [selectedPlan, setSelectedPlan] = useState('all');
  const [dateRange, setDateRange] = useState('7d');

  const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#6b7280'];

  const pieData = [
    { name: '通过', value: mockReportData.passedCases, color: '#10b981' },
    { name: '失败', value: mockReportData.failedCases, color: '#ef4444' },
    { name: '阻塞', value: mockReportData.blockedCases, color: '#f59e0b' },
  ];

  const handleExport = (type: string) => {
    alert(`正在导出${type}格式报告...`);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">测试报告</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExport('Excel')}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <FileText size={16} />
            导出 Excel
          </button>
          <button
            onClick={() => handleExport('PDF')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Download size={16} />
            导出 PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全部计划</option>
              {mockTestPlans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">最近7天</option>
              <option value="14d">最近14天</option>
              <option value="30d">最近30天</option>
              <option value="custom">自定义</option>
            </select>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          统计时间：2024-01-15 ~ 2024-01-21
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">总用例数</span>
            <FileText size={20} className="text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{mockReportData.totalCases}</p>
          <p className="text-xs text-gray-400 mt-1">用例总数</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">用例通过率</span>
            <CheckCircle size={20} className="text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">{mockReportData.passRate}%</p>
          <p className="text-xs text-gray-400 mt-1">
            {mockReportData.passedCases} / {mockReportData.totalCases} 用例通过
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">覆盖率</span>
            <BarChart3 size={20} className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{mockReportData.coverageRate}%</p>
          <p className="text-xs text-gray-400 mt-1">需求覆盖率</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">失败用例</span>
            <XCircle size={20} className="text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-600">{mockReportData.failedCases}</p>
          <p className="text-xs text-gray-400 mt-1">需要关注处理</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-4 min-h-0">
        <div className="col-span-2 bg-white rounded-lg border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-medium text-gray-800 flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-500" />
              执行趋势
            </h3>
          </div>
          <div className="flex-1 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="passed"
                  name="通过"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="failed"
                  name="失败"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="blocked"
                  name="阻塞"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-medium text-gray-800 flex items-center gap-2">
              <PieChart size={18} className="text-blue-500" />
              结果分布
            </h3>
          </div>
          <div className="flex-1 p-4 flex flex-col">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 pt-2">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-3 bg-white rounded-lg border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-medium text-gray-800 flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-500" />
              失败用例排行
            </h3>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    排名
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    用例名称
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    失败次数
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    趋势
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockFailedCaseRank.map((item, index) => (
                  <tr key={item.caseId} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          index === 0
                            ? 'bg-red-100 text-red-600'
                            : index === 1
                            ? 'bg-orange-100 text-orange-600'
                            : index === 2
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">{item.caseTitle}</td>
                    <td className="px-4 py-3">
                      <span className="text-lg font-bold text-red-600">{item.failCount}</span>
                      <span className="text-xs text-gray-400 ml-1">次</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full"
                          style={{
                            width: `${(item.failCount / mockFailedCaseRank[0].failCount) * 100}%`,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
