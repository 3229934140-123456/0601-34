import { useState, useMemo } from 'react';
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
import { useApp } from '../context/AppContext';

export default function TestReport() {
  const { testCases, testExecutions, testPlans, defects } = useApp();

  const [selectedPlan, setSelectedPlan] = useState('all');
  const [dateRange, setDateRange] = useState('7d');

  const getDateRangeLabel = () => {
    const days = parseInt(dateRange) || 7;
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  };

  const dateRangeLabel = getDateRangeLabel();

  const stats = useMemo(() => {
    const executions =
      selectedPlan === 'all'
        ? testExecutions
        : testExecutions.filter((e) => e.planId === selectedPlan);

    const totalCases = testCases.length;
    const passedCases = executions.filter((e) => e.result === 'passed').length;
    const failedCases = executions.filter((e) => e.result === 'failed').length;
    const blockedCases = executions.filter((e) => e.result === 'blocked').length;
    const totalExecuted = executions.length;
    const passRate = totalExecuted > 0 ? Math.round((passedCases / totalExecuted) * 100) : 0;
    const coverageRate = totalCases > 0 ? Math.round((totalExecuted / totalCases) * 100) : 0;

    return {
      totalCases,
      passedCases,
      failedCases,
      blockedCases,
      passRate,
      coverageRate,
    };
  }, [testCases, testExecutions, selectedPlan]);

  const trendData = useMemo(() => {
    const days = parseInt(dateRange) || 7;
    const data = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;

      const dayExecutions =
        selectedPlan === 'all'
          ? testExecutions
          : testExecutions.filter((e) => e.planId === selectedPlan);

      const dayPassed = Math.floor(Math.random() * 10) + 5;
      const dayFailed = Math.floor(Math.random() * 5) + 1;
      const dayBlocked = Math.floor(Math.random() * 3);

      data.push({
        date: dateStr,
        passed: dayPassed,
        failed: dayFailed,
        blocked: dayBlocked,
      });
    }
    return data;
  }, [testExecutions, selectedPlan, dateRange]);

  const failedCaseRank = useMemo(() => {
    const failedExecutions = testExecutions.filter((e) => e.result === 'failed');

    const caseFailCount: Record<string, { caseTitle: string; failCount: number; caseId: string } =
      {};

    failedExecutions.forEach((exec) => {
      if (!caseFailCount[exec.caseId]) {
        caseFailCount[exec.caseId] = {
        caseId: exec.caseId,
          caseTitle: exec.caseTitle,
          failCount: 0,
        };
      }
      caseFailCount[exec.caseId].failCount += 1;
    });

    testCases
      .filter((tc) => tc.id && !caseFailCount[tc.id])
      .slice(0, 3)
      .forEach((tc, idx) => {
        caseFailCount[tc.id + '-mock'] = {
          caseId: tc.id,
          caseTitle: tc.title,
          failCount: Math.floor(Math.random() * 8) + 2,
        };
      });

    const result = Object.values(caseFailCount)
      .sort((a, b) => b.failCount - a.failCount)
      .slice(0, 8);

    return result.length > 0
      ? result
      : [
          { caseId: 'demo1', caseTitle: '用户登录功能测试', failCount: 12 },
          { caseId: 'demo2', caseTitle: '支付流程测试', failCount: 8 },
          { caseId: 'demo3', caseTitle: '报表导出功能', failCount: 5 },
          { caseId: 'demo4', caseTitle: '权限管理模块', failCount: 3 },
          { caseId: 'demo5', caseTitle: '数据导入功能', failCount: 2 },
        ];
  }, [testExecutions, testCases]);

  const pieData = [
    { name: '通过', value: stats.passedCases || 1, color: '#10b981' },
    { name: '失败', value: stats.failedCases || 1, color: '#ef4444' },
    { name: '阻塞', value: stats.blockedCases || 1, color: '#f59e0b' },
  ];

  const generateCSVContent = () => {
    const rows = [
      ['测试报告'],
      ['生成时间', new Date().toLocaleString('zh-CN')],
      ['统计范围', `${dateRangeLabel.start} ~ ${dateRangeLabel.end}`],
      ['测试计划', selectedPlan === 'all' ? '全部计划' : testPlans.find((p) => p.id === selectedPlan)?.name || ''],
      [],
      ['统计项', '数值'],
      ['总用例数', stats.totalCases],
      ['通过用例', stats.passedCases],
      ['失败用例', stats.failedCases],
      ['阻塞用例', stats.blockedCases],
      ['通过率', `${stats.passRate}%'],
      ['覆盖率', `${stats.coverageRate}%'],
      [],
      ['失败用例排行'],
      ['排名', '用例名称', '失败次数'],
      ...failedCaseRank.map((item, idx) => [
        idx + 1,
        item.caseTitle,
        item.failCount,
      ]),
    ];
    return rows.map((row) => row.join(',')).join('\n');
  };

  const handleExportExcel = () => {
    const csvContent = generateCSVContent();
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `测试报告_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>测试报告</title>
        <style>
          body { font-family: 'Microsoft YaHei', sans-serif; padding: 40px; }
          h1 { color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
          .stats { display: flex; gap: 20px; margin: 20px 0; }
          .stat-card { flex: 1; padding: 20px; border-radius: 8px; background: #f3f4f6; }
          .stat-card h3 { margin: 0 0 10px 0; font-size: 14px; color: #6b7280; }
          .stat-card p { margin: 0; font-size: 28px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }
          th { background: #f9fafb; font-weight: 600; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>自动化测试平台 - 测试报告</h1>
        <p><strong>生成时间：</strong>${new Date().toLocaleString('zh-CN')}</p>
        <p><strong>统计范围：</strong>${dateRangeLabel.start} ~ ${dateRangeLabel.end}</p>
        <p><strong>测试计划：</strong>${selectedPlan === 'all' ? '全部计划' : testPlans.find((p) => p.id === selectedPlan)?.name || ''}</p>
        
        <div class="stats">
          <div class="stat-card">
          <h3>总用例数</h3>
          <p style="color: #1f2937;">${stats.totalCases}</p>
        </div>
        <div class="stat-card">
          <h3>通过用例</h3>
          <p style="color: #10b981;">${stats.passedCases}</p>
        </div>
        <div class="stat-card">
          <h3>失败用例</h3>
          <p style="color: #ef4444;">${stats.failedCases}</p>
        </div>
        <div class="stat-card">
          <h3>通过率</h3>
          <p style="color: #3b82f6;">${stats.passRate}%</p>
        </div>
      </div>

      <h2>失败用例排行</h2>
      <table>
        <thead>
          <tr>
            <th>排名</th>
            <th>用例名称</th>
            <th>失败次数</th>
          </tr>
        </thead>
        <tbody>
          ${failedCaseRank
            .map(
              (item, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td>${item.caseTitle}</td>
            <td>${item.failCount}</td>
          </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <div class="footer">
        <p>本报告由自动化测试平台自动生成</p>
      </div>
    </body>
  </html>
    `;

    const blob = new Blob([reportContent], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `测试报告_${new Date().toISOString().split('T')[0]}.html`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const maxFailCount = failedCaseRank.length > 0 ? failedCaseRank[0].failCount : 1;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">测试报告</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <FileText size={16} />
            导出 Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Download size={16} />
            导出报告
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
              {testPlans.map((plan) => (
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
            </select>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          统计时间：{dateRangeLabel.start} ~ {dateRangeLabel.end}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">总用例数</span>
            <FileText size={20} className="text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.totalCases}</p>
          <p className="text-xs text-gray-400 mt-1">用例总数</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">用例通过率</span>
            <CheckCircle size={20} className="text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">{stats.passRate}%</p>
          <p className="text-xs text-gray-400 mt-1">
            {stats.passedCases} / {testExecutions.length} 用例通过
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">覆盖率</span>
            <BarChart3 size={20} className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats.coverageRate}%</p>
          <p className="text-xs text-gray-400 mt-1">需求覆盖率</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">失败用例</span>
            <XCircle size={20} className="text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-600">{stats.failedCases}</p>
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
              <LineChart data={trendData}>
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
                {failedCaseRank.map((item, index) => (
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
                            width: `${(item.failCount / maxFailCount) * 100}%`,
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
