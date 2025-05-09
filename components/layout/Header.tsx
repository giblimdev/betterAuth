import Link from "next/link";
import IsConnected from "@/components/layout/UserAuthDisplay";

export default function Header() {
  return (
    <header className="border-b py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            Mon Application
          </Link>

          <nav className="hidden md:flex gap-4">
            <Link href="/features" className="hover:underline">
              Fonctionnalités
            </Link>
            <Link href="/pricing" className="hover:underline">
              Tarifs
            </Link>
            <Link href="/about" className="hover:underline">
              À propos
            </Link>
            <Link href="/dev" className="hover:underline">
              Dev
            </Link>
          </nav>
        </div>
        <IsConnected />
      </div>
    </header>
  );
}
