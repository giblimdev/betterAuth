import Link from "next/link";
import IsConnected from "@/components/layout/UserAuthDisplay";
import NavHeader from "@/components/layout/NavHeader";

export default function Header() {
  return (
    <header className="border-b py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            Mon Application
          </Link>

          <NavHeader />
        </div>
        <IsConnected />
      </div>
    </header>
  );
}
