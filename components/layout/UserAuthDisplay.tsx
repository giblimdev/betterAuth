// components/UserAuthDisplay.tsx
"use client";

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

  const user = session.data?.user;
  const isLoading = session.isPending;

  if (isLoading) {
    return (
      <div className="w-24 h-10 bg-gray-100 rounded-md animate-pulse"></div>
    );
  }

  if (!user) {
    return (
      <Button variant="outline" asChild>
        <Link href="/auth/sign-in">Se connecter</Link>
      </Button>
    );
  }

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      await fetch("/api/auth/sign-out", { method: "POST" });
      window.location.href = "/auth/goodbye";
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/auth/sign-in?error=logout_failed";
    }
  };

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
        <DropdownMenuItem onClick={handleSignOut}>
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
