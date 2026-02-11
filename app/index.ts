export interface Projet {
   id: number;
   nom_client: string;
   date_creation: string; // Format ISO
   statut: 'EN_COURS' | 'ARCHIVE';
}

export interface Equipement {
   id: number;
   projet_id: number;
   type: string; // Ex: 'Refroidisseur', 'CTA'
   marque?: string;
   modele?: string;
}

export interface Observation {
   id: number;
   equipement_id: number;
   texte_note: string;
}

export interface Photo {
   id: number;
   observation_id: number;
   chemin_uri_local: string; // URI interne (cache ou document directory)
   nom_fichier_export?: string; // Nom final pour le CSV (ex: img_001.jpg)
}