// components/KycStatus.tsx
"use client"

import { useQuery } from "@tanstack/react-query"
import { useUser } from "@clerk/nextjs"

export default function KycStatus() {
  const { user } = useUser()
  
  const { data: kycStatus, isLoading, error } = useQuery({
    queryKey: ["kycStatus", user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/kyc/status?userId=${user?.id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch KYC status")
      }
      return response.json()
    },
    enabled: !!user?.id
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 rounded-lg bg-red-50">
        Failed to load KYC status
      </div>
    )
  }

  return (
    // <div className="p-4 rounded-lg border">
    //   <h2 className="text-xl font-semibold mb-4">KYC Status</h2>
      
    //   <div className="space-y-2">
    //     <div className="flex items-center gap-2">
    //       <span className="font-medium">Status:</span>
    //       <span className={`px-2 py-1 rounded-full text-sm ${
    //         kycStatus.status === "approved" 
    //           ? "bg-green-100 text-green-800"
    //           : kycStatus.status === "pending"
    //           ? "bg-yellow-100 text-yellow-800"
    //           : "bg-red-100 text-red-800"
    //       }`}>
    //         {kycStatus.status?.toUpperCase() || "NOT SUBMITTED"}
    //       </span>
    //     </div>

    //     {kycStatus.firstName && (
    //       <>
    //         <div>
    //           <span className="font-medium">Name:</span>
    //           {" "}{kycStatus.firstName} {kycStatus.lastName}
    //         </div>
    //         <div>
    //           <span className="font-medium">ID Type:</span>
    //           {" "}{kycStatus.idType}
    //         </div>
    //         <div>
    //           <span className="font-medium">Submitted:</span>
    //           {" "}{new Date(kycStatus.createdAt).toLocaleDateString()}
    //         </div>
    //       </>
    //     )}
    //   </div>
    // </div>

    <div className="flex items-center gap-2">
      <span className={`px-2 py-1 rounded-full text-xs ${
        kycStatus.status === "approved" 
          ? "bg-green-100 text-green-800"
          : kycStatus.status === "pending"
          ? "bg-yellow-100 text-yellow-800"
          : "bg-red-100 text-red-800"
      }`}>
        {kycStatus.status?.toUpperCase() || "NOT SUBMITTED"}
      </span>
    </div>
  )
}
