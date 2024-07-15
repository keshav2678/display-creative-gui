import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slider } from '@material-ui/core';
import getCroppedImg from './cropImage';

const CropModal = ({ open, onClose, image, onSave, allowedDimensions }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    const croppedImage = await getCroppedImg(image, croppedAreaPixels);
    onSave(croppedImage);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Crop Image</DialogTitle>
      <DialogContent>
        <div style={{ position: 'relative', width: '100%', height: 400 }}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={allowedDimensions.width / allowedDimensions.height}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e, zoom) => setZoom(zoom)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CropModal;
