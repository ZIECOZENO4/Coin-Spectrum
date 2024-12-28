"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import dynamic from "next/dynamic";
import HappyEmoji from "@/public/happy-emoji.json";
import { useSearchParams } from "next/navigation";
import CountUp from "@/components/countup";

const LottieAnimation = dynamic(() => import("@/components/lottieAnimation"), {
  ssr: false,
});

const NoData = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const profitLast24Hours = searchParams.get("profit");
  if (!profitLast24Hours) {
    router.push("/dashboard");
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);
  const profit = Number(profitLast24Hours);
  return (
    <div className="container flex items-center justify-center min-h-[95dvh] md:min-h-[80dvh] max-h-[98dvh] md:max-h-[85dvh] p-4">
      <Card className="w-full">
        <CardContent className="flex flex-col items-center space-y-8">
          <div>
            <LottieAnimation animationData={HappyEmoji} largeScreenSize={500} />
          </div>
          <div className="flex flex-col items-center space-y-8">
            <h2 className="text-4xl font-bold text-center text-red-600">
              Congratulations!
            </h2>
            <p className="text-2xl text-center text-green-600">
              You made{" "}
              <CountUp
                end={profit}
                prefix="$"
                enableScrollSpy={true}
                scrollSpyDelay={200}
                className="text-2xl font-bold text-green-600"
                duration={2}
                type="dollar"
              />{" "}
              in the last 24 hours!
            </p>
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
