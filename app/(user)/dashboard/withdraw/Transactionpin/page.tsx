// app/settings/security/page.tsx (Example)
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { getUserAuth } from '@/lib/auth/utils'
import { eq } from 'drizzle-orm'
import { PinManagement } from './aside';

async function TransactionPinPage() {
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
      <PinManagement hasExistingPin={hasExistingPin} />
    </div>
  );
}

export default TransactionPinPage;

