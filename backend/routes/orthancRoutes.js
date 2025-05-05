const express = require('express');
const router = express.Router();
const {
  getStudies,
  getInstances,
  getDicomFile,
  uploadDicom
} = require('../controllers/orthancController');

router.get('/studies', getStudies);
router.get('/studies/:studyId/instances', getInstances);
router.get('/instances/:instanceId/file', getDicomFile);
router.post('/upload-dicom', uploadDicom);

module.exports = router;
