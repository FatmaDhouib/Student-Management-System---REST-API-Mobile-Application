import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestion des Étudiants",
  description: "Application de gestion des étudiants",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-slate-50 min-h-screen`}>
        <nav className="bg-white shadow-md p-4 mb-8">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              🎓 EduGestion
            </Link>
            <div className="space-x-4">
              <Link href="/etudiants" className="text-gray-600 hover:text-blue-600 transition-colors">Étudiants</Link>
              <Link href="/departements" className="text-gray-600 hover:text-blue-600 transition-colors">Départements</Link>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4">
          {children}
        </main>
      </body>
    </html>
  );
}
