import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';

// Interface locale pour typer les résultats de la base de données
interface PhotoDB {
   id: number;
   observation_id: number;
   chemin_uri_local: string;
   nom_fichier_export: string;
   date_prise: string;
}

export default function GalerieScreen() {
   const [photos, setPhotos] = useState<PhotoDB[]>([]);
   const [erreur, setErreur] = useState<string | null>(null);

   // Fonction pour lire la base de données
   const chargerPhotos = async () => {
      try {
         const db = await SQLite.openDatabaseAsync('audit_terrain.db');
         
         // Récupération de toutes les photos, de la plus récente à la plus ancienne
         const resultats = await db.getAllAsync<PhotoDB>(
            'SELECT * FROM Photo ORDER BY id DESC;'
         );
         
         setPhotos(resultats);
      } catch (err) {
         console.error(err);
         setErreur("Impossible de charger les photos depuis la base de données.");
      }
   };

   // Chargement automatique à l'ouverture de l'écran
   useEffect(() => {
      chargerPhotos();
   }, []);

   return (
      <View style={styles.container}>
         <Text style={styles.title}>Galerie des Observations</Text>
         
         {erreur && <Text style={styles.errorText}>{erreur}</Text>}
         
         <FlatList
            data={photos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
               <View style={styles.card}>
                  <Image 
                     source={{ uri: item.chemin_uri_local }} 
                     style={styles.image} 
                  />
                  <Text style={styles.details}>Fichier : {item.nom_fichier_export}</Text>
                  <Text style={styles.details}>Observation ID : {item.observation_id}</Text>
                  <Text style={styles.details}>Date : {new Date(item.date_prise).toLocaleString()}</Text>
               </View>
            )}
            ListEmptyComponent={
               <Text style={styles.emptyText}>Aucune photo enregistrée dans la base de données.</Text>
            }
         />
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#F5F7FA',
   },
   title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#2C3E50',
      marginTop: 20,
   },
   card: {
      backgroundColor: 'white',
      padding: 15,
      borderRadius: 8,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: '#E0E6ED',
   },
   image: {
      width: '100%',
      height: 250,
      borderRadius: 6,
      marginBottom: 10,
      backgroundColor: '#E0E6ED', // Fond gris si l'image charge
   },
   details: {
      fontSize: 14,
      color: '#7F8C8D',
      marginBottom: 4,
   },
   errorText: {
      color: 'red',
      marginBottom: 15,
      fontWeight: 'bold',
   },
   emptyText: {
      textAlign: 'center',
      color: '#95A5A6',
      marginTop: 50,
      fontSize: 16,
   }
});