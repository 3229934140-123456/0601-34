import { useState } from 'react';
import {
  Plus,
  Search,
  User,
  Users,
  Shield,
  Edit2,
  Trash2,
  Eye,
  X,
  Mail,
  Calendar,
  Settings,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { mockProjectMembers, mockRolePermissions } from '../data/mockData';
import { ProjectMember, RoleType } from '../types';

export default function PermissionManagement() {
  const [activeTab, setActiveTab] = useState<'members' | 'roles'>('members');
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState<ProjectMember | null>(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [expandedRoles, setExpandedRoles] = useState<string[]>(['admin', 'tester']);

  const filteredMembers = mockProjectMembers.filter((member) => {
    const matchSearch =
      member.name.toLowerCase().includes(searchText.toLowerCase()) ||
      member.email.toLowerCase().includes(searchText.toLowerCase());
    const matchRole = roleFilter === 'all' || member.role === roleFilter;
    return matchSearch && matchRole;
  });

  const getRoleLabel = (role: RoleType) => {
    const labels = {
      admin: '管理员',
      tester: '测试工程师',
      developer: '开发人员',
      viewer: '只读用户',
    };
    return labels[role];
  };

  const getRoleColor = (role: RoleType) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-600',
      tester: 'bg-blue-100 text-blue-600',
      developer: 'bg-green-100 text-green-600',
      viewer: 'bg-gray-100 text-gray-600',
    };
    return colors[role];
  };

  const toggleRole = (role: string) => {
    setExpandedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleChangeRole = (memberId: string, newRole: RoleType) => {
    alert(`已将用户角色修改为：${getRoleLabel(newRole)}`);
  };

  const handleDisableMember = (memberId: string) => {
    alert('用户已禁用');
  };

  const stats = {
    total: mockProjectMembers.length,
    active: mockProjectMembers.filter((m) => m.status === 'active').length,
    admin: mockProjectMembers.filter((m) => m.role === 'admin').length,
    tester: mockProjectMembers.filter((m) => m.role === 'tester').length,
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">权限管理</h1>
        <button
          onClick={() => setIsAddMemberModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          添加成员
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-sm text-gray-500">项目成员</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.active}</p>
              <p className="text-sm text-gray-500">活跃成员</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.admin}</p>
              <p className="text-sm text-gray-500">管理员</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <User size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.tester}</p>
              <p className="text-sm text-gray-500">测试工程师</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 flex-1 flex flex-col min-h-0">
        <div className="border-b border-gray-100">
          <div className="flex">
            <button
              onClick={() => setActiveTab('members')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'members'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <Users size={16} />
              项目成员
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'roles'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <Shield size={16} />
              角色权限
            </button>
          </div>
        </div>

        {activeTab === 'members' && (
          <>
            <div className="p-4 border-b border-gray-100 flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索成员姓名、邮箱..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部角色</option>
                <option value="admin">管理员</option>
                <option value="tester">测试工程师</option>
                <option value="developer">开发人员</option>
                <option value="viewer">只读用户</option>
              </select>
            </div>

            <div className="flex-1 overflow-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      成员
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      邮箱
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      角色
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      加入时间
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedMember(member)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{member.name}</p>
                            <p className="text-xs text-gray-500">{getRoleLabel(member.role)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{member.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                            member.role
                          )}`}
                        >
                          {getRoleLabel(member.role)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{member.joinDate}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            member.status === 'active'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {member.status === 'active' ? (
                            <CheckCircle size={12} />
                          ) : (
                            <XCircle size={12} />
                          )}
                          {member.status === 'active' ? '活跃' : '已禁用'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMember(member);
                            }}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="查看"
                          >
                            <Eye size={14} />
                          </button>
                          <select
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              handleChangeRole(member.id, e.target.value as RoleType)
                            }
                            className="ml-1 px-2 py-1 border border-gray-200 rounded text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            defaultValue={member.role}
                          >
                            <option value="admin">管理员</option>
                            <option value="tester">测试工程师</option>
                            <option value="developer">开发人员</option>
                            <option value="viewer">只读用户</option>
                          </select>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDisableMember(member.id);
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title={member.status === 'active' ? '禁用' : '启用'}
                          >
                            {member.status === 'active' ? (
                              <XCircle size={14} />
                            ) : (
                              <CheckCircle size={14} />
                            )}
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

        {activeTab === 'roles' && (
          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-3">
              {mockRolePermissions.map((rolePerm) => {
                const isExpanded = expandedRoles.includes(rolePerm.role);
                return (
                  <div
                    key={rolePerm.role}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div
                      className="p-4 bg-gray-50 cursor-pointer flex items-center justify-between hover:bg-gray-100 transition-colors"
                      onClick={() => toggleRole(rolePerm.role)}
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronDown size={16} className="text-gray-500" />
                        ) : (
                          <ChevronRight size={16} className="text-gray-500" />
                        )}
                        <Shield size={18} className="text-blue-500" />
                        <div>
                          <h3 className="font-medium text-gray-800">{rolePerm.name}</h3>
                          <p className="text-xs text-gray-500">
                            共 {rolePerm.permissions.length} 项权限
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(
                          rolePerm.role
                        )}`}
                      >
                        {
                          mockProjectMembers.filter((m) => m.role === rolePerm.role).length
                        }{' '}
                        人
                      </span>
                    </div>

                    {isExpanded && (
                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                          {['用例库', '计划', '执行', '缺陷', '数据', '报告', '权限'].map(
                            (module) => {
                              const modulePerms = rolePerm.permissions.filter((p) =>
                                p.startsWith(module)
                              );
                              return (
                                <div key={module} className="bg-gray-50 rounded-lg p-3">
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                                    {module}
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {modulePerms.length > 0 ? (
                                      modulePerms.map((perm) => {
                                        const action = perm.split(':')[1];
                                        return (
                                          <span
                                            key={perm}
                                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-600 rounded text-xs"
                                          >
                                            <CheckCircle size={10} />
                                            {action}
                                          </span>
                                        );
                                      })
                                    ) : (
                                      <span className="text-xs text-gray-400">无权限</span>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">成员详情</h3>
              <button
                onClick={() => setSelectedMember(null)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-medium">
                    {selectedMember.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 text-lg">{selectedMember.name}</h4>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                      selectedMember.role
                    )}`}
                  >
                    {getRoleLabel(selectedMember.role)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-gray-600">{selectedMember.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-gray-600">加入时间：{selectedMember.joinDate}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  {selectedMember.status === 'active' ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <XCircle size={16} className="text-gray-400" />
                  )}
                  <span className="text-gray-600">
                    状态：{selectedMember.status === 'active' ? '活跃' : '已禁用'}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3">角色权限</h5>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-blue-700">
                    <strong>{getRoleLabel(selectedMember.role)}</strong> 拥有以下权限：
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {mockRolePermissions
                      .find((r) => r.role === selectedMember.role)
                      ?.permissions.slice(0, 8)
                      .map((perm) => (
                        <span
                          key={perm}
                          className="px-2 py-0.5 bg-white text-blue-600 rounded text-xs"
                        >
                          {perm}
                        </span>
                      ))}
                    <span className="px-2 py-0.5 text-blue-400 text-xs">
                      ...等更多权限
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                关闭
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                编辑角色
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddMemberModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">添加项目成员</h3>
              <button
                onClick={() => setIsAddMemberModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">成员姓名</label>
                <input
                  type="text"
                  placeholder="请输入姓名"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                <input
                  type="email"
                  placeholder="请输入邮箱"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">角色</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="admin">管理员</option>
                  <option value="tester">测试工程师</option>
                  <option value="developer">开发人员</option>
                  <option value="viewer">只读用户</option>
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setIsAddMemberModalOpen(false)}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setIsAddMemberModalOpen(false);
                  alert('成员添加成功');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
