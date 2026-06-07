import { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  User,
  Settings,
  X,
  Copy,
  Check,
  Folder,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { mockTestAccounts, mockParameterGroups } from '../data/mockData';
import { TestAccount, ParameterGroup, Parameter } from '../types';

export default function TestData() {
  const [activeTab, setActiveTab] = useState<'accounts' | 'parameters'>('accounts');
  const [searchText, setSearchText] = useState('');
  const [environmentFilter, setEnvironmentFilter] = useState('all');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [selectedAccount, setSelectedAccount] = useState<TestAccount | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['pg1', 'pg2']);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredAccounts = mockTestAccounts.filter((acc) => {
    const matchSearch =
      acc.username.toLowerCase().includes(searchText.toLowerCase()) ||
      acc.role.toLowerCase().includes(searchText.toLowerCase());
    const matchEnv = environmentFilter === 'all' || acc.environment === environmentFilter;
    return matchSearch && matchEnv;
  });

  const togglePassword = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">测试数据</h1>
        <button
          onClick={() => setIsAccountModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          {activeTab === 'accounts' ? '新增账号' : '新增参数组'}
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 flex-1 flex flex-col min-h-0">
        <div className="border-b border-gray-100">
          <div className="flex">
            <button
              onClick={() => setActiveTab('accounts')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'accounts'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <User size={16} />
              测试账号
            </button>
            <button
              onClick={() => setActiveTab('parameters')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'parameters'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <Settings size={16} />
              参数组合
            </button>
          </div>
        </div>

        {activeTab === 'accounts' && (
          <>
            <div className="p-4 border-b border-gray-100 flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索账号、角色..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={environmentFilter}
                onChange={(e) => setEnvironmentFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部环境</option>
                <option value="测试环境">测试环境</option>
                <option value="UAT环境">UAT环境</option>
                <option value="生产环境">生产环境</option>
              </select>
            </div>

            <div className="flex-1 overflow-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      用户名
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      密码
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      角色
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      环境
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      描述
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAccounts.map((account) => (
                    <tr key={account.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User size={14} className="text-blue-600" />
                          </div>
                          <span className="text-sm text-gray-800 font-medium">{account.username}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 font-mono">
                            {showPasswords[account.id] ? account.password : '••••••••'}
                          </span>
                          <button
                            onClick={() => togglePassword(account.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPasswords[account.id] ? (
                              <EyeOff size={14} />
                            ) : (
                              <Eye size={14} />
                            )}
                          </button>
                          <button
                            onClick={() => copyToClipboard(account.password, account.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="复制密码"
                          >
                            {copiedId === account.id ? (
                              <Check size={14} className="text-green-500" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{account.role}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            account.environment === '生产环境'
                              ? 'bg-red-100 text-red-600'
                              : account.environment === 'UAT环境'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-600'
                          }`}
                        >
                          {account.environment}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            account.status === 'active'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {account.status === 'active' ? '启用' : '禁用'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                        {account.description}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedAccount(account)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="查看"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="编辑"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
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
            </div>
          </>
        )}

        {activeTab === 'parameters' && (
          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-3">
              {mockParameterGroups.map((group) => {
                const isExpanded = expandedGroups.includes(group.id);
                return (
                  <div
                    key={group.id}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div
                      className="p-4 bg-gray-50 cursor-pointer flex items-center justify-between hover:bg-gray-100 transition-colors"
                      onClick={() => toggleGroup(group.id)}
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronDown size={16} className="text-gray-500" />
                        ) : (
                          <ChevronRight size={16} className="text-gray-500" />
                        )}
                        <Folder size={18} className="text-yellow-500" />
                        <div>
                          <h3 className="font-medium text-gray-800">{group.name}</h3>
                          <p className="text-xs text-gray-500">{group.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {group.parameters.length} 个参数
                        </span>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="编辑"
                        >
                          <Edit2 size={14} />
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-4">
                        <table className="w-full">
                          <thead>
                            <tr className="text-xs text-gray-500 uppercase">
                              <th className="text-left pb-2 font-medium">参数名</th>
                              <th className="text-left pb-2 font-medium">参数值</th>
                              <th className="text-left pb-2 font-medium">描述</th>
                              <th className="text-right pb-2 font-medium">操作</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {group.parameters.map((param) => (
                              <tr key={param.id} className="hover:bg-gray-50">
                                <td className="py-2">
                                  <code className="text-sm text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                    {param.key}
                                  </code>
                                </td>
                                <td className="py-2">
                                  <div className="flex items-center gap-2">
                                    <code className="text-sm text-gray-700 font-mono">
                                      {param.value}
                                    </code>
                                    <button
                                      onClick={() => copyToClipboard(param.value, param.id)}
                                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                      title="复制"
                                    >
                                      {copiedId === param.id ? (
                                        <Check size={12} className="text-green-500" />
                                      ) : (
                                        <Copy size={12} />
                                      )}
                                    </button>
                                  </div>
                                </td>
                                <td className="py-2 text-sm text-gray-500">
                                  {param.description}
                                </td>
                                <td className="py-2 text-right">
                                  <button
                                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="编辑"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {selectedAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">账号详情</h3>
              <button
                onClick={() => setSelectedAccount(null)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={32} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 text-lg">{selectedAccount.username}</h4>
                  <p className="text-sm text-gray-500">{selectedAccount.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">环境</p>
                  <p className="text-sm text-gray-700">{selectedAccount.environment}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">状态</p>
                  <p className="text-sm text-gray-700">
                    {selectedAccount.status === 'active' ? '启用' : '禁用'}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">密码</p>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-gray-700 font-mono flex-1">
                    {showPasswords['detail'] ? selectedAccount.password : '••••••••'}
                  </code>
                  <button
                    onClick={() => togglePassword('detail')}
                    className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors bg-white rounded"
                  >
                    {showPasswords['detail'] ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(selectedAccount.password, 'detail-copy')}
                    className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors bg-white rounded"
                  >
                    {copiedId === 'detail-copy' ? (
                      <Check size={14} className="text-green-500" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">描述</p>
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                  {selectedAccount.description}
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setSelectedAccount(null)}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                关闭
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                编辑
              </button>
            </div>
          </div>
        </div>
      )}

      {isAccountModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">
                {activeTab === 'accounts' ? '新增测试账号' : '新增参数组'}
              </h3>
              <button
                onClick={() => setIsAccountModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {activeTab === 'accounts' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                    <input
                      type="text"
                      placeholder="请输入用户名"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                    <input
                      type="password"
                      placeholder="请输入密码"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">角色</label>
                      <input
                        type="text"
                        placeholder="如：管理员"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">环境</label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>测试环境</option>
                        <option>UAT环境</option>
                        <option>生产环境</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                    <textarea
                      rows={3}
                      placeholder="请输入账号描述"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">参数组名称</label>
                    <input
                      type="text"
                      placeholder="请输入参数组名称"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                    <textarea
                      rows={2}
                      placeholder="请输入参数组描述"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setIsAccountModalOpen(false)}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setIsAccountModalOpen(false);
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
