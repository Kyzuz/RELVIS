import * as SQLite from 'expo-sqlite';

// Interface pour typer le retour de la requête
interface LigneExport {
   id: number;
   observation_id: number;
   nom_fichier_export: string;
   date_prise: string;
}

export const genererExportCSV = async (): Promise<string | null> => {
   try {
      // 1. Connexion à la base de données
      const db = await SQLite.openDatabaseAsync('audit_terrain.db');

      // 2. Récupération des données (Pour l'instant, on se concentre sur les photos)
      // Plus tard, cette requête sera un JOIN entre Projet, Equipement, Observation et Photo
      const resultats = await db.getAllAsync<LigneExport>(
         'SELECT id, observation_id, nom_fichier_export, date_prise FROM Photo ORDER BY id ASC;'
      );

      if (resultats.length === 0) {
         console.log("Aucune donnée à exporter.");
         return null;
      }

      // 3. Création de l'en-tête du fichier CSV
      // Le séparateur classique est la virgule, mais on utilise parfois le point-virgule pour Excel en français
      let contenuCSV = "ID_Photo,ID_Observation,Fichier_Image,Date_Prise\n";

      // 4. Boucle de remplissage des lignes
      resultats.forEach((ligne) => {
         // On s'assure de nettoyer les chaînes de caractères au cas où elles contiendraient des virgules
         const fichierPropre = ligne.nom_fichier_export ? ligne.nom_fichier_export.replace(/,/g, '') : '';
         const datePropre = ligne.date_prise ? ligne.date_prise.replace(/,/g, '') : '';
         
         contenuCSV += `${ligne.id},${ligne.observation_id},${fichierPropre},${datePropre}\n`;
      });

      // Affichage dans la console pour vérifier la structure
      console.log("=== APERÇU DU FICHIER CSV POUR VBA ===");
      console.log(contenuCSV);
      console.log("======================================");

      return contenuCSV;

   } catch (erreur) {
      console.error("Erreur lors de la génération du CSV :", erreur);
      return null;
   }
};