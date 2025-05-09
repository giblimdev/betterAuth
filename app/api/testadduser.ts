import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(
  req: {
    method: string;
    body: { email: unknown; password: unknown; name: unknown };
  },
  res: {
    status: (arg0: number) => {
      (): unknown;
      new (): unknown;
      end: { (): unknown; new (): unknown };
      json: {
        (arg0: { user?: unknown; error?: string }): unknown;
        new (): unknown;
      };
    };
  }
) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password, name } = req.body;

  try {
    if (typeof password !== "string") {
      return res.status(400).json({ error: "Invalid password format" });
    }
    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword, // Stockage sécurisé
        accounts: {
          create: {
            type: "credentials",
            provider: "credentials",
            providerId: "credentials",
            accountId: email, // Utilise l'email comme ID
          },
        },
      },
    });

    return res.status(201).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "User already exists" });
  }
}
