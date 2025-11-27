"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import NavbarAdmin from "./NavbarAdmin";
import NavbarSiswa from "./NavbarSiswa";
import NavbarGuru from "./NavbarGuru";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return <NavbarAdmin />;
  }

  if (pathname?.startsWith("/siswa")) {
    return <NavbarSiswa />;
  }

  if (pathname?.startsWith("/guru")) {
    return <NavbarGuru />;
  }

  return <Navbar />;
}
