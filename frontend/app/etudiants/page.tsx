'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Etudiant } from '@/types';
import EtudiantCard from '@/components/EtudiantCard';
import { UserPlus, Search, Loader2, Filter } from 'lucide-react';

export default function EtudiantsPage() {
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadEtudiants = async () => {
    setIsLoading(true);
    try {
      const data = await api.etudiants.getAll();
      setEtudiants(data);
    } catch (error) {
      console.error('Error loading etudiants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEtudiants();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) return;
    try {
      await api.etudiants.delete(id);
      loadEtudiants();
    } catch (error) {
      console.error('Error deleting etudiant:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const filteredEtudiants = etudiants.filter(e => 
    e.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.departementNom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Étudiants</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Gérez la base de données des étudiants inscrits.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher un étudiant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-64 transition-all"
            />
          </div>
          <Link
            href="/etudiants/new"
            className="flex items-center justify-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all transform hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
          >
            <UserPlus size={18} className="mr-2" />
            Ajouter
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center text-zinc-500">
          <Loader2 size={48} className="animate-spin mb-4 text-indigo-600" />
          <p className="text-lg font-medium">Récupération des données...</p>
        </div>
      ) : filteredEtudiants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEtudiants.map((etudiant) => (
            <EtudiantCard 
              key={etudiant.id} 
              etudiant={etudiant} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] bg-zinc-50/50 dark:bg-zinc-900/30">
          <div className="mx-auto w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 mb-4">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Aucun étudiant trouvé</h3>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs mx-auto">
            {searchTerm 
              ? "Nous n'avons trouvé aucun résultat correspondant à votre recherche." 
              : "Commencez par ajouter votre premier étudiant à la plateforme."}
          </p>
          {!searchTerm && (
            <Link
              href="/etudiants/new"
              className="inline-flex items-center mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium"
            >
              Ajouter un étudiant
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
