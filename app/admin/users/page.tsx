import React from 'react';
import { getUsers } from '@/lib/actions/user-actions';
import { getCurrentUser } from '@/lib/auth/session';
import { UserManager } from '@/components/admin/UserManager';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'User Approvals & Management | NR IT CATALOG Admin',
  description: 'Approve, reject, and manage registered IT Catalog user accounts.',
};

export default async function AdminUsersPage() {
  const [users, currentUser] = await Promise.all([
    getUsers(),
    getCurrentUser(),
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-sans">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
          User Approvals & Account Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Review pending user registrations, approve worker access, and govern enterprise catalog accounts.
        </p>
      </div>

      {/* Main User Manager Component */}
      <UserManager
        initialUsers={users as any}
        currentUserId={currentUser?.id}
      />
    </div>
  );
}
