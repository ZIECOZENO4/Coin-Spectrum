import React, { Suspense } from "react";
import Investments from "./aside";
import Loader from "@/components/loader";

const Page = () => {
  return (
    <div className="bg-neutral-950">
      <Suspense fallback={<Loader className="h-80" />}>
        <Investments />
      </Suspense>
    </div>
  );
};

export default Page;
