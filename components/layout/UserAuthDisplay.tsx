// components/UserAuthDisplay.tsx
"use client";

import { useRouter } from "next/navigation"; // Import useRouter

import { authClient } from "@/lib/auth/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

// Optionnel : Définir un type pour les données utilisateur attendues de BetterAuth côté client
interface BetterAuthClientUser {
  id: string;
  email: string | null;
  name?: string | null;
  image?: string | null;
  role?: string;
}

// Le hook useSession de BetterAuth retourne typiquement data, isPending, etc.
interface BetterAuthClientSession {
  data:
    | {
        user: BetterAuthClientUser;
      }
    | undefined;
  isPending: boolean;
}

export default function UserAuthDisplay() {
  const session = authClient.useSession() as BetterAuthClientSession;
  const router = useRouter(); // Initialise le router

  const user = session.data?.user;
  const isLoading = session.isPending;

  // Gérer l'état de chargement
  // Rendre un simple élément placeholder pour éviter l'erreur React.Children.only
  // causée par Button asChild + Link
  if (isLoading) {
    return (
      // Utilisez un div simple avec des classes pour simuler la taille d'un bouton/avatar
      // Cela évite le problème Button + Link et résout l'erreur React.Children.only
      <div className="w-24 h-10 bg-gray-100 rounded-md animate-pulse">
        {/* Optionally place spinner or text here if desired, but keep it simple */}
      </div>
    );
  }

  // Gérer l'état non authentifié
  // Reste Button asChild qui rend un <a>
  if (!user) {
    return (
      <Button variant="outline" asChild>
        <Link href="/auth/sign-in">Se connecter</Link>
      </Button>
    );
  }

  // Gérer l'état authentifié
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage
            src={user.image || undefined}
            alt={user.name || "User"}
          />
          <AvatarFallback>
            {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {user.email && (
          <DropdownMenuItem className="opacity-80 cursor-default" disabled>
            {user.email}
          </DropdownMenuItem>
        )}
        {user.email && <div className="h-px bg-gray-200 my-1"></div>}

        <DropdownMenuItem asChild>
          <Link href="/user/dashboard">Tableau de bord</Link>
        </DropdownMenuItem>
        {user.role === "admin" && (
          <DropdownMenuItem asChild>
            <Link href="/admin">Administration</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={async () => {
            console.log("Attempting client-side signOut...");
            try {
              await authClient.signOut();
              console.log("Client-side signOut complete.");
            } catch (error) {
              console.error("Error during client-side signOut:", error);
            } finally {
              router.push("/auth/goodbye"); //Client-side redirection, yes we are with "use client" :)
            }
          }}
        >
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
