"use client";

import { useEffect, useState } from "react";
import DepartementForm from "@/components/DepartementForm";

export default function DepartementsPage() {
  const [departements, setDepartements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDepartements = () => {
    setLoading(true);
    fetch("http://localhost:8888/api/departements")
      .then((res) => res.json())
      .then((data) => {
        setDepartements(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch departements", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDepartements();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce département ?")) {
      await fetch(`http://localhost:8888/api/departements/${id}`, {
        method: "DELETE",
      });
      fetchDepartements();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Liste des Départements</h1>
        
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departements.map((dep) => (
                  <tr key={dep.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{dep.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dep.nom}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleDelete(dep.id)} className="text-red-600 hover:text-red-900">Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {departements.length === 0 && (
              <div className="p-8 text-center text-gray-500">Aucun département disponible.</div>
            )}
          </div>
        )}
      </div>

      <div>
        <div className="sticky top-8">
          <DepartementForm onSuccess={fetchDepartements} />
        </div>
      </div>
    </div>
  );
}
