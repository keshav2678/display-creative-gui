import React from 'react';
import { Modal, Box, IconButton, Button, InputBase } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LinkIcon from '@mui/icons-material/Link';


const LinkModal = ({ open, onClose, displayUrl }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(displayUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="link-modal-box">
        <header className="header">
          <span>Display Url</span>
          <IconButton className="close-button" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </header>
        <div className="field">
          <LinkIcon className="url-icon" />
          <InputBase className="input" value={displayUrl} readOnly />
          <Button className="copy-button" onClick={handleCopy}>
            Copy
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default LinkModal;
