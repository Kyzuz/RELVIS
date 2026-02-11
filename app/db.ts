import * as SQLite from 'expo-sqlite';

// Nom du fichier de base de données
const DB_NAME = 'audit_terrain.db';

export const initDatabase = async () => {
   const db = await SQLite.openDatabaseAsync(DB_NAME);

   // Activation des clés étrangères (essentiel pour la cascade et l'intégrité)
   await db.execAsync('PRAGMA foreign_keys = ON;');

   // Création des tables selon la hiérarchie définie
   await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Projet (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         nom_client TEXT NOT NULL,
         date_creation TEXT NOT NULL,
         statut TEXT DEFAULT 'EN_COURS'
      );

      CREATE TABLE IF NOT EXISTS Equipement (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         projet_id INTEGER NOT NULL,
         type TEXT NOT NULL,
         marque TEXT,
         modele TEXT,
         FOREIGN KEY (projet_id) REFERENCES Projet(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS Observation (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         equipement_id INTEGER NOT NULL,
         texte_note TEXT,
         FOREIGN KEY (equipement_id) REFERENCES Equipement(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS Photo (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         observation_id INTEGER NOT NULL,
         chemin_uri_local TEXT NOT NULL,
         nom_fichier_export TEXT,
         date_prise TEXT,
         FOREIGN KEY (observation_id) REFERENCES Observation(id) ON DELETE CASCADE
      );
   `);

   return db;
};