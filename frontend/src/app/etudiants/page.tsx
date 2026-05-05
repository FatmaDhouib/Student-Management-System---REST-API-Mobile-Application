"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EtudiantCard from "@/components/EtudiantCard";

export default function EtudiantsPage() {
  const [etudiants, setEtudiants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/etudiants")
      .then((res) => res.json())
      .then((data) => {
        setEtudiants(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch students", err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Liste des Étudiants</h1>
        <Link href="/etudiants/new" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm hover:shadow">
          + Nouvel Étudiant
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : etudiants.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <p className="text-gray-500 text-lg">Aucun étudiant trouvé.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {etudiants.map((etudiant) => (
            <EtudiantCard key={etudiant.id} etudiant={etudiant} />
          ))}
        </div>
      )}
    </div>
  );
}
