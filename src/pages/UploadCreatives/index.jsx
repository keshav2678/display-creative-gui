import React, { useState, useContext } from 'react';
import { PackageContext } from '../../context/PackageContext';
import ImageUpload from '../../components/ImageUpload';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import './UploadCreatives.css';

const UploadCreatives = () => {
  const { selectedPackage } = useContext(PackageContext);
  const [files, setFiles] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  const handleFilesChange = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      setSnackbar({ open: true, message: 'Please upload at least one image.', severity: 'warning' });
      return;
    }

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`creative_name${index}`, file.name);
      formData.append(`file${index}`, file.file);
      formData.append(`width${index}`, file.width);
      formData.append(`height${index}`, file.height);
    });
    formData.append('package_name', selectedPackage);

    try {
      const response = await axios.post('https://qt8flde415.execute-api.ap-south-1.amazonaws.com/upload_creative', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Response:', response.data);
      setFiles([]);
      setSnackbar({ open: true, message: 'Creative uploaded successfully!', severity: 'success' });

    } catch (error) {
      console.error('Error:', error.message);
      setSnackbar({ open: true, message: `Error: ${error.message}`, severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: '' });
  };

  if (!selectedPackage) {
    return <div className="message">Please choose a package to move forward.</div>;
  }

  return (
    <div className="upload-creatives">
      <ImageUpload onFilesChange={handleFilesChange} files={files} setFiles={setFiles} />
      <div className='btn-container'>
        <button className="btn" onClick={handleSubmit}>Done</button>
      </div>
      <Snackbar  anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UploadCreatives;
