'use client';

import React, { useState, useTransition } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  UserCheck,
  UserX,
  Filter,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import {
  approveUserAction,
  rejectUserAction,
  deleteUserAction,
} from '@/lib/actions/user-actions';
import { useRouter } from 'next/navigation';

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}

interface UserManagerProps {
  initialUsers: UserItem[];
  currentUserId?: string;
}

export function UserManager({ initialUsers, currentUserId }: UserManagerProps) {
  const router = useRouter();
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);

  const pendingCount = users.filter((u) => u.status === 'PENDING').length;
  const approvedCount = users.filter((u) => u.status === 'APPROVED').length;
  const rejectedCount = users.filter((u) => u.status === 'REJECTED').length;

  const filteredUsers = users.filter((u) => {
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    const matchesSearch =
      !search.trim() ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleApprove = (userId: string) => {
    setActionError(null);
    startTransition(async () => {
      try {
        await approveUserAction(userId);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: 'APPROVED' } : u))
        );
        router.refresh();
      } catch (err: any) {
        setActionError(err.message || 'Failed to approve user.');
      }
    });
  };

  const handleReject = (userId: string) => {
    setActionError(null);
    startTransition(async () => {
      try {
        await rejectUserAction(userId);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: 'REJECTED' } : u))
        );
        router.refresh();
      } catch (err: any) {
        setActionError(err.message || 'Failed to reject user.');
      }
    });
  };

  const handleDelete = (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user account "${userName}"?`)) {
      return;
    }

    setActionError(null);
    startTransition(async () => {
      try {
        await deleteUserAction(userId);
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        router.refresh();
      } catch (err: any) {
        setActionError(err.message || 'Failed to delete user.');
      }
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#0068A5]/[0.08] text-[#0068A5] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{users.length}</div>
            <div className="text-xs text-slate-500 font-medium">Total Registered Users</div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white border border-amber-200/80 rounded-xl p-4 shadow-subtle flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-900">{pendingCount}</div>
            <div className="text-xs text-amber-700 font-medium">Pending Approval</div>
          </div>
        </div>

        {/* Approved Active Users */}
        <div className="bg-white border border-emerald-200/80 rounded-xl p-4 shadow-subtle flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-900">{approvedCount}</div>
            <div className="text-xs text-emerald-700 font-medium">Approved Users</div>
          </div>
        </div>

        {/* Rejected Users */}
        <div className="bg-white border border-rose-200/80 rounded-xl p-4 shadow-subtle flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-[#E52131] flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-rose-900">{rejectedCount}</div>
            <div className="text-xs text-rose-700 font-medium">Rejected Registrations</div>
          </div>
        </div>
      </div>

      {/* Action Error Box */}
      {actionError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-xl flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filter and Search Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9.5 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#0068A5] outline-hidden transition-colors"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-[#0068A5] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({users.length})
          </button>
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'PENDING'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60'
            }`}
          >
            <Clock className="w-3 h-3" />
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('APPROVED')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'APPROVED'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => setStatusFilter('REJECTED')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'REJECTED'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200/60'
            }`}
          >
            <XCircle className="w-3 h-3" />
            Rejected ({rejectedCount})
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">User</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Registered At</th>
                <th className="px-5 py-3.5 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((item) => {
                  const isSelf = item.id === currentUserId;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#0068A5] text-white flex items-center justify-center text-[11px] font-semibold shrink-0">
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              <span>{item.name}</span>
                              {isSelf && (
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-normal">{item.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wide ${
                            item.role === 'ADMIN'
                              ? 'bg-[#0068A5]/10 text-[#0068A5] border border-[#0068A5]/20'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {item.role === 'ADMIN' && <Shield className="w-3 h-3" />}
                          {item.role}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        {item.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Pending Approval
                          </span>
                        )}
                        {item.status === 'APPROVED' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Approved
                          </span>
                        )}
                        {item.status === 'REJECTED' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-[#E52131] border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E52131]" />
                            Rejected
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleApprove(item.id)}
                                disabled={isPending}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-2xs cursor-pointer"
                                title="Approve this user account"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleReject(item.id)}
                                disabled={isPending}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 hover:bg-rose-100 text-[#E52131] border border-rose-200 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                                title="Reject this user registration"
                              >
                                <UserX className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}

                          {item.status === 'REJECTED' && (
                            <button
                              onClick={() => handleApprove(item.id)}
                              disabled={isPending}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                              title="Re-approve this user account"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Re-Approve</span>
                            </button>
                          )}

                          {item.status === 'APPROVED' && !isSelf && item.role !== 'ADMIN' && (
                            <button
                              onClick={() => handleReject(item.id)}
                              disabled={isPending}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                              title="Revoke access and reject"
                            >
                              <UserX className="w-3.5 h-3.5" />
                              <span>Revoke</span>
                            </button>
                          )}

                          {!isSelf && (
                            <button
                              onClick={() => handleDelete(item.id, item.name)}
                              disabled={isPending}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer ml-1"
                              title="Delete user record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                    No users found matching your search or status filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
