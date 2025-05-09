// utils/logOut.ts
"use server";

import { auth } from "@/lib/auth/auth";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Déconnexion côté serveur (pour Server Components/Actions)
 */
export async function serverLogOut(redirectPath: string = "/auth/goodbye") {
  try {
    // 1. Invalider la session côté serveur
    await auth.api.signOut({
      headers: Object.fromEntries(await headers()),
    });

    // 2. Nettoyer les cookies
    (
      await // 2. Nettoyer les cookies
      cookies()
    ).delete("auth_token");
    (await cookies()).delete("session_token");

    // 3. Rediriger
    redirect(redirectPath);
  } catch (error) {
    console.error("Logout failed:", error);
    redirect(`${redirectPath}?error=logout_failed`);
  }
}

/**
 * API pour la déconnexion côté client
 */
export async function createClientLogOutAction() {
  "use server";

  return async function clientLogOutAction() {
    try {
      // Réutilise la logique serveur
      await serverLogOut();
    } catch (error) {
      console.error("Client logout failed:", error);
      throw error;
    }
  };
}
