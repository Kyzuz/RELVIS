# Résumé du Projet : Application de Relevés Terrain

## 1. Contexte et Objectif
Développement d'une application locale et hors ligne destinée aux audits en efficacité énergétique, mécanique du bâtiment et réfrigération industrielle. L'outil vise à numériser la prise de notes et la capture photographique sur le chantier, tout en s'intégrant de manière transparente aux processus existants de l'entreprise (outils VBA, Excel, OneNote). L'application au complet doit être écrit en français, y compris le code source.

## 2. Architecture Technique
* **Framework :** React Native (via Expo pour simplifier l'accès aux API natives comme la caméra et le système de fichiers).
* **Environnement de développement :** Configuration optimale sous Linux en utilisant VSCodium ou VS Code.
* **Base de données locale :** SQLite (`expo-sqlite`) pour assurer la persistance et structurer relationnellement les données complexes hors ligne.
* **Gestion des médias :** `expo-file-system` pour sauvegarder les photos localement (URI) sans alourdir la base de données.
* **Génération d'archive :** Utilisation d'une librairie (ex: `react-native-zip-archive`) pour regrouper le texte et les images.

## 3. Fonctionnalités Principales
* **Mode "Offline-First" absolu :** Fonctionnement garanti à 100% sans réseau (salles mécaniques, sous-sols, toits).
* **Saisie de données structurées :** Formulaires dynamiques adaptés aux équipements (plaques signalétiques, types de réfrigérants, tensions).
* **Prise de photos intégrée :** Déclenchement de l'appareil photo depuis l'application et liaison automatique du fichier image à l'observation saisie.
* **Exportation Zéro-API :** Génération d'un fichier ZIP contenant le fichier texte (CSV) et le dossier des images brutes.
* **Partage natif :** Appel au système de partage de l'appareil (`expo-sharing`) pour transférer l'archive vers un stockage local ou infonuagique une fois le réseau retrouvé.

## 4. Modélisation des Données (Structure relationnelle SQLite)
La structure de la base de données doit refléter la hiérarchie physique d'un audit :
* Table Projet
   * ID
   * Nom du client
   * Date
* Table Equipement
   * ID
   * Type (Refroidisseur, CTA, etc.)
   * Marque et Modèle
   * ID_Projet (Clé étrangère)
* Table Observation
   * ID
   * Texte de la note
   * ID_Equipement (Clé étrangère)
* Table Photo
   * ID
   * Chemin_URI_Local
   * ID_Observation (Clé étrangère)

## 5. Stratégie d'Intégration (Le Pont VBA / CSV)
L'application sert de collecteur de données propre et standardisé, sans forcer une nouvelle technologie sur les processus de bureau existants :
1.  L'application génère un fichier `export_donnees.csv` où chaque ligne représente une observation ou un équipement.
2.  Une colonne spécifique du CSV contient le nom exact du fichier image associé (ex: `photo_compresseur_001.jpg`).
3.  L'archive ZIP est décompressée sur le poste de travail de l'ingénieur.
4.  Les macros VBA existantes lisent le fichier CSV, extraient le texte et utilisent le chemin local pour importer et positionner les images automatiquement dans les rapports finaux ou OneNote.

## 6. Prochaines Étapes de Développement
1.  Initialisation du projet Expo (TypeScript recommandé pour la robustesse des modèles de données).
2.  Création et configuration du schéma relationnel SQLite.
3.  Développement du flux de prise de photo et logique de déplacement des fichiers temporaires vers le stockage persistant de l'application.
4.  Création de l'algorithme de formatage lisant les tables SQLite pour construire la chaîne de caractères CSV.
5.  Intégration de la compression ZIP et du partage natif.