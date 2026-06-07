import { useState, useMemo } from 'react';
import {
  Download,
  FileText,
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar,
  Filter,
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import {
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

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const cleaned = dateStr.replace(/-/g, '/');
  const d = new Date(cleaned);
  if (isNaN(d.getTime())) return null;
  return d;
}

function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function TestReport() {
  const { testCases, testExecutions, testPlans } = useApp();

  const [selectedPlan, setSelectedPlan] = useState('all');
  const [dateRange, setDateRange] = useState('7d');

  const dateRangeInfo = useMemo(() => {
    const days = parseInt(dateRange) || 7;
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date();
    start.setDate(start.getDate() - days + 1);
    start.setHours(0, 0, 0, 0);
    return {
      start,
      end,
      days,
      startLabel: formatDateKey(start),
      endLabel: formatDateKey(end),
    };
  }, [dateRange]);

  const selectedPlanInfo = useMemo(() => {
    if (selectedPlan === 'all') return null;
    return testPlans.find((p) => p.id === selectedPlan) || null;
  }, [selectedPlan, testPlans]);

  const planCaseIds = useMemo(() => {
    if (!selectedPlanInfo) return null;
    return selectedPlanInfo.caseIds || [];
  }, [selectedPlanInfo]);

  const planTotalCases = useMemo(() => {
    if (!planCaseIds) return testCases.length;
    return planCaseIds.length;
  }, [planCaseIds, testCases.length]);

  const filteredExecutions = useMemo(() => {
    return testExecutions.filter((exec) => {
      if (selectedPlan !== 'all' && exec.planId !== selectedPlan) {
        return false;
      }

      const execDate = parseDate(exec.executedAt || '');
      if (!execDate) return true;

      return execDate >= dateRangeInfo.start && execDate <= dateRangeInfo.end;
    });
  }, [testExecutions, selectedPlan, dateRangeInfo.start, dateRangeInfo.end]);

  const stats = useMemo(() => {
    const totalCases = planTotalCases;
    const passedCases = filteredExecutions.filter((e) => e.result === 'passed').length;
    const failedCases = filteredExecutions.filter((e) => e.result === 'failed').length;
    const blockedCases = filteredExecutions.filter((e) => e.result === 'blocked').length;
    const totalExecuted = filteredExecutions.length;
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
  }, [planTotalCases, filteredExecutions]);

  const trendData = useMemo(() => {
    const days = dateRangeInfo.days;
    const data = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const executionsByDate: Record<string, { passed: number; failed: number; blocked: number }> = {};

    filteredExecutions.forEach((exec) => {
      const execDate = parseDate(exec.executedAt || '');
      if (!execDate) return;
      const dateKey = formatDateKey(execDate);
      if (!executionsByDate[dateKey]) {
        executionsByDate[dateKey] = { passed: 0, failed: 0, blocked: 0 };
      }
      if (exec.result === 'passed') {
        executionsByDate[dateKey].passed += 1;
      } else if (exec.result === 'failed') {
        executionsByDate[dateKey].failed += 1;
      } else if (exec.result === 'blocked') {
        executionsByDate[dateKey].blocked += 1;
      }
    });

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateKey = formatDateKey(d);
      const displayStr = `${d.getMonth() + 1}/${d.getDate()}`;

      const dayData = executionsByDate[dateKey] || { passed: 0, failed: 0, blocked: 0 };

      data.push({
        date: displayStr,
        passed: dayData.passed,
        failed: dayData.failed,
        blocked: dayData.blocked,
      });
    }

    return data;
  }, [filteredExecutions, dateRangeInfo.days]);

  const failedCaseRank = useMemo(() => {
    const failedExecutions = filteredExecutions.filter((e) => e.result === 'failed');

    const caseFailCountMap: Record<string, { caseTitle: string; failCount: number; caseId: string }> = {};

    failedExecutions.forEach((exec) => {
      if (!caseFailCountMap[exec.caseId]) {
        caseFailCountMap[exec.caseId] = {
          caseId: exec.caseId,
          caseTitle: exec.caseTitle,
          failCount: 0,
        };
      }
      caseFailCountMap[exec.caseId].failCount += 1;
    });

    const result = Object.values(caseFailCountMap)
      .sort((a, b) => b.failCount - a.failCount)
      .slice(0, 8);

    return result;
  }, [filteredExecutions]);

  const pieData = [
    { name: '通过', value: stats.passedCases, color: '#10b981' },
    { name: '失败', value: stats.failedCases, color: '#ef4444' },
    { name: '阻塞', value: stats.blockedCases, color: '#f59e0b' },
  ];

  const hasData = stats.passedCases + stats.failedCases + stats.blockedCases > 0;

  const generateCSVContent = () => {
    const planName = selectedPlan === 'all' ? '全部计划' : selectedPlanInfo?.name || '';
    const rows = [
      ['测试报告'],
      ['生成时间', new Date().toLocaleString('zh-CN')],
      ['统计范围', `${dateRangeInfo.startLabel} ~ ${dateRangeInfo.endLabel}`],
      ['测试计划', planName],
      [''],
      ['统计项', '数值'],
      ['总用例数', stats.totalCases],
      ['通过用例', stats.passedCases],
      ['失败用例', stats.failedCases],
      ['阻塞用例', stats.blockedCases],
      ['通过率', `${stats.passRate}%`],
      ['覆盖率', `${stats.coverageRate}%`],
      [''],
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
    link.setAttribute('download', `测试报告_${dateRangeInfo.endLabel}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const planName = selectedPlan === 'all' ? '全部计划' : selectedPlanInfo?.name || '';
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
    .empty { color: #9ca3af; text-align: center; padding: 40px 0; }
  </style>
</head>
<body>
  <h1>自动化测试平台 - 测试报告</h1>
  <p><strong>生成时间：</strong>${new Date().toLocaleString('zh-CN')}</p>
  <p><strong>统计范围：</strong>${dateRangeInfo.startLabel} ~ ${dateRangeInfo.endLabel}</p>
  <p><strong>测试计划：</strong>${planName}</p>
  
  <div class="stats">
    <div class="stat-card"><h3>总用例数</h3><p style="color:#1f2937">${stats.totalCases}</p></div>
    <div class="stat-card"><h3>通过用例</h3><p style="color:#10b981">${stats.passedCases}</p></div>
    <div class="stat-card"><h3>失败用例</h3><p style="color:#ef4444">${stats.failedCases}</p></div>
    <div class="stat-card"><h3>通过率</h3><p style="color:#3b82f6">${stats.passRate}%</p></div>
  </div>

  <h2>失败用例排行</h2>
  ${
    failedCaseRank.length > 0
      ? `<table><thead><tr><th>排名</th><th>用例名称</th><th>失败次数</th></tr></thead><tbody>${failedCaseRank
          .map(
            (item, idx) => `<tr><td>${idx + 1}</td><td>${item.caseTitle}</td><td>${item.failCount}</td></tr>`
          )
          .join('')}</tbody></table>`
      : '<div class="empty">暂无失败用例数据</div>'
  }

  <div class="footer"><p>本报告由自动化测试平台自动生成</p></div>
</body>
</html>
    `;

    const blob = new Blob([reportContent], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `测试报告_${dateRangeInfo.endLabel}.html`);
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
          统计时间：{dateRangeInfo.startLabel} ~ {dateRangeInfo.endLabel}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">总用例数</span>
            <FileText size={20} className="text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.totalCases}</p>
          <p className="text-xs text-gray-400 mt-1">
            {selectedPlan === 'all' ? '全库用例总数' : `${selectedPlanInfo?.name || ''} 关联`}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">用例通过率</span>
            <CheckCircle size={20} className="text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">{stats.passRate}%</p>
          <p className="text-xs text-gray-400 mt-1">
            {stats.passedCases} / {filteredExecutions.length} 用例通过
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">覆盖率</span>
            <BarChart3 size={20} className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats.coverageRate}%</p>
          <p className="text-xs text-gray-400 mt-1">
            {filteredExecutions.length} / {stats.totalCases} 已执行
          </p>
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
            {hasData ? (
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
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <AlertCircle size={40} className="mb-2 opacity-50" />
                <p className="text-sm">当前时间范围内暂无执行数据</p>
              </div>
            )}
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
              {hasData ? (
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
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <p className="text-sm">暂无数据</p>
                </div>
              )}
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
            {failedCaseRank.length > 0 ? (
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
                        <span className="text-lg font-bold text-red-600">
                          {item.failCount}
                        </span>
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
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 py-16">
                <CheckCircle size={48} className="mb-3 text-green-300" />
                <p>当前范围内暂无失败用例，表现很好！</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
