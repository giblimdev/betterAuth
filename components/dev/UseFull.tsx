"use client";
import { Terminal, Shield, Database, Palette, Mail, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const UseFull = () => {
  const sections = [
    {
      title: "Base du Projet",
      icon: <Terminal className="w-5 h-5" />,
      items: [
        "npx create-next-app@latest",
        "npm install --save-dev typescript @types/node @types/react @types/react-dom",
        "npm install next@latest react@latest react-dom@latest",
      ],
    },
    {
      title: "Sécurité & Auth",
      icon: <Shield className="w-5 h-5" />,
      items: [
        "npm install bcryptjs jsonwebtoken cookie cookie-parser",
        "npm install @better-auth/client better-auth",
        "npm install next-auth",
      ],
    },
    {
      title: "Base de Données",
      icon: <Database className="w-5 h-5" />,
      items: [
        "npm install @prisma/client",
        "npm install prisma --save-dev",
        "npx prisma init",
        "npx prisma generate",
        "npx prisma db push",
        "npm run prisma:seed",
      ],
    },
    {
      title: "UI & Design",
      icon: <Palette className="w-5 h-5" />,
      items: [
        "npm install tailwindcss postcss autoprefixer",
        "npx shadcn@latest add 'https://21st.dev/r/minhxthanh/404-page-not-found'",
        "npx shadcn@latest add alert avatar badge button card checkbox dropdown-menu input label progress select separator sonner switch textarea tootip",
        "npm install lucide-react",
        "npm install next-themes class-variance-authority clsx tailwind-merge",
      ],
    },
    {
      title: "Formulaires & Validation",
      icon: <Key className="w-5 h-5" />,
      items: [
        "npm install react-hook-form",
        "npm install zod",
        "npm install sonner",
      ],
    },
    {
      title: "Emails",
      icon: <Mail className="w-5 h-5" />,
      items: ["npm install resend"],
    },
  ];

  const globalCommands = [
    "npm install",
    "npm run dev",
    "npm run build",
    "npm run start",
    "npm run lint",
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Configuration du Projet</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Commandes Globales</h2>
        <div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {globalCommands.map((cmd, index) => (
            <div
              key={index}
              className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md font-mono text-sm"
            >
              {cmd}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  {section.icon}
                </div>
                <CardTitle>{section.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm font-mono flex justify-between items-center"
                  >
                    <span>{item}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(item)}
                    >
                      Copier
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          Configuration Recommandée
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Prisma (prisma/schema.prisma)</h3>
            <pre className="bg-gray-800 text-gray-100 p-4 rounded-md text-sm overflow-x-auto">
              {`// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
  output   = "../lib/generated/prisma/client"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// schema.prisma

model User {
  id            String   @id @default(uuid())
  name          String?
  email         String?  @unique
  emailVerified Boolean  @default(false)
  image         String?
  role          String?  @default("user")
  lang          String?  @default("en")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  sessions Session[]
  accounts Account[]

  @@map("user")
}

model Session {
  id        String   @id @default(uuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("session")
}

model Account {
  id                    String    @id @default(uuid())
  userId                String
  accountId             String
  providerId            String
  accessToken           String?
  refreshToken          String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  idToken               String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("account")
}

model Verification {
  id         String   @id @default(uuid())
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@map("verification")
}
`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseFull;
