export type Etudiant = {
  id: number;
  cin: string;
  nom: string;
  dateNaissance: string; // ISO string
  email?: string;
  anneePremiereInscription?: number;
  departementId?: number;
  departementNom?: string;
  age?: number;
  // For UI convenience
  departement?: {
    id: number;
    nom: string;
  };
};