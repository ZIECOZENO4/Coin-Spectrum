// InvestmentPage.tsx
import { FaCrown } from "react-icons/fa";

import { InvestmentPlanName } from "@prisma/client";
import NoIdFound from "./noIdFound";
import { InvestmentDetails } from "./aside";
import { getInvestmentDetails } from "@/app/_action/getAnInvestment";

async function InvestmentPage({
  searchParams,
}: {
  searchParams: { id: string | null };
}) {
  const { id } = searchParams;
  if (!id) return <NoIdFound />;
  const investment = await getInvestmentDetails(id);

  return (
    <div className="flex items-center justify-center w-full min-h-screen mb-10">
      <div className="flex flex-col items-center">
        <h2 className="sm:text-3xl mb-4 text-2xl font-bold text-center">
          Investment Detail
        </h2>
        {investment && <InvestmentDetails id={id} />}
      </div>
    </div>
  );
}

export default InvestmentPage;
export const revalidate = 0;
