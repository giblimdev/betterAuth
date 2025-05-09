// app/user/dashboard/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SignOutButton } from "@/components/auth/sign-out-button";

interface UserSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    emailVerified: boolean;
    image?: string | null;
    role?: string | null;
    lang?: string | null;
    createdAt: Date;
    updatedAt: Date;
    accounts?: {
      id: string;
      providerId: string;
      accountId: string;
      scope?: string | null;
      createdAt: Date;
    }[];
    sessions?: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      expiresAt: Date;
      ipAddress?: string | null;
      userAgent?: string | null;
    }[];
  };
}

export default async function DashboardPage() {
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as UserSession | null;

  if (!session?.user) {
    redirect("/");
  }

  const { user } = session;
  const lastSession = user.sessions?.[0];
  const socialAccounts = user.accounts || [];

  // Formatage des dates
  const formatDate = (date?: Date | null) =>
    date?.toLocaleDateString(user.lang || "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) || "N/A";

  // Analyse simplifiée de l'user agent
  const parseUserAgent = (ua?: string | null) => {
    if (!ua) return "Unknown";
    const browsers = ["Chrome", "Firefox", "Safari", "Edge", "Opera"];
    const os = ["Windows", "Mac", "Linux", "Android", "iOS"];

    const detectedBrowser = browsers.find((b) => ua.includes(b));
    const detectedOS = os.find((o) => ua.includes(o));

    return `${detectedBrowser || "Browser"} on ${detectedOS || "Device"}`;
  };

  // Initiales pour l'avatar
  const getInitials = (name?: string | null) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "U";

  // Gestion de la déconnexion via l'utilitaire

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.image || undefined} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {user.name || user.email || "User"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {user.role && (
                <Badge variant="outline" className="mr-2">
                  {user.role}
                </Badge>
              )}
              Member since {formatDate(user.createdAt)}
              {user.createdAt?.getTime() !== user.updatedAt?.getTime() &&
                ` (Updated on ${formatDate(user.updatedAt)})`}
            </p>
          </div>
        </div>

        {/* Bouton de déconnexion */}
        <div>
          {/* Votre contenu */}
          <SignOutButton />
        </div>
      </div>

      {/* Grille du tableau de bord */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section Profil */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-medium">Identity</h3>
              <p>User ID: {user.id}</p>
              <p>Name: {user.name || "Not provided"}</p>
              <p className="flex items-center gap-2">
                Email: {user.email}
                <Badge variant={user.emailVerified ? "default" : "secondary"}>
                  {user.emailVerified ? "Verified" : "Unverified"}
                </Badge>
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Preferences</h3>
              <p>Role: {user.role || "N/A"}</p>
              <p>Language: {user.lang?.toUpperCase() || "EN"}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Account Dates</h3>
              <p>Created: {formatDate(user.createdAt)}</p>
              <p>Last updated: {formatDate(user.updatedAt)}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Last Session</h3>
              <p>{lastSession ? formatDate(lastSession.createdAt) : "N/A"}</p>
              {lastSession?.ipAddress && (
                <p className="text-sm text-muted-foreground">
                  IP: {lastSession.ipAddress}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comptes connectés */}
        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {socialAccounts.length > 0 ? (
              socialAccounts.map((account) => (
                <div key={account.id} className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="capitalize font-medium">
                      {account.providerId}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Connected: {formatDate(account.createdAt)}
                    </p>
                    {account.scope && (
                      <p className="text-xs text-muted-foreground">
                        Permissions: {account.scope}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No connected accounts</p>
            )}
          </CardContent>
        </Card>

        {/* Activité récente */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {user.sessions?.length ? (
              <div className="space-y-4">
                {user.sessions.slice(0, 5).map((session) => (
                  <div
                    key={session.id}
                    className="flex flex-col sm:flex-row justify-between"
                  >
                    <div>
                      <p className="font-medium">
                        {formatDate(session.createdAt)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {parseUserAgent(session.userAgent)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Expires: {formatDate(session.expiresAt)}
                      </p>
                    </div>
                    {session.ipAddress && (
                      <p className="text-sm text-muted-foreground">
                        IP: {session.ipAddress}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No recent activity</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
