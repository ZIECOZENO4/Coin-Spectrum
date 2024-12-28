import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="grid place-items-center pt-4">
      <SignIn
      fallbackRedirectUrl={`/sync-user`}
      forceRedirectUrl={`/sync-user`}
      />
    </main>
  );
}
