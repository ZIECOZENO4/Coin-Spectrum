import { getUserAuth } from "@/lib/auth/utils";
import { prisma } from "@/lib/db/prisma";
import { cookies } from "next/headers";
import Link from "next/link";

const AdminMessage = async () => {
  const { session } = await getUserAuth();
  const cookies_ = cookies();
  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="fixed top-[20%] right-4 bg-gray-300 text-red-500 px-4 py-2  text-xs rounded shadow">
      <p>You are an admin.</p>
      <Link href="/adminDashboard" className="underline">
        Click to see the admin dashboard
      </Link>
    </div>
  );
};

export default AdminMessage;
