// // pages/calculateResult.tsx
// "use client";
// import { useEffect } from "react";
// import { useMutation } from "@tanstack/react-query";
// import { MdCheckCircle, MdCancel } from "react-icons/md";
// import { useRouter, useSearchParams } from "next/navigation";
// import AutoSignOut from "./aside";
// import { addBaseURL } from "@/lib/addBaseUrl";
// import { Loader } from "@/components/loader";

// const CalculateResult = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const refParams = searchParams.get("ref");
//   const ref = refParams ? refParams : "noRef";
//   console.log("this is the ref in the frontend ", ref);
//   const {
//     mutateAsync: syncUser,
//     isPending,
//     isError,
//     isSuccess,
//   } = useMutation({
//     mutationKey: ["sync-user"],
//     mutationFn: async () => {
//       const response = await fetch(addBaseURL(`api/syncUser?ref=${ref}`), {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         // Include necessary data for the mutation
//       });

//       if (!response.ok) {
//         throw new Error("Failed to calculate result");
//       }

//       return response.json();
//     },
//     onSuccess: () => {
//       router.push("/dashboard");
//     },
//   });

//   useEffect(() => {
//     syncUser();
//   }, []);

//   return (
//     <div className="dark:bg-black flex items-center justify-center h-screen bg-white">
//       {isPending && <Loader />}
//       {isError && <AutoSignOut />}
//       {isSuccess && <MdCheckCircle className="text-green-500" size="150" />}
//     </div>
//   );
// };

// export default CalculateResult;

// pages/calculateResult.tsx

"use client";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { MdCheckCircle, MdCancel } from "react-icons/md";
import { useRouter, useSearchParams } from "next/navigation";
import AutoSignOut from "./aside";
import Link from "next/link";
import Loader from "@/components/loader";

const CalculateResult = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refParams = searchParams.get("ref");
  const ref = refParams ? refParams : "noRef";
  console.log("this is the ref in the frontend ", ref);
  const {
    mutateAsync: syncUser,
    isPending,
    isError,
    isSuccess,
  } = useMutation({
    mutationKey: ["sync-user"],
    mutationFn: async () => {
      const response = await fetch(`api/syncUser?ref=${ref}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to calculate result");
      }

      return response.json();
    },
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  useEffect(() => {
    syncUser();
  }, []);

  return (
    <div className="dark:bg-black flex items-center justify-center h-screen bg-white">
      {isPending && <Loader className=" flex  justify-center items-center" />}
      {isError && <AutoSignOut />}
      {isSuccess && (
        <div>
          <MdCheckCircle className="text-green-500" size="150" />
        </div>
      )}
    </div>
  );
};

export default CalculateResult;
