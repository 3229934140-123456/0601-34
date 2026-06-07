import { useState, useMemo } from 'react';
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
  Power,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TestAccount, ParameterGroup, Parameter } from '../types';

interface AccountForm {
  username: string;
  password: string;
  role: string;
  environment: string;
  description: string;
}

interface ParamGroupForm {
  name: string;
  description: string;
  parameters: Parameter[];
}

export default function TestData() {
  const {
    testAccounts,
    parameterGroups,
    addTestAccount,
    updateTestAccount,
    deleteTestAccount,
    toggleTestAccountStatus,
    addParameterGroup,
    updateParameterGroup,
    deleteParameterGroup,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'accounts' | 'parameters'>('accounts');
  const [searchText, setSearchText] = useState('');
  const [environmentFilter, setEnvironmentFilter] = useState('all');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [selectedAccount, setSelectedAccount] = useState<TestAccount | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['pg1', 'pg2']);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [accountForm, setAccountForm] = useState<AccountForm>({
    username: '',
    password: '',
    role: '',
    environment: '测试环境',
    description: '',
  });
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [paramGroupForm, setParamGroupForm] = useState<ParamGroupForm>({
    name: '',
    description: '',
    parameters: [],
  });

  const filteredAccounts = useMemo(() => {
    return testAccounts.filter((acc) => {
      const matchSearch =
        acc.username.toLowerCase().includes(searchText.toLowerCase()) ||
        acc.role.toLowerCase().includes(searchText.toLowerCase());
      const matchEnv = environmentFilter === 'all' || acc.environment === environmentFilter;
      return matchSearch && matchEnv;
    });
  }, [testAccounts, searchText, environmentFilter]);

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

  const handleOpenAddModal = () => {
    if (activeTab === 'accounts') {
      setAccountForm({
        username: '',
        password: '',
        role: '',
        environment: '测试环境',
        description: '',
      });
      setEditingAccountId(null);
    } else {
      setParamGroupForm({
        name: '',
        description: '',
        parameters: [{ id: 'p1', key: '', value: '', description: '' }],
      });
    }
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditAccount = (account: TestAccount) => {
    setAccountForm({
      username: account.username,
      password: account.password,
      role: account.role,
      environment: account.environment,
      description: account.description,
    });
    setEditingAccountId(account.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSaveAccount = () => {
    if (!accountForm.username.trim()) {
      alert('请输入用户名');
      return;
    }
    if (!accountForm.password.trim()) {
      alert('请输入密码');
      return;
    }

    if (isEditing && editingAccountId) {
      updateTestAccount(editingAccountId, {
        ...accountForm,
      });
    } else {
      addTestAccount({
        ...accountForm,
        status: 'active',
      });
    }
    setIsModalOpen(false);
  };

  const handleDeleteAccount = (account: TestAccount) => {
    if (!confirm(`确定要删除账号"${account.username}"吗？`)) return;
    deleteTestAccount(account.id);
    if (selectedAccount?.id === account.id) {
      setSelectedAccount(null);
    }
  };

  const handleToggleAccountStatus = (accountId: string) => {
    toggleTestAccountStatus(accountId);
  };

  const handleDeleteParamGroup = (groupId: string, groupName: string) => {
    if (!confirm(`确定要删除参数组"${groupName}"吗？`)) return;
    deleteParameterGroup(groupId);
  };

  const handleAddParam = () => {
    setParamGroupForm({
      ...paramGroupForm,
      parameters: [
        ...paramGroupForm.parameters,
        {
          id: `p${Date.now()}`,
          key: '',
          value: '',
          description: '',
        },
      ],
    });
  };

  const handleRemoveParam = (paramId: string) => {
    setParamGroupForm({
      ...paramGroupForm,
      parameters: paramGroupForm.parameters.filter((p) => p.id !== paramId),
    });
  };

  const handleUpdateParam = (paramId: string, field: keyof Parameter, value: string) => {
    setParamGroupForm({
      ...paramGroupForm,
      parameters: paramGroupForm.parameters.map((p) =>
        p.id === paramId ? { ...p, [field]: value } : p
      ),
    });
  };

  const handleSaveParamGroup = () => {
    if (!paramGroupForm.name.trim()) {
      alert('请输入参数组名称');
      return;
    }

    const validParams = paramGroupForm.parameters.filter((p) => p.key.trim());

    if (isEditing && editingAccountId) {
      updateParameterGroup(editingAccountId, {
        name: paramGroupForm.name,
        description: paramGroupForm.description,
        parameters: validParams,
      });
    } else {
      addParameterGroup({
        name: paramGroupForm.name,
        description: paramGroupForm.description,
        parameters: validParams,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">测试数据</h1>
        <button
          onClick={handleOpenAddModal}
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
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
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
                          <span className="text-sm text-gray-800 font-medium">
                            {account.username}
                          </span>
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
                            onClick={() => handleEditAccount(account)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="编辑"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleToggleAccountStatus(account.id)}
                            className={`p-1.5 rounded transition-colors ${
                              account.status === 'active'
                                ? 'text-gray-400 hover:text-orange-600 hover:bg-orange-50'
                                : 'text-green-400 hover:text-green-600 hover:bg-green-50'
                            }`}
                            title={account.status === 'active' ? '禁用' : '启用'}
                          >
                            <Power size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteAccount(account)}
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
              {filteredAccounts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <User size={48} className="mb-3 opacity-50" />
                  <p>暂无匹配的账号</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'parameters' && (
          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-3">
              {parameterGroups.map((group) => {
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
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAccountId(group.id);
                            setParamGroupForm({
                              name: group.name,
                              description: group.description,
                              parameters: group.parameters,
                            });
                            setIsEditing(true);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="编辑"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteParamGroup(group.id, group.name);
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="删除"
                        >
                          <Trash2 size={14} />
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
              {parameterGroups.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <Settings size={48} className="mb-3 opacity-50" />
                  <p>暂无参数组</p>
                </div>
              )}
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
                  <h4 className="font-medium text-gray-800 text-lg">
                    {selectedAccount.username}
                  </h4>
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
                    onClick={() =>
                      copyToClipboard(selectedAccount.password, 'detail-copy')
                    }
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
              <button
                onClick={() => {
                  handleEditAccount(selectedAccount);
                  setSelectedAccount(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                编辑
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">
                {isEditing
                  ? activeTab === 'accounts'
                    ? '编辑测试账号'
                    : '编辑参数组'
                  : activeTab === 'accounts'
                  ? '新增测试账号'
                  : '新增参数组'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {activeTab === 'accounts' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      用户名
                    </label>
                    <input
                      type="text"
                      placeholder="请输入用户名"
                      value={accountForm.username}
                      onChange={(e) =>
                        setAccountForm({ ...accountForm, username: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      密码
                    </label>
                    <input
                      type="text"
                      placeholder="请输入密码"
                      value={accountForm.password}
                      onChange={(e) =>
                        setAccountForm({ ...accountForm, password: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        角色
                      </label>
                      <input
                        type="text"
                        placeholder="如：管理员"
                        value={accountForm.role}
                        onChange={(e) =>
                          setAccountForm({ ...accountForm, role: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        环境
                      </label>
                      <select
                        value={accountForm.environment}
                        onChange={(e) =>
                          setAccountForm({ ...accountForm, environment: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="测试环境">测试环境</option>
                        <option value="UAT环境">UAT环境</option>
                        <option value="生产环境">生产环境</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      描述
                    </label>
                    <textarea
                      rows={3}
                      placeholder="请输入账号描述"
                      value={accountForm.description}
                      onChange={(e) =>
                        setAccountForm({ ...accountForm, description: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      参数组名称
                    </label>
                    <input
                      type="text"
                      placeholder="请输入参数组名称"
                      value={paramGroupForm.name}
                      onChange={(e) =>
                        setParamGroupForm({ ...paramGroupForm, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      描述
                    </label>
                    <textarea
                      rows={2}
                      placeholder="请输入参数组描述"
                      value={paramGroupForm.description}
                      onChange={(e) =>
                        setParamGroupForm({
                          ...paramGroupForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">参数列表</label>
                      <button
                        onClick={handleAddParam}
                        className="text-blue-600 text-sm hover:text-blue-700 flex items-center gap-1"
                      >
                        <Plus size={14} />
                        添加参数
                      </button>
                    </div>
                    <div className="space-y-2">
                      {paramGroupForm.parameters.map((param, index) => (
                        <div
                          key={param.id}
                          className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg"
                        >
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center mt-1">
                            {index + 1}
                          </span>
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              placeholder="参数名"
                              value={param.key}
                              onChange={(e) =>
                                handleUpdateParam(param.id, 'key', e.target.value)
                              }
                              className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              placeholder="参数值"
                              value={param.value}
                              onChange={(e) =>
                                handleUpdateParam(param.id, 'value', e.target.value)
                              }
                              className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              placeholder="描述（选填）"
                              value={param.description}
                              onChange={(e) =>
                                handleUpdateParam(param.id, 'description', e.target.value)
                              }
                              className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <button
                            onClick={() => handleRemoveParam(param.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={
                  activeTab === 'accounts' ? handleSaveAccount : handleSaveParamGroup
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                {isEditing ? '保存' : '创建'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
