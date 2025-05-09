import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

// Composant serveur séparé
async function ServerComponent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return <div>Authenticated as {session.user?.name || "User"}</div>;
}

// Composant principal
export default async function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div>hello</div>
        {/* Utilisation du composant serveur */}
        <ServerComponent />
      </main>
    </div>
  );
}
