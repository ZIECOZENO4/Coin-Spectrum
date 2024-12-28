import React, { Suspense } from "react";
import Investments from "./aside";
import Loader from "@/components/loader";

const Page: React.FC = () => {
  return (
    <div>
      <Suspense fallback={<Loader className="h-80" />}>
        <Investments />
      </Suspense>
    </div>
  );
};

export default Page;
