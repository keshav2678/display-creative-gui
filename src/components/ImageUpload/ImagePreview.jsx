import React, { useState, useEffect } from 'react';
// import { FaCheck } from 'react-icons/fa';
// import { MdDelete, MdEdit } from "react-icons/md";

const ImagePreview = ({ file, onDelete, onSave }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(file.name);
  const [width, setWidth] = useState(file.width);
  const [height, setHeight] = useState(file.height);

  useEffect(() => {
    if (file.type === 'url') {
      setImageUrl(file.url);
    } else if (file.file) {
        console.log({file1:file})
        if (file.width && file.height) {
            setWidth(file.width);
        setHeight(file.height);
        }
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
        const img = new Image();
        img.src = e.target.result;
        if (!(file.width && file.height)) {
            img.onload = () => {
                setWidth(img.width);
                setHeight(img.height);
              };
        }
      };
      reader.readAsDataURL(file.file);
    }
  }, [file]);

  // const handleEditClick = () => {
  //   setEditing(true);
  // };

  // const handleSaveClick = () => {
  //   setEditing(false);
  //   onSave(file, title, width, height); // Pass updated width and height to parent
  // };

  return (
    <div className="image-preview">
      <img src={imageUrl} alt={file.name} className="thumbnail" />
      <div className={`details ${editing ? "details-edit" : ""}`}>
        {editing ? (
          <>
            <div className='name-edit'>
              <label>Name</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className='dimension-edit'>
              <label>Width</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value))}
                min="0"
              />
            </div>
            <div className='dimension-edit'>
              <label>Height</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value))}
                min="0"
              />
            </div>
          </>
        ) : (
          <>
            <p style={{
              width: '40%',
              margin: '0px 0px 5px',
              textAlign: 'left'
            }}>{title}</p>
            <p style={{
              width: '15%',
              margin: '0px 0px',
              textAlign: 'left'
            }}>{width} x {height} px</p>
            {file.type === 'url' && (
              <p style={{
                width: '100%',
                margin: '5px 0px',
                textAlign: 'left'
              }}>{file.url}</p>
            )}
          </>
        )}
      </div>
      {/* <div className="actions">
        {editing ? (
          <FaCheck onClick={handleSaveClick} />
        ) : (
          <MdEdit onClick={handleEditClick} />
        )}
        <MdDelete onClick={onDelete} />
      </div> */}
    </div>
  );
};

export default ImagePreview;
