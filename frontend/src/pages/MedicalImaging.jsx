import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
import * as cornerstoneMath from 'cornerstone-math';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as dicomParser from 'dicom-parser';
import Hammer from 'hammerjs';
import '../styles/MedicalImaging.css'; // Assurez-vous d'avoir ce fichier CSS pour le style

const MedicalImaging = () => {
  const viewerRef = useRef(null);
  const [studies, setStudies] = useState([]);
  const [fullList, setFullList] = useState(false);
  const [selectedInstanceId, setSelectedInstanceId] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [zoom, setZoom] = useState(1);

  // Initialisation de cornerstone et chargement des études
  useEffect(() => {
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
    cornerstoneTools.external.Hammer = Hammer;

    cornerstoneTools.init({ showSVGCursors: true });
    cornerstoneWADOImageLoader.configure({ useWebWorkers: true });

    if (viewerRef.current) {
      cornerstone.enable(viewerRef.current);
    }

    axios
      .get('http://localhost:5000/api/orthanc/studies')
      .then((res) => setStudies(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Chargement d'une instance DICOM
  const loadInstance = async (studyId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orthanc/studies/${studyId}/instances`);
      const instance = res.data[0];
      if (!instance) return;

      const imageId = `wadouri:http://localhost:5000/api/orthanc/instances/${instance.ID}/file`;
      const image = await cornerstone.loadAndCacheImage(imageId);
      cornerstone.displayImage(viewerRef.current, image);

      cornerstoneTools.addTool(cornerstoneTools.ZoomTool, {
        configuration: { invert: false },
      });
      cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 1 });

      setSelectedInstanceId(instance.ID);
    } catch (err) {
      console.error(err);
    }
  };

  // Gestion du fichier local
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      dicomParser.parseDicom(new DataView(arrayBuffer));
    } catch {
      return alert('Fichier invalide DICOM');
    }

    setUploadedFile(file);

    const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
    const image = await cornerstone.loadAndCacheImage(imageId);
    cornerstone.displayImage(viewerRef.current, image);
  };

  // Sauvegarde du fichier dans Orthanc
  const saveToOrthanc = async () => {
    const formData = new FormData();
    formData.append('dicom', uploadedFile);
    await axios.post('http://localhost:5000/api/orthanc/upload', formData);
    alert('Fichier enregistré');
  };

  // Zoom
  const updateZoom = (newZoom) => {
    if (!viewerRef.current) return;
    const viewport = cornerstone.getViewport(viewerRef.current);
    viewport.scale = newZoom;
    cornerstone.setViewport(viewerRef.current, viewport);
    setZoom(newZoom);
  };

  return (
    <div className="container" style={{ display: 'flex', gap: '2rem', height: '100vh', overflowY: 'auto', padding: '20px' }}>
      {/* Liste des études */}
      <div className="left-section">
        <h2>Études</h2>
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>ID</th>
              <th>Institution</th>
              <th>Date</th>
              <th>Heure</th>
            </tr>
          </thead>
          <tbody>
            {(fullList ? studies : studies.slice(0, 2)).map((s, i) => (
              <tr key={i} onClick={() => loadInstance(s.ID)} style={{ cursor: 'pointer' }}>
                <td>{s.MainDicomTags?.PatientName || 'Inconnu'}</td>
                <td>{s.PatientMainDicomTags?.PatientID || '—'}</td>
                <td>{s.MainDicomTags?.InstitutionName || '—'}</td>
                <td>{s.MainDicomTags?.StudyDate || '—'}</td>
                <td>{s.MainDicomTags?.StudyTime || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!fullList && <button onClick={() => setFullList(true)}>Voir toute la liste</button>}
      </div>

      {/* Visualiseur */}
      <div className="right-section">
        <h2>Visualiseur</h2>
        <div
          ref={viewerRef}
          style={{ width: 512, height: 512, background: 'black', marginBottom: '1rem' }}
        />
        <div>
          <button onClick={() => updateZoom(zoom + 0.2)}>+</button>
          <button onClick={() => updateZoom(Math.max(0.2, zoom - 0.2))}>-</button>
          <button
            onClick={() => {
              updateZoom(1);
              const viewport = cornerstone.getViewport(viewerRef.current);
              viewport.translation = { x: 0, y: 0 };
              cornerstone.setViewport(viewerRef.current, viewport);
            }}
          >
            Réinitialiser
          </button>
        </div>

        {/* Actions sur le fichier */}
        <div style={{ marginTop: '1rem' }}>
          <input type="file" onChange={handleFileChange} />
          <button onClick={saveToOrthanc} disabled={!uploadedFile}>
            Enregistrer
          </button>
          <button
            onClick={() =>
              selectedInstanceId &&
              window.open(`http://localhost:5000/api/orthanc/instances/${selectedInstanceId}/file`)
            }
          >
            Télécharger
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalImaging;
