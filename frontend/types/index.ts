export interface Departement {
  id: number;
  nom: string;
}

export interface Etudiant {
  id: number;
  cin: string;
  nom: string;
  dateNaissance: string;
  email: string;
  anneePremiereInscription: number;
  departementId?: number;
  departementNom?: string;
  age?: number;
}

export interface EtudiantFormData {
  cin: string;
  nom: string;
  dateNaissance: string;
  email: string;
  anneePremiereInscription: number;
  departementId: number;
}
