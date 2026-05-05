"use client";

import { useState } from "react";

export default function DepartementForm({ onSuccess }: { onSuccess: () => void }) {
  const [nom, setNom] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) return;

    setLoading(true);
    try {
      await fetch("http://localhost:8888/api/departements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom }),
      });
      setNom("");
      onSuccess();
    } catch (err) {
      console.error("Failed to add departement", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Nouveau Département</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">Nom du département</label>
          <input
            type="text"
            id="nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-shadow"
            placeholder="Ex: Informatique"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading || !nom.trim()}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {loading ? "Ajout en cours..." : "Ajouter"}
        </button>
      </form>
    </div>
  );
}
