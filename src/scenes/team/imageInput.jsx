import React, { useState } from 'react';
import { Button, Box } from '@mui/material';

const ImageInput = ({ onImageChange }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      onImageChange(file);
    }
  };

  return (
    <Box>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="raised-button-file"
        type="file"
        onChange={handleImageChange}
      />
      <label htmlFor="raised-button-file">
        <Button variant="contained" component="span">
          Upload Image
        </Button>
      </label>
      { selectedImage && <img src={selectedImage} alt="Selected" style={{ marginTop: '20px', maxHeight: '200px' }} />}
    </Box>
  );
};

export default ImageInput;
