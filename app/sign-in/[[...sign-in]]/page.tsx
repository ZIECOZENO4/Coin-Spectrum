// import { SignIn } from "@clerk/nextjs";

// export default function Page() {
//   return (
//     <main className="grid place-items-center pt-4">
//       <SignIn
      // fallbackRedirectUrl={`/sync-user`}
      // forceRedirectUrl={`/sync-user`}
//       />
//     </main>
//   );
// }


"use client";
import { SignIn, useSignIn } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';

export default function SignInPage() {
  const router = useRouter();
  const { isLoaded, signIn } = useSignIn();

  useEffect(() => {
    if (isLoaded && signIn.status === "complete") {
      toast.success('Sign in successful!');
      
      const timeout = setTimeout(() => {
        router.push("/sync-user");
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [signIn?.status, isLoaded, router]);

  return (
    <main className="grid place-items-center pt-4">
      <SignIn
        appearance={{
          elements: {
            rootBox: "w-full max-w-lg",
            card: "w-full"
          }
        }}
        fallbackRedirectUrl={`/sync-user`}
        forceRedirectUrl={`/sync-user`}
      />
    </main>
  );
}
