
import { UsersTable } from '@/components/admin/users-table';

export default async function AdminUsersBalances() {

  return (
    <div className="container max-w-4xl py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Manage User Balances</h1>
        <p className="text-muted-foreground">
          Update user account balances below
        </p>
      </div>
      <UsersTable />
    </div>
  );
}
