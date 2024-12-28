// import { Card, CardContent } from "@/components/ui/card";
// import { Button, buttonVariants } from "@/components/ui/button";
// import { FaAngrycreative, FaChartLine } from "react-icons/fa";
// import Link from "next/link";
// import { AngryIcon, SmileIcon } from "lucide-react";
// const NoInvestmentPlanCard: React.FC = () => {
//   return (
//     <div className=" container flex items-center justify-center">
//       <Card className="w-full max-w-[50rem] p-8 mx-auto  bg-opacity-30 backdrop-filter backdrop-blur-lg shadow-xl rounded-lg border  border-green-500">
//         <CardContent className="flex flex-col items-center">
//           <SmileIcon className=" w-8 h-8 mb-8 text-green-500" />
//           <h2 className=" mb-4 text-3xl font-bold text-center">
//             Your Payment would be await is approval by the admin.
//           </h2>
//           <p className=" mb-8 text-lg text-center">
//             it would reflect in your dashboard within 24 hours
//           </p>
//           <Link
//             href={"/dashboard"}
//             className={`px-8 py-3 text-xl font-semibold ${buttonVariants()} bg-red-700  rounded-lg shadow-md max-w-md `}
//           >
//             Go To Dashboard
//           </Link>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default NoInvestmentPlanCard;
"use client";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import dynamic from "next/dynamic";
import AngryEmoji from "@/public/angry-emoji.json";
import { ConfettiThrower } from "@/components/confetti";
const LottieAnimation = dynamic(() => import("@/components/lottieAnimation"), {
  ssr: false,
});
const NoInvestmentPlanCard: React.FC = () => {
  return (
    <div className="container flex items-center justify-center min-h-[90dvh] md:min-h-[70dvh] max-h-[90dvh] md:max-h-[70dvh] p-4">
      <Card className="w-full">
        {/* <ConfettiThrower /> */}
        <CardContent className="flex flex-col items-center space-y-8">
          <div>
            <LottieAnimation animationData={AngryEmoji} largeScreenSize={600} />
          </div>
          <div className="flex flex-col items-center space-y-4">
            <Link
              href="/dashboard"
              className={`px-8 py-3 text-xl font-semibold ${buttonVariants()} bg-red-700 animate-pulse rounded-lg shadow-md text-center`}
            >
              Go To Dashboard
            </Link>
            <h2 className="text-4xl font-bold text-center text-red-600">
              Your Are Not Allowed to Access this page
            </h2>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoInvestmentPlanCard;
