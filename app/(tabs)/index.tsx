import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import { genererExportCSV } from '../utils/exporterCSV'; 

// Structure temporaire pour visualiser la liste des projets
const PROJETS_TEMPORAIRES = [
   { id: '1', nom_client: 'Usine Nord - Chaufferie', date: '2026-02-10' },
   { id: '2', nom_client: 'Tour de bureaux Centre-Ville', date: '2026-02-08' },
];

export default function HomeScreen() {
   // Initialisation du routeur pour la navigation
   const router = useRouter();

   // NOUVEAU : Création des tables SQLite au démarrage de l'application
   useEffect(() => {
      const initialiserBaseDeDonnees = async () => {
         try {
            const db = await SQLite.openDatabaseAsync('audit_terrain.db');
            
            // On s'assure que la table existe avant que l'utilisateur ne prenne une photo
            await db.execAsync(`
               CREATE TABLE IF NOT EXISTS Photo (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  observation_id INTEGER NOT NULL,
                  chemin_uri_local TEXT NOT NULL,
                  nom_fichier_export TEXT,
                  date_prise TEXT
               );
            `);
            console.log("Les tables de la base de données sont prêtes !");
         } catch (erreur) {
            console.error("Erreur lors de l'initialisation de SQLite :", erreur);
         }
      };

      initialiserBaseDeDonnees();
   }, []);   

   return (
      <View style={styles.container}>
         <View style={styles.header}>
            <Text style={styles.title}>RELVIS</Text>
            <Text style={styles.subtitle}>Audits Énergétiques & Mécaniques</Text>
         </View>

         <TouchableOpacity style={styles.buttonNouveau}>
            <Text style={styles.buttonText}>+ Nouvel visite de chantier</Text>
         </TouchableOpacity>

         <TouchableOpacity 
            style={styles.buttonCamera}
            onPress={() => router.push('/camera')}
         >
            <Text style={styles.buttonText}>Ouvrir l'appareil photo</Text>
         </TouchableOpacity>

         {/* NOUVEAU bouton pour la galerie */}
         <TouchableOpacity 
            style={styles.buttonGalerie}
            onPress={() => router.push('/galerie')}
         >
            <Text style={styles.buttonText}>Voir les photos sauvegardées</Text>
         </TouchableOpacity>

         {/* Export CSV */}
         <TouchableOpacity 
            style={styles.buttonExport}
            onPress={async () => {
               const csv = await genererExportCSV();
               if (csv) {
                  // On affiche directement le contenu du CSV dans l'alerte !
                  alert("Aperçu du CSV :\n\n" + csv);
               } else {
                  alert("Aucune donnée à exporter ou erreur.");
               }
            }}
         >
            <Text style={styles.buttonText}>Générer le rapport CSV</Text>
         </TouchableOpacity>

         <Text style={styles.sectionTitle}>Audits Récents</Text>
         
         <FlatList
            data={PROJETS_TEMPORAIRES}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
               <View style={styles.card}>
                  <Text style={styles.cardTitle}>{item.nom_client}</Text>
                  <Text style={styles.cardDate}>{item.date}</Text>
               </View>
            )}
         />
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#F5F7FA',
      padding: 20,
   },
   header: {
      marginBottom: 30,
      marginTop: 40,
   },
   title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#2C3E50',
   },
   subtitle: {
      fontSize: 16,
      color: '#7F8C8D',
      marginTop: 5,
   },
   buttonNouveau: {
      backgroundColor: '#3498DB',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 15,
   },
   buttonCamera: {
      backgroundColor: '#2ECC71',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 30,
   },
   buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#2C3E50',
      marginBottom: 15,
   },
   card: {
      backgroundColor: 'white',
      padding: 15,
      borderRadius: 8,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#E0E6ED',
   },
   cardTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: '#34495E',
   },
   cardDate: {
      fontSize: 14,
      color: '#95A5A6',
      marginTop: 4,
   },
   buttonGalerie: {
      backgroundColor: '#8E44AD', // Un violet distinctif
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 30,
   },
   buttonExport: {
      backgroundColor: '#E67E22', // Une couleur orange pour l'action d'export
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 30,
   },
});