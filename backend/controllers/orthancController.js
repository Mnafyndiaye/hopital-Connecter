const axios = require('axios');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

const ORTHANC_URL = process.env.ORTHANC_URL || 'http://localhost:8042';

const upload = multer({ storage: multer.memoryStorage() });

// Stocker temporairement les descriptions personnalisées (en mémoire pour cet exemple)
const studyDescriptions = new Map();

const getStudies = async (req, res) => {
    try {
        console.log('Récupération des études depuis Orthanc...');
        const response = await axios.get(`${ORTHANC_URL}/studies`);
        console.log('Études récupérées:', response.data);
        const studies = await Promise.all(response.data.map(async studyId => {
            const study = await axios.get(`${ORTHANC_URL}/studies/${studyId}`);
            const studyData = study.data;
            if (studyDescriptions.has(studyId)) {
                studyData.customDescription = studyDescriptions.get(studyId);
            }
            return studyData;
        }));
        res.json(studies);
    } catch (error) {
        console.error('Erreur lors de la récupération des études:', error.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const getInstances = async (req, res) => {
    try {
        const { studyId } = req.params;
        console.log(`Récupération des instances pour l’étude ${studyId}...`);
        const response = await axios.get(`${ORTHANC_URL}/studies/${studyId}/instances`);
        console.log('Instances récupérées:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Erreur lors de la récupération des instances:', error.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const getDicomFile = async (req, res) => {
    try {
        const { instanceId } = req.params;
        console.log(`Récupération du fichier DICOM: ${instanceId}`);
        const response = await axios.get(`${ORTHANC_URL}/instances/${instanceId}/file`, {
            responseType: 'arraybuffer',
            auth: {
                username: 'orthanc',
                password: 'orthanc'
            }
        });
        res.set('Content-Type', 'application/dicom');
        res.send(response.data);
    } catch (error) {
        console.error('Erreur lors de la récupération du fichier DICOM:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const uploadDicom = [
    upload.array('dicom'),
    async (req, res) => {
        try {
            console.log('Début de la fonction uploadDicom...');
            console.log('Fichiers reçus:', req.files);
            console.log('Description personnalisée reçue:', req.body.studyDescription);
            const files = req.files;
            const studyDescription = req.body.studyDescription || 'Étude sans description';
            if (!files || files.length === 0) {
                console.log('Aucun fichier fourni');
                return res.status(400).json({ error: 'Aucun fichier fourni' });
            }
            let studyId;
            for (const file of files) {
                console.log('Vérification du fichier:', file.originalname);
                const buffer = file.buffer;
                console.log('Taille du buffer:', buffer.length);
                if (buffer.length < 132) {
                    console.log(`Le fichier ${file.originalname} est trop petit pour être un DICOM`);
                    return res.status(400).json({ error: `Le fichier ${file.originalname} n’est pas un fichier DICOM valide` });
                }
                const dicmMarker = buffer.toString('ascii', 128, 132);
                console.log('Marqueur DICM détecté:', dicmMarker);
                if (dicmMarker !== 'DICM') {
                    console.log(`Le fichier ${file.originalname} n’a pas la signature DICM`);
                    return res.status(400).json({ error: `Le fichier ${file.originalname} n’est pas un fichier DICOM valide` });
                }
                console.log('Envoi du fichier à Orthanc:', file.originalname);
                console.log('URL cible:', `${ORTHANC_URL}/instances`);
                const response = await axios.post(`${ORTHANC_URL}/instances`, file.buffer, {
                    headers: { 'Content-Type': 'application/dicom' },
                    auth: {
                        username: 'orthanc',
                        password: 'orthanc'
                    },
                    timeout: 30000
                });
                console.log('Réponse Orthanc:', response.data);
                studyId = response.data.ParentStudy;
                console.log('Study ID récupéré:', studyId);
            }
            console.log('Stockage de la description personnalisée pour Study ID:', studyId);
            studyDescriptions.set(studyId, studyDescription);
            console.log('Descriptions actuelles:', Array.from(studyDescriptions.entries()));
            res.json({ message: 'Fichiers uploadés avec succès' });
        } catch (error) {
            console.error('Erreur lors de l’upload:', error.message);
            if (error.response) {
                console.error('Réponse d’erreur d’Orthanc:', error.response.data);
                console.error('Statut HTTP:', error.response.status);
            }
            res.status(500).json({ error: 'Erreur serveur: ' + (error.response ? error.response.data : error.message) });
        }
    }
];

module.exports = { getStudies, getInstances, getDicomFile, uploadDicom };