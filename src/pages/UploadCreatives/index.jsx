import React, { useState, useContext } from 'react';
import { PackageContext } from '../../context/PackageContext';
import ImageUpload from '../../components/ImageUpload';
import axios from 'axios';
import './UploadCreatives.css';

const UploadCreatives = () => {
  const { selectedPackage } = useContext(PackageContext);
  const [files, setFiles] = useState([]);

  const handleFilesChange = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleSubmit = async () => {
    console.log(files)
    if (files.length === 0) {
      alert('Please upload at least one image.');
      return;
    }

    const formData = new FormData();
    files.forEach((file, index) => {
      console.log(file)
      formData.append(`creative_name${index}`,file.name) ;
      formData.append(`file${index}`, file.file);
      formData.append(`width${index}`,file.width);
      formData.append(`height${index}`,file.height)

    });
    formData.append('package_name', selectedPackage); // Ensure selectedPackage is correctly set

    try {
      const response = await axios.post('https://qt8flde415.execute-api.ap-south-1.amazonaws.com/upload_creative', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Response:', response.data);
      setFiles([])

    } catch (error) {
      console.error('Error:', error.message);
      // Optionally handle error here
    }
  };

  if (!selectedPackage) {
    return <div className="message">Please choose a package to move forward.</div>;
  }

  return (
    <div className="upload-creatives">
      <ImageUpload onFilesChange={handleFilesChange} files={files} setFiles={setFiles}/>
      <div className='btn-container'>
        <button className="btn" onClick={handleSubmit}>Done</button>
      </div>
    </div>
  );
};

export default UploadCreatives;
