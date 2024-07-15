import React, { useState } from 'react';
import ImagePreview from './ImagePreview';
import preview from '../../assets/preview.png';
import './ImageUpload.css';

const ImageUpload = ({ onFilesChange, files, setFiles }) => {
  const [error, setError] = useState('');
  const [url, setUrl] = useState('');
  const [dragging, setDragging] = useState(false);
  const [title, setTitle] = useState('');

  const allowedDimensions = [
    { width: 468, height: 60 },
    { width: 250, height: 250 },
    { width: 728, height: 90 },
    { width: 970, height: 90 },
    { width: 200, height: 200 },
    { width: 320, height: 100 },
    { width: 120, height: 600 },
    { width: 160, height: 600 },
    { width: 300, height: 600 },
    { width: 300, height: 250 },
    { width: 336, height: 280 },
  ];

  const isValidDimension = (width, height) => {
    return allowedDimensions.some(dim => dim.width === width && dim.height === height);
  };

  const updateImageDimensions = (fileList) => {
    const validFiles = [];

    fileList.forEach((file, index) => {
      if (file.type === 'file') {
        const reader = new FileReader();
        reader.readAsDataURL(file.file);
        reader.onload = (e) => {
          const img = new Image();
          img.src = e.target.result;
          img.onload = () => {
            if (isValidDimension(img.width, img.height)) {
              file.width = img.width;
              file.height = img.height;
              validFiles.push(file);
              if (validFiles.length === fileList.length) {
                setFiles(prevFiles => [...prevFiles, ...validFiles]);
                onFilesChange([...files, ...validFiles]);
              }
            } else {
              setError(`Invalid image dimensions: ${img.width}x${img.height}. Allowed dimensions: ${allowedDimensions.map(dim => `${dim.width}x${dim.height}`).join(', ')}`);
            }
          };
        };
      }
    });
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files).map(file => ({
      file,
      name: file.name,
      width: 0,
      height: 0,
      type: 'file',
    }));
    validateAndSetFiles(selectedFiles);
  };

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleUrlUpload = () => {
    if (files.length >= 3) {
      setError('You can only upload a maximum of 3 images.');
      return;
    }

    if (url && title) {
      const newFile = {
        file: url,
        name: title,
        url: url,
        width: 0,
        height: 0,
        type: 'url',
      };

      const newFiles = [...files, newFile];
      setFiles(newFiles);
      onFilesChange(newFiles);
      setUrl('');
      setTitle('');
      setError('');
    } else {
      setError('Please enter a valid URL and title.');
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const droppedFiles = Array.from(event.dataTransfer.files).map(file => ({
      file,
      name: file.name,
      width: 0,
      height: 0,
      type: 'file',
    }));
    validateAndSetFiles(droppedFiles);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const validateAndSetFiles = (selectedFiles) => {
    const validFileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];

    if (selectedFiles.length + files.length > 3) {
      setError('You can only upload a maximum of 3 images.');
      return;
    }

    for (let file of selectedFiles) {
      if (file.type === 'file' && !validFileTypes.includes(file.file.type)) {
        setError('Only PNG, JPG, JPEG, and WEBP files are allowed.');
        return;
      }
    }

    updateImageDimensions(selectedFiles);
    setError('');
  };

  const handleDelete = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const handleSave = (fileToUpdate, title, width, height) => {
    const updatedFiles = files.map((file, idx) => {
      if (file === fileToUpdate) {
        return { ...file, name: title, width, height };
      }
      return file;
    });
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  return (
    <div className="image-upload">
      <div
        className={`upload-box ${dragging ? 'dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept=".png,.jpg,.jpeg,.webp"
          onChange={handleFileChange}
          hidden
        />
        <label htmlFor="file-upload" className="upload-label">
          <div className="upload-area">
            <img src={preview} alt="Upload Icon" />
            <p>Drop your image here, or <span>browse</span></p>
            <p>Supports: PNG, JPG, JPEG, WEBP</p>
          </div>
        </label>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="separator">or</div>
      <h3>Import From URL</h3>
      <div className="url-upload">
        <input
          type="text"
          placeholder="Add file URL"
          value={url}
          onChange={handleUrlChange}
        />
        <input
          type="text"
          placeholder="Add title"
          value={title}
          onChange={handleTitleChange}
        />
        <button onClick={handleUrlUpload}>Import</button>
      </div>
      <div className="file-previews">
        {files.map((file, index) => (
          <ImagePreview
            key={index}
            file={file}
            onDelete={() => handleDelete(index)}
            onSave={handleSave}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
