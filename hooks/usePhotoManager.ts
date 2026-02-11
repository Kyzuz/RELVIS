import { useState } from 'react';
import { Platform } from 'react-native';
import { Paths, Directory, File } from 'expo-file-system';

export const usePhotoManager = () => {
   const [isProcessing, setIsProcessing] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const savePhotoLocally = async (tempUri: string, observationId: number): Promise<{ uri: string, fileName: string } | null> => {
      setIsProcessing(true);
      setError(null);

      try {
         const timestamp = new Date().getTime();
         const fileName = `photo_obs_${observationId}_${timestamp}.jpg`;

         // --- BYPASS POUR LE MODE WEB ---
         if (Platform.OS === 'web') {
            console.log("Mode Web détecté : Simulation de l'enregistrement de l'image.");
            setIsProcessing(false);
            
            // Sur le Web, la caméra retourne une URL temporaire (blob: ou data:).
            // On la retourne directement pour que SQLite puisse l'enregistrer et la galerie l'afficher.
            return { uri: tempUri, fileName: fileName };
         }
         // --------------------------------

         // 1. Définition du dossier persistant
         const photoDir = new Directory(Paths.document, 'photos_audit');

         // 2. Vérification de l'existence du dossier, création si nécessaire
         if (!photoDir.exists) {
            photoDir.create();
         }

         // 3. Références aux fichiers source (temporaire) et destination (permanent)
         const tempFile = new File(tempUri);
         const permanentFile = new File(photoDir, fileName);

         // 4. Déplacement de l'image du cache vers le stockage sécurisé
         tempFile.move(permanentFile);

         setIsProcessing(false);
         return { uri: permanentFile.uri, fileName: fileName };

      } catch (err) {
         console.error("Erreur technique :", err);
         setError("Erreur lors de l'enregistrement du fichier image.");
         setIsProcessing(false);
         return null;
      }
   };

   return { savePhotoLocally, isProcessing, error };
};