import React from 'react';
import Link from 'next/link';
import { User, Mail, Building2, Edit2, Trash2 } from 'lucide-react';
import { Etudiant } from '@/types';

interface EtudiantCardProps {
  etudiant: Etudiant;
  onDelete?: (id: number) => void;
}

export default function EtudiantCard({ etudiant, onDelete }: EtudiantCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
              <User size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {etudiant.nom}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center mt-1">
                <Building2 size={14} className="mr-1.5" />
                {etudiant.departementNom || 'Non assigné'}
              </p>
            </div>
          </div>
          {etudiant.age !== undefined && (
            <div className="bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {etudiant.age} ans
            </div>
          )}
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
            <Mail size={16} className="mr-2" />
            {etudiant.email}
          </div>
          <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
            <span className="font-medium mr-2">CIN:</span>
            {etudiant.cin}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end space-x-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <Link
            href={`/etudiants/${etudiant.id}`}
            className="p-2 text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
            title="Modifier"
          >
            <Edit2 size={18} />
          </Link>
          <button
            onClick={() => onDelete?.(etudiant.id)}
            className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Supprimer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
