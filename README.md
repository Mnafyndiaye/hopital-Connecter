# Medical Platform – Gestion de Dossiers Médicaux avec Imagerie DICOM

Cette application est une plateforme web destinée aux professionnels de santé (médecins et assistants), permettant la gestion complète des dossiers médicaux des patients, y compris les consultations, prescriptions, signes vitaux, ainsi que l’affichage et le téléchargement d’imagerie médicale au format DICOM via Orthanc.

---

## 🔧 Technologies utilisées

### Backend

- Node.js
- Express.js
- Sequelize (ORM) avec une base de données PostgreSQL
- Orthanc (serveur DICOM) avec une API intermédiaire Node.js
- Middleware pour l’upload de fichiers DICOM (multer)
- Authentification simple des utilisateurs (médecins, assistants)

### Frontend

- React.js
- Axios pour les appels API
- Cornerstone.js pour le rendu DICOM
- Cornerstone Tools, Math, WADO Image Loader
- dicom-parser

---

## 📁 Structure du backend

- /api/patients : gestion des patients
- /api/consultations : ajout de consultations (avec prescription & signes vitaux)
- /api/medical-records : affichage du dossier médical complet
- /api/orthanc :
  - /studies : liste des études DICOM
  - /studies/:id/instances : instances d’une étude
  - /instances/:id/file : récupération d’un fichier DICOM
  - /upload : envoi de fichier DICOM à Orthanc

---

## 📁 Structure du frontend

Pages principales :

- AssistantDashboard : création de patients, assignation de médecins
- MedicalRecordDashboard : visualisation du dossier médical d’un patient
- AddConsultationPage : formulaire pour ajouter une consultation (prescription + signes vitaux)
- MedicalImaging : affichage et envoi d’imagerie DICOM via Cornerstone

---

## ▶️ Lancer le projet

### 1. Lancer le backend

```bash
cd backend
npm install
npm run dev
```

Assurez-vous que PostgreSQL et Orthanc sont lancés (Orthanc par défaut sur http://localhost:8042).

### 2. Lancer le frontend

```bash
cd frontend
npm install
npm start
```

Le frontend est accessible à http://localhost:3000.

---

## 🧪 Exemple d’utilisation

1. Un assistant crée un patient via le tableau de bord.
2. Un médecin peut accéder à la liste de ses patients et visualiser leur dossier médical.
3. Le médecin peut ajouter une consultation avec prescription et signes vitaux.
4. Les imageries médicales peuvent être visualisées en DICOM via la page MedicalImaging.
5. Possibilité d’uploader de nouvelles images DICOM et de les enregistrer dans Orthanc.

---

## 📷 Fonctionnalités d’imagerie médicale

- Liste des études DICOM depuis Orthanc
- Affichage de l’image DICOM avec zoom, reset
- Upload local d’un fichier DICOM et prévisualisation
- Envoi du fichier vers Orthanc
- Téléchargement du fichier depuis Orthanc

---

## ⚠️ Remarques

- Orthanc doit être configuré avec CORS activé pour l’accès depuis le frontend.
- Le backend agit comme un proxy sécurisé entre le frontend et Orthanc.
- Les ID des instances et études DICOM sont extraits dynamiquement.

## 👥 Auteurs
- Maman Nafy Ndiaye
- Oumar Yoro Diouf
- Abdoulaye Lah
- Ndeye Bounama Dieng
