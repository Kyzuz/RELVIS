import { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { usePhotoManager } from '../hooks/usePhotoManager';
import * as SQLite from 'expo-sqlite';

export default function CameraCapture() {
   // Demande des permissions pour la caméra
   const [permission, requestPermission] = useCameraPermissions();
   const cameraRef = useRef<any>(null);

   // Initialisation du hook de sauvegarde locale
   const { savePhotoLocally, isProcessing, error } = usePhotoManager();

   // ID d'observation fictif pour le test (sera remplacé par l'ID SQLite réel)
   const currentObservationId = 1;

   if (!permission) {
      // Les permissions sont en cours de chargement
      return <View />;
   }

   if (!permission.granted) {
      // Les permissions n'ont pas été accordées
      return (
         <View style={styles.container}>
            <Text style={{ textAlign: 'center' }}>Nous avons besoin de votre permission pour utiliser la caméra</Text>
            <Button onPress={requestPermission} title="Accorder la permission" />
         </View>
      );
   }

   const prendrePhoto = async () => {
      // On empêche la prise de multiples photos simultanées
      if (cameraRef.current && !isProcessing) {
         try {
            // Capture de la photo
            const photo = await cameraRef.current.takePictureAsync();
            console.log("Photo temporaire capturée :", photo.uri);

            // Appel du hook pour déplacer et renommer le fichier
            const savedPhoto = await savePhotoLocally(photo.uri, currentObservationId);

            if (savedPhoto) {
               console.log("Photo sauvegardée avec succès :", savedPhoto.uri);
               
               // LIAISON BASE DE DONNÉES : Insertion des informations de la photo
               const db = await SQLite.openDatabaseAsync('audit_terrain.db');
               const datePrise = new Date().toISOString();
               
               await db.runAsync(
                  `INSERT INTO Photo (observation_id, chemin_uri_local, nom_fichier_export, date_prise) VALUES (?, ?, ?, ?);`,
                  [currentObservationId, savedPhoto.uri, savedPhoto.fileName, datePrise]
               );
               
               console.log("Les données de la photo ont été ajoutées à la table SQLite.");
            }

         } catch (err) {
            console.error("Erreur lors de la capture :", err);
         }
      }
   };

   return (
      <View style={styles.container}>
         <CameraView style={styles.camera} facing="back" ref={cameraRef}>
            <View style={styles.buttonContainer}>
               <TouchableOpacity 
                  style={[styles.captureButton, isProcessing && styles.captureButtonDisabled]} 
                  onPress={prendrePhoto}
                  disabled={isProcessing}
               >
                  <View style={styles.captureButtonInner} />
               </TouchableOpacity>
            </View>
         </CameraView>
         {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
   },
   camera: {
      flex: 1,
   },
   buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'flex-end',
      marginBottom: 40,
   },
   captureButton: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
   },
   captureButtonInner: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: 'white',
   },
   captureButtonDisabled: {
      backgroundColor: 'rgba(255, 0, 0, 0.3)',
   },
   errorText: {
      color: 'red',
      textAlign: 'center',
      padding: 10,
      backgroundColor: 'white',
      fontWeight: 'bold',
   }
});