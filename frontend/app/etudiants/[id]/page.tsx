import React from 'react';
import EtudiantForm from '@/components/EtudiantForm';
import { api } from '@/lib/api';
import { UserPlus, UserCircle2 } from 'lucide-react';

export default async function EtudiantDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const isNew = id === 'new';
  
  let etudiant = null;
  let departements = [];

  try {
    // Parallel fetch for efficiency
    const [deptsData, etudiantData] = await Promise.all([
      api.departements.getAll(),
      isNew ? Promise.resolve(null) : api.etudiants.getOne(id)
    ]);
    
    departements = deptsData;
    etudiant = etudiantData;
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
          {isNew ? <UserPlus size={28} /> : <UserCircle2 size={28} />}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {isNew ? 'Nouvel Étudiant' : 'Modifier l\'Étudiant'}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            {isNew ? 'Remplissez le formulaire pour inscrire un nouvel étudiant.' : `Modification du profil de ${etudiant?.nom}.`}
          </p>
        </div>
      </div>

      <div className="mt-8">
        {departements.length === 0 ? (
          <div className="p-8 text-center bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-3xl text-amber-800 dark:text-amber-400">
            <p className="font-semibold">Attention</p>
            <p className="mt-1 text-sm">Vous devez d'abord créer au moins un département avant de pouvoir ajouter un étudiant.</p>
          </div>
        ) : (
          <EtudiantForm etudiant={etudiant} departements={departements} />
        )}
      </div>
    </div>
  );
}
