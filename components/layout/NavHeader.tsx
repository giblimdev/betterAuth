import Link from "next/link";
import React from "react";

function NavHeader() {
  return (
    <nav className="hidden md:flex gap-4">
      <Link href="/features" className="hover:underline">
        Fonctionnalités
      </Link>

      <Link href="/about" className="hover:underline">
        À propos
      </Link>
      <Link href="/dev" className="hover:underline">
        Dev
      </Link>
    </nav>
  );
}

export default NavHeader;
