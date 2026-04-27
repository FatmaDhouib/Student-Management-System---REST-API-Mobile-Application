'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Departement } from '@/types';
import DepartementForm from '@/components/DepartementForm';
import { Building2, Edit2, Trash2, Search, Loader2 } from 'lucide-react';

export default function DepartementsPage() {
  const [departements, setDepartements] = useState<Departement[]>([]);
  const [editingDept, setEditingDept] = useState<Departement | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadDepartements = async () => {
    setIsLoading(true);
    try {
      const data = await api.departements.getAll();
      setDepartements(data);
    } catch (error) {
      console.error('Error loading departements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDepartements();
  }, []);

  const handleSubmit = async (data: { nom: string }) => {
    try {
      if (editingDept) {
        await api.departements.update(editingDept.id, data);
      } else {
        await api.departements.create(data);
      }
      setEditingDept(undefined);
      loadDepartements();
    } catch (error) {
      console.error('Error saving departement:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce département ?')) return;
    try {
      await api.departements.delete(id);
      loadDepartements();
    } catch (error) {
      console.error('Error deleting departement:', error);
      alert('Erreur lors de la suppression. Vérifiez qu\'aucun étudiant n\'est rattaché à ce département.');
    }
  };

  const filteredDepartements = departements.filter(d => 
    d.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Départements</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Gérez les structures académiques de votre établissement.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64 transition-all"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
          {editingDept ? 'Modifier le département' : 'Nouveau département'}
        </h2>
        <DepartementForm 
          departement={editingDept} 
          onSubmit={handleSubmit} 
          onCancel={editingDept ? () => setEditingDept(undefined) : undefined} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-zinc-500">
            <Loader2 size={40} className="animate-spin mb-4 text-indigo-600" />
            Chargement des départements...
          </div>
        ) : filteredDepartements.length > 0 ? (
          filteredDepartements.map((dept) => (
            <div 
              key={dept.id} 
              className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex items-center justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{dept.nom}</h3>
                  <p className="text-xs text-zinc-500">ID: {dept.id}</p>
                </div>
              </div>
              
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setEditingDept(dept)}
                  className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(dept.id)}
                  className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-zinc-500 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
            {searchTerm ? 'Aucun résultat pour votre recherche.' : 'Aucun département trouvé.'}
          </div>
        )}
      </div>
    </div>
  );
}
