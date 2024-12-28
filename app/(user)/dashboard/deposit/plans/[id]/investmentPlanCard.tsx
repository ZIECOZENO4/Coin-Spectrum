// import React from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { FaStar, FaCrown, FaGem } from "react-icons/fa";
// import Link from "next/link";
// import { buttonVariants } from "@/components/ui/button";
// import { formatCurrencyNaira } from "@/lib/formatCurrency";
// import Image from "next/image";
// import NoInvestmentPlanCard from "./noinvestment";
// import { useGetAllInvestmentPlans } from "@/lib/tenstack-hooks/usefetchallinvestmentplan";

// const plans = [
//   { name: "VIP1", price: 1000, icon: FaGem, rating: 1, profitPercent: 10 },
//   { name: "VIP2", price: 2000, icon: FaGem, rating: 2, profitPercent: 20 },
//   { name: "VIP3", price: 3000, icon: FaGem, rating: 3, profitPercent: 30 },
//   { name: "VIP4", price: 4000, icon: FaGem, rating: 4, profitPercent: 40 },
//   { name: "VIP5", price: 5000, icon: FaGem, rating: 5, profitPercent: 50 },
//   { name: "VIP6", price: 6000, icon: FaGem, rating: 6, profitPercent: 60 },
//   { name: "VIP7", price: 7000, icon: FaGem, rating: 7, profitPercent: 70 },
// ];

// // Common instructions for all investment plans
// const commonInstructions = [
//   "Sign up for an account on our platform",
//   "Select the desired investment plan",
//   "Make a deposit of the corresponding investment amount",
//   "Start earning daily profits based on the selected plan",
//   "Withdraw your total profit at the end of the investment period",
// ];

// // Function to get investment plan by name
// const getInvestmentPlanByName = (name: string) => {
//   return plans.find((plan) => plan.name === name);
// };

// interface InvestmentPlanCardProps {
//   name: string;
//   imageUrl: string; // Add imageUrl prop
// }

// const InvestmentPlanCard: React.FC<InvestmentPlanCardProps> = ({
//   name,
//   imageUrl,
// }) => {
//   const investmentPlan = getInvestmentPlanByName(name);
//   if (!investmentPlan) return <NoInvestmentPlanCard />;

//   const renderStars = () => {
//     const stars = [];
//     for (let i = 0; i < investmentPlan.rating; i++) {
//       stars.push(<FaStar key={i} className="text-xs text-yellow-500" />);
//     }
//     return stars;
//   };

//   return (
//     <div className="flex flex-col lg:flex-row items-center justify-center p-4 lg:p-8">
//       <div className="hidden md:block w-full lg:w-1/2 lg:pr-4">
//         <Image
//           src={imageUrl}
//           alt={`${name} Image`}
//           width={500}
//           height={500}
//           className="object-cover w-full h-full rounded-lg shadow-lg"
//         />
//       </div>
//       <Card className="w-full lg:w-1/2 max-w-[36rem] p-4 mx-auto border-2 container border-orange-500 rounded-lg shadow-lg mt-8 lg:mt-0 lg:ml-4">
//         <CardContent className="flex flex-col items-center">
//           <div className="relative flex flex-col items-center w-full mt-8 mb-4">
//             <FaCrown className="-top-8 absolute w-16 h-16 mb-2 text-orange-500" />
//           </div>
//           <div>{renderStars()}</div>
//           <div className="w-full">
//             <div className="flex justify-between mb-2">
//               <p className="text-sm font-bold">Investment Name:</p>
//               <p className="text-sm">{name}</p>
//             </div>
//             <div className="flex justify-between mb-2">
//               <p className="text-xs font-medium">Daily Profit:</p>
//               <p className="text-xs">
//                 {formatCurrencyNaira(
//                   (investmentPlan.profitPercent / 100) * investmentPlan.price
//                 )}
//               </p>
//             </div>
//             <div className="flex justify-between mb-4">
//               <p className="text-xs font-medium">Price:</p>
//               <p className="text-xs">
//                 {formatCurrencyNaira(investmentPlan.price)}
//               </p>
//             </div>
//           </div>
//           <div className="w-full">
//             <h4 className="mb-2 text-sm font-bold">Instructions:</h4>
//             <ul className="mb-4 space-y-1 list-disc list-inside">
//               {commonInstructions.map((instruction, index) => (
//                 <li key={index} className="text-xs">
//                   {instruction}
//                 </li>
//               ))}
//             </ul>
//             <Link
//               href={`/dashboard/makePayment?name=${name}`}
//               className={`w-full max-w-md text-center ${buttonVariants()} text-white rounded-md`}
//             >
//               Invest Now
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default InvestmentPlanCard;


import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FaStar, FaCrown, FaGem } from "react-icons/fa";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { formatCurrencyNaira } from "@/lib/formatCurrency";
import Image from "next/image";
import NoInvestmentPlanCard from "./noinvestment";
import { useGetAllInvestmentPlans } from "@/lib/tenstack-hooks/usefetchallinvestmentplan";

interface InvestmentPlanCardProps {
  name: string | null;
  priceRange: string | null;
  affiliate: string | null;
  price: number;
  duration: number;
  durationDays: number;
  profitPercent: number;
  rating: number;
}

// Common instructions for all investment plans
const commonInstructions = [
  "Sign up for an account on our platform",
  "Select the desired investment plan",
  "Make a deposit of the corresponding investment amount",
  "Start earning daily profits based on the selected plan",
  "Withdraw your total profit at the end of the investment period",
];

const InvestmentPlanCard: React.FC<InvestmentPlanCardProps> = ({
  name,
  priceRange,
  affiliate,
  price,
  duration,
  durationDays,
  profitPercent,
  rating,
}) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<FaStar key={i} className="text-xs text-yellow-500" />);
    }
    return stars;
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center p-4 lg:p-8">
      <div className="hidden md:block w-full lg:w-1/2 lg:pr-4">
        <Image
          src="/"
          alt={`${name} Image`}
          width={500}
          height={500}
          className="object-cover w-full h-full rounded-lg shadow-lg"
        />
      </div>
      <Card className="w-full lg:w-1/2 max-w-[36rem] p-4 mx-auto border-2 container border-orange-500 rounded-lg shadow-lg mt-8 lg:mt-0 lg:ml-4">
        <CardContent className="flex flex-col items-center">
          <div className="relative flex flex-col items-center w-full mt-8 mb-4">
            <FaCrown className="-top-8 absolute w-16 h-16 mb-2 text-orange-500" />
          </div>
          <div>{renderStars()}</div>
          <div className="w-full">
            <div className="flex justify-between mb-2">
              <p className="text-sm font-bold">Investment Name:</p>
              <p className="text-sm">{name}</p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-xs font-medium">Daily Profit:</p>
              <p className="text-xs">
                {formatCurrencyNaira((profitPercent / 100) * price)}
              </p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-xs font-medium">Price:</p>
              <p className="text-xs">{formatCurrencyNaira(price)}</p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-xs font-medium">Price Range:</p>
              <p className="text-xs">{priceRange}</p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-xs font-medium">Duration (hours):</p>
              <p className="text-xs">{duration}</p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-xs font-medium">Duration (days):</p>
              <p className="text-xs">{durationDays}</p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-xs font-medium">Affiliate:</p>
              <p className="text-xs">{affiliate}</p>
            </div>
          </div>
          <div className="w-full">
            <h4 className="mb-2 text-sm font-bold">Instructions:</h4>
            <ul className="mb-4 space-y-1 list-disc list-inside">
              {commonInstructions.map((instruction, index) => (
                <li key={index} className="text-xs">
                  {instruction}
                </li>
              ))}
            </ul>
            <Link
              href={`/dashboard/makePayment?name=${name}`}
              className={`w-full max-w-md text-center ${buttonVariants()} text-white rounded-md`}
            >
              Invest Now
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const InvestmentPlans: React.FC = () => {
  const { data: plans, isLoading, error } = useGetAllInvestmentPlans();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading investment plans</div>;
  if (!plans || plans.length === 0) return <NoInvestmentPlanCard />;

  return (
    <div className="mx-auto">
      {plans.map((plan) => (
        <InvestmentPlanCard
          key={plan.name}
          name={plan.name}
          price={plan.price}
          profitPercent={plan.profitPercent}
          rating={plan.rating}
          priceRange={plan.priceRange}
          affiliate={plan.affiliate}
          durationDays={plan.durationDays}
          duration={plan.duration}
          // imageUrl={plan.imageUrl}
        />
      ))}
    </div>
  );
};

export default InvestmentPlans;

