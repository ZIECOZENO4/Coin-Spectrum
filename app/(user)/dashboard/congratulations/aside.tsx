"use client";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import dynamic from "next/dynamic";
import HappyEmoji from "@/public/happy-emoji.json";
import { useSearchParams } from "next/navigation";

const LottieAnimation = dynamic(() => import("@/components/lottieAnimation"), {
  ssr: false,
});

const NoData = ({ shortText }: { shortText?: string }) => {
  const searchParams = useSearchParams();
  const profitLast24Hours = searchParams.get("profitLast24Hours");

  return (
    <div className="container flex items-center justify-center min-h-[95dvh] md:min-h-[80dvh] max-h-[98dvh] md:max-h-[85dvh] p-4">
      <Card className="w-full">
        <CardContent className="flex flex-col items-center space-y-8">
          <div>
            <LottieAnimation animationData={HappyEmoji} largeScreenSize={300} />
          </div>
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-4xl font-bold text-center text-yellow-600">
              {shortText || "Congratulations!"}
            </h2>
            {profitLast24Hours && (
              <p className="text-2xl text-center text-green-600">
                You made ${profitLast24Hours} in the last 24 hours!
              </p>
            )}
            <Link
              href={"/dashboard"}
              className={`px-8 py-3 text-xl font-semibold ${buttonVariants()} bg-red-700 rounded-lg shadow-md max-w-md`}
            >
              Go To Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoData;
