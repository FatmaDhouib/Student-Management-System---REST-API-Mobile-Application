import Link from "next/link";

export default function EtudiantCard({ etudiant }: { etudiant: any }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">{etudiant.nom}</h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {etudiant.age} ans
          </span>
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          <p><span className="font-medium">CIN:</span> {etudiant.cin}</p>
          <p><span className="font-medium">Email:</span> {etudiant.email}</p>
          {etudiant.departement && (
            <p><span className="font-medium">Département:</span> {etudiant.departement.nom}</p>
          )}
        </div>
      </div>
      <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end space-x-2">
        <Link href={`/etudiants/${etudiant.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
          Voir détails →
        </Link>
      </div>
    </div>
  );
}
