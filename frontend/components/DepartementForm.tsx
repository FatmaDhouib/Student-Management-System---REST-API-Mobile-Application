'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import { Departement } from '@/types';

interface DepartementFormProps {
  departement?: Departement;
  onSubmit: (data: { nom: string }) => Promise<void>;
  onCancel?: () => void;
}

export default function DepartementForm({ departement, onSubmit, onCancel }: DepartementFormProps) {
  const [nom, setNom] = useState(departement?.nom || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (departement) {
      setNom(departement.nom);
    }
  }, [departement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) return;

    setIsLoading(true);
    try {
      await onSubmit({ nom });
      if (!departement) setNom('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Nom du département
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            id="nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ex: Informatique"
            className="flex-1 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            required
          />
          <button
            type="submit"
            disabled={isLoading || !nom.trim()}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-xl transition-all flex items-center shadow-sm"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin mr-2" />
            ) : departement ? (
              'Modifier'
            ) : (
              <>
                <Plus size={18} className="mr-2" />
                Ajouter
              </>
            )}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
