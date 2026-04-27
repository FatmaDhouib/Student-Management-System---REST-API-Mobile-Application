import Link from 'next/link';
import { Users, Building2, ArrowRight, GraduationCap, BarChart3, Clock } from 'lucide-react';
import { api } from '@/lib/api';

export default async function Home() {
  let stats = { etudiants: 0, departements: 0 };
  
  try {
    const [e, d] = await Promise.all([
      api.etudiants.getAll().catch(() => []),
      api.departements.getAll().catch(() => [])
    ]);
    stats = { etudiants: e.length, departements: d.length };
  } catch (err) {
    console.error("Failed to fetch stats", err);
  }

  const cards = [
    {
      title: 'Gestion Étudiants',
      description: 'Consultez la liste, modifiez les profils ou ajoutez de nouveaux étudiants à la plateforme.',
      href: '/etudiants',
      icon: Users,
      color: 'bg-blue-500',
      count: stats.etudiants,
      countLabel: 'Étudiants inscrits'
    },
    {
      title: 'Gestion Départements',
      description: 'Organisez votre structure académique en gérant les différents départements de l\'école.',
      href: '/departements',
      icon: Building2,
      color: 'bg-indigo-500',
      count: stats.departements,
      countLabel: 'Départements créés'
    }
  ];

  return (
    <div className="space-y-12">
      <section className="text-center space-y-4 max-w-3xl mx-auto py-12">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-4">
          <Clock size={16} className="mr-2" />
          Dashboard Administratif v1.0
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
          Bienvenue sur <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">EduManager</span>
        </h1>
        <p className="text-xl text-zinc-500 dark:text-zinc-400">
          Une interface moderne et intuitive pour la gestion centralisée de vos étudiants et de vos structures départementales.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cards.map((card) => (
          <Link 
            key={card.title} 
            href={card.href}
            className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-500"
          >
            <div className={`w-16 h-16 ${card.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-100 dark:shadow-none group-hover:scale-110 transition-transform duration-500`}>
              <card.icon size={32} />
            </div>
            
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">{card.title}</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
              {card.description}
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center text-zinc-900 dark:text-zinc-100 font-bold">
                <BarChart3 size={20} className="mr-2 text-indigo-500" />
                <span className="text-2xl">{card.count}</span>
                <span className="ml-2 text-sm text-zinc-500 font-normal">{card.countLabel}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <ArrowRight size={20} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <section className="bg-zinc-900 dark:bg-white rounded-[2.5rem] p-12 text-zinc-100 dark:text-zinc-900 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full" />
        <div className="relative z-10 space-y-4 max-w-xl text-center md:text-left">
          <h2 className="text-3xl font-bold">Besoin d'aide ?</h2>
          <p className="text-zinc-400 dark:text-zinc-500">
            Consultez la documentation technique pour apprendre à configurer l'API Gateway et connecter vos microservices.
          </p>
          <button className="px-8 py-3 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold rounded-xl hover:bg-zinc-100 transition-colors">
            Voir la documentation
          </button>
        </div>
        <div className="relative z-10">
          <div className="w-48 h-48 bg-zinc-800 dark:bg-zinc-100 rounded-3xl flex items-center justify-center border border-zinc-700 dark:border-zinc-200">
             <GraduationCap size={80} className="text-indigo-400" />
          </div>
        </div>
      </section>
    </div>
  );
}
