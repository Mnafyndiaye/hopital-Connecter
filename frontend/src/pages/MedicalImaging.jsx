import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
import * as cornerstoneMath from 'cornerstone-math';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as dicomParser from 'dicom-parser';

const MedicalImaging = () => {
  const viewerRef = useRef(null);
  const [studies, setStudies] = useState([]);
  const [fullList, setFullList] = useState(false);
  const [selectedInstanceId, setSelectedInstanceId] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath;

    cornerstoneTools.init();
    cornerstoneWADOImageLoader.configure({ useWebWorkers: true });

    cornerstone.enable(viewerRef.current);

    axios
      .get('http://localhost:5000/api/orthanc/studies')
      .then((res) => setStudies(res.data))
      .catch((err) => console.error(err));
  }, []);

  const loadInstance = async (studyId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/orthanc/studies/${studyId}/instances`
      );
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const buffer = await file.slice(0, 132).arrayBuffer();
    const view = new DataView(buffer);
    const isDicom =
      String.fromCharCode(...[128, 129, 130, 131].map((i) => view.getUint8(i))) === 'DICM';
    if (!isDicom) return alert('Fichier invalide');

    setUploadedFile(file);

    const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
    const image = await cornerstone.loadAndCacheImage(imageId);
    cornerstone.displayImage(viewerRef.current, image);
  };

  const saveToOrthanc = async () => {
    const formData = new FormData();
    formData.append('dicom', uploadedFile);
    await axios.post('http://localhost:5000/api/orthanc/upload', formData);
    alert('Fichier enregistré');
  };

  return (
    <div className="container" style={{ display: 'flex', gap: '2rem' }}>
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

      <div className="right-section">
        <h2>Visualiseur</h2>
        <div
          ref={viewerRef}
          style={{ width: 512, height: 512, background: 'black', marginBottom: '1rem' }}
        />
        <div>
          <button
            onClick={() =>
              setZoom((z) => {
                const newZoom = z + 0.2;
                cornerstone.setViewport(viewerRef.current, { scale: newZoom });
                return newZoom;
              })
            }
          >
            +
          </button>
          <button
            onClick={() =>
              setZoom((z) => {
                const newZoom = Math.max(0.2, z - 0.2);
                cornerstone.setViewport(viewerRef.current, { scale: newZoom });
                return newZoom;
              })
            }
          >
            -
          </button>
          <button
            onClick={() => {
              setZoom(1);
              cornerstone.setViewport(viewerRef.current, {
                scale: 1,
                translation: { x: 0, y: 0 },
              });
            }}
          >
            Réinitialiser
          </button>
        </div>
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
