import { Navbar } from "../organisms/Navbar"; // adjust path if needed
import SupportPanel from "../organisms/SupportPanel";
import type { ReactNode } from "react";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 container mx-auto p-6">{children}</main>

      <footer className="bg-gray-100 text-center p-4 text-sm text-gray-600">
        © {new Date().getFullYear()} LiveDrop
      </footer>

      <SupportPanel />
    </div>
  );
}
