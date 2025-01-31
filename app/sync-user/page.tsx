"use client";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { MdCheckCircle } from "react-icons/md";
import { useRouter } from "next/navigation";
import AutoSignOut from "./aside";
import Loader from "@/components/loader";

const CalculateResult = () => {
  const router = useRouter();
  const ref = typeof window !== 'undefined' ? localStorage.getItem('referralId') || 'noRef' : 'noRef';
  
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
        },
      });

      if (!response.ok) {
        throw new Error("Failed to calculate result");
      }

      return response.json();
    },
    onSuccess: () => {
      localStorage.removeItem('referralId');
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
