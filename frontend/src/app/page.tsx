import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-6 tracking-tight text-center">
        Bienvenue sur EduGestion
      </h1>
      <p className="text-xl text-gray-600 mb-10 max-w-2xl text-center">
        La plateforme moderne de gestion des étudiants, des départements et des notes.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <Link href="/etudiants" className="group p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-3xl">👨‍🎓</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Étudiants</h2>
          <p className="text-gray-500 text-center">Gérez les dossiers, les inscriptions et consultez le détail de chaque étudiant.</p>
        </Link>
        
        <Link href="/departements" className="group p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-3xl">🏢</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Départements</h2>
          <p className="text-gray-500 text-center">Organisez votre structure académique en gérant les différents départements.</p>
        </Link>
      </div>
    </div>
  );
}
