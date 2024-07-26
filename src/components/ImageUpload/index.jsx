import React, { useState } from 'react';
import ImagePreview from './ImagePreview';
import preview from '../../assets/preview.png';
import './ImageUpload.css';
import { Button, Modal, Box, Typography, Grid, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ImageUpload = ({ onFilesChange, files, setFiles }) => {
  const [error, setError] = useState('');
  const [url, setUrl] = useState('');
  const [dragging, setDragging] = useState(false);
  const [title, setTitle] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const allowedDimensions = {
    'Square and Rectangle': [
      { width: 200, height: 200 },
      { width: 250, height: 250 },
      { width: 300, height: 250 },
      { width: 300, height: 300 },
      { width: 320, height: 320 },
      { width: 336, height: 280 },
      { width: 1200, height: 1200 }, 
      { width: 1200, height: 1500 },
      { width: 1200, height: 628 },
      { width: 1080, height: 1080 },
      { width: 1920, height: 1080 },
    ],
    Skyscraper: [
      { width: 120, height: 600 },
      { width: 160, height: 600 },
      { width: 300, height: 600 },
      { width: 300, height: 1050 },
    ],
    Leaderboard: [
      { width: 468, height: 60 },
      { width: 728, height: 90 },
      { width: 800, height: 250 },
      { width: 970, height: 90 },
      { width: 970, height: 250 },
      { width: 1200, height: 300 },
    ],
    Mobile: [
      { width: 300, height: 50 },
      { width: 300, height: 100 },
      { width: 320, height: 50 },
      { width: 320, height: 100 },
      { width: 320, height: 480 },
      { width: 360, height: 592 },
      { width: 360, height: 640 },
      { width: 375, height: 667 },
      { width: 600, height: 600 },
    ],
    Landscape: [
      { width: 600, height: 314 },
      { width: 1200, height: 628 },
      { width: 1200, height: 1200 },
    ],
    Portrait: [
      { width: 320, height: 400 },
      { width: 480, height: 600 },
      { width: 1200, height: 1500 },
      { width: 960, height: 1200 },
    ],
    Logo: [
      { width: 128, height: 128 },
      { width: 144, height: 144 },
      { width: 512, height: 128 },
      { width: 1200, height: 1200 },
      { width: 1200, height: 300 },
    ]
  };

  const isValidDimension = (width, height) => {
    return Object.values(allowedDimensions).flat().some(dim => dim.width === width && dim.height === height);
  };

  const updateImageDimensions = (fileList) => {
    const validFiles = [];

    fileList.forEach((file) => {
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
              setError(`Invalid image dimensions: ${img.width}x${img.height}.`);
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

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

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
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <Button variant="outlined" onClick={handleOpenModal}>
            Show Allowed Dimensions
          </Button>
        </div>
      )}
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
        <Button variant="contained" color="primary" onClick={handleUrlUpload}>
          Import
        </Button>
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

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className='dimension-modal'
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 700,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          overflowY: 'auto',
        }}>
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="modal-title" variant="h5" component="h2" gutterBottom>
            Allowed Dimensions 
          </Typography> 
          <Box sx={{ mt: 2 }}>
            {Object.entries(allowedDimensions).map(([category, dimensions]) => (
              <Box key={category} sx={{ mb: 3 }}>
                <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                  {category}
                </Typography>
                <Grid container spacing={2}>
                  {dimensions.map((dim, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Box sx={{
                        border: '1px solid #ddd',
                        borderRadius: 1,
                        p: 1,
                        textAlign: 'center',
                        bgcolor: '#f9f9f9',
                      }}>
                        <Typography variant="body2">{`${dim.width} × ${dim.height}`}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ImageUpload;
