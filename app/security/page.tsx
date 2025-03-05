// app/settings/security/page.tsx (Example)
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { getUserAuth } from '@/lib/auth/utils'
import { eq } from 'drizzle-orm'
import { PinManagement } from '../(user)/dashboard/withdraw/Transactionpin/page';

async function SecuritySettingsPage() {
  const { session } = await getUserAuth();

  if (!session?.user?.id) {
    return <div>Not authenticated</div>; // Or redirect
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  const hasExistingPin = !!user?.transactionPin;

  return (
    <div>
      <h1>Security Settings</h1>
      <PinManagement hasExistingPin={hasExistingPin} />
    </div>
  );
}

export default SecuritySettingsPage;

