import { FaCrown } from "react-icons/fa";

import { WithdrawalStatus } from "@prisma/client";
import { WithdrawalDetails } from "./aside";
import NoWithdrawalIdFound from "./nowithdrawalIdFound";
import NoData from "@/components/noData";

async function WithdrawalPage({
  searchParams,
}: {
  searchParams: { id: string | null };
}) {
  const { id } = searchParams;
  if (!id) return <NoData shortText="No Id found" />;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-[40rem] w-full mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
          Withdrawal Detail
        </h2>
        <div className="flex justify-center">
          {id && <WithdrawalDetails id={id} />}
        </div>
      </div>
    </div>
  );
}

export default WithdrawalPage;
export const revalidate = 0;
