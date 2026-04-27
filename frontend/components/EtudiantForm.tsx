'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, ArrowLeft, Calendar, CreditCard, GraduationCap } from 'lucide-react';
import { Etudiant, Departement, EtudiantFormData } from '@/types';
import { api } from '@/lib/api';

interface EtudiantFormProps {
  etudiant?: Etudiant;
  departements: Departement[];
}

export default function EtudiantForm({ etudiant, departements }: EtudiantFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize form with default values or existing student data
  const [formData, setFormData] = useState<EtudiantFormData>({
    nom: etudiant?.nom || '',
    cin: etudiant?.cin || '',
    email: etudiant?.email || '',
    dateNaissance: etudiant?.dateNaissance || '',
    anneePremiereInscription: etudiant?.anneePremiereInscription || new Date().getFullYear(),
    departementId: etudiant?.departementId || (departements.length > 0 ? departements[0].id : 0),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (etudiant) {
        await api.etudiants.update(etudiant.id, formData);
      } else {
        await api.etudiants.create(formData);
      }
      router.push('/etudiants');
      router.refresh();
    } catch (error) {
      console.error('Error saving etudiant:', error);
      alert('Une erreur est survenue lors de l\'enregistrement.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-10 shadow-sm">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Nom Complet */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1">Nom Complet</label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="w-full pl-4 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Ex: Mohamed Ben Ali"
              />
            </div>
          </div>

          {/* CIN */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1">CIN</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                <CreditCard size={18} />
              </div>
              <input
                type="text"
                required
                value={formData.cin}
                onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Ex: 01234567"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Date de Naissance */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1">Date de Naissance</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                <Calendar size={18} />
              </div>
              <input
                type="date"
                required
                value={formData.dateNaissance}
                onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1">Email académique</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="etudiant@universite.tn"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Année d'inscription */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1">Année de 1ère Inscription</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                <GraduationCap size={18} />
              </div>
              <input
                type="number"
                required
                min="2000"
                max={new Date().getFullYear()}
                value={formData.anneePremiereInscription}
                onChange={(e) => setFormData({ ...formData, anneePremiereInscription: parseInt(e.target.value) })}
                className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Département */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1">Département</label>
            <select
              required
              value={formData.departementId}
              onChange={(e) => setFormData({ ...formData, departementId: parseInt(e.target.value) })}
              className="w-full px-4 py-3.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">Sélectionnez un département</option>
              {departements.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.nom}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-10 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-semibold transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Annuler
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center px-10 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none transition-all transform hover:-translate-y-1 active:scale-95"
          >
            {isLoading ? (
              <Loader2 size={22} className="animate-spin mr-2" />
            ) : (
              <Save size={22} className="mr-2" />
            )}
            {etudiant ? 'Mettre à jour le profil' : 'Finaliser l\'inscription'}
          </button>
        </div>
      </div>
    </form>
  );
}
