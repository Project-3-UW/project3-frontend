import { Button, Box } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useEffect, useState } from "react";
import { IKContext, IKImage, IKUpload } from 'imagekitio-react';
import styles from "./styles.module.css";

const publicKey = 'public_t+4VajkBmNbytb2Sa80EQD4geXo=';
const urlEndpoint = 'https://ik.imagekit.io/beebyapp';
//change to server with new auth route
const authenticationEndpoint = 'http://localhost:3001/auth'||'https://beeby-backend.herokuapp.com';

const FileUploader = ({
  onFilesChange,
  multiple = false,
  showImages = true,
}) => {
  const [files, setFiles] = useState([]);
  const [filesSrc, setFilesSrc] = useState([]);
  const fileInputId = "fileinput" + Math.ceil(Math.random() * 10000);

  const handleSelectFile = (e) => {
    const newFiles = [...e.target.files].map((file) => {
      const fileID = Math.ceil(Date.now() + Math.random() * 10000);
      return {
        id: fileID,
        file,
      };
    });
    const filesData = multiple ? [...files, ...newFiles] : [...newFiles];
    setFiles(filesData);
  };

  const handleClickDelete = (fileID) => {
    setFiles(
      files.filter((file) => {
        return file.id !== fileID;
      })
    );
  };

  const onError = err => {
    console.log("Error", err);
  };
  
  const onSuccess = res => {
    console.log("Success", res);
  };
  

  const renderImages = () => {
    return filesSrc.map((image) => {
      return (
        <div className={styles.imageBox} key={image.id}>
          <img alt="" src={image.src} />
          <div
            className={styles.deleteIcon}
            onClick={() => handleClickDelete(image.id)}
          >
            <DeleteIcon />
          </div>
        </div>
      );
    });
  };

  useEffect(() => {
    if (onFilesChange instanceof Function) {
      onFilesChange(files);
    }
    let images = [];
    if (files.length === 0) {
      setFilesSrc(images);
    }
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        images.push({
          id: file.id,
          src: e.target.result,
        });
        if (images.length === files.length) {
          setFilesSrc(images);
        }
      };
      reader.readAsDataURL(file.file);
    });
  }, [files]);

  return (
    <div className={styles.wrapper}>
      <label htmlFor={fileInputId}>
        <input
          onChange={handleSelectFile}
          multiple={multiple}
          accept="image/*"
          className={styles.fileInput}
          id={fileInputId}
          type="file"
        />

      <IKContext 
        publicKey={publicKey} 
        urlEndpoint={urlEndpoint} 
        authenticationEndpoint={authenticationEndpoint}>
        <Button variant="outlined" component="span">
          Upload
        </Button>
        <IKUpload
          fileName={"users"}
          isPrivateFile={false}
          useUniqueFileName={true}
          responseFields={[""]}
          folder={"/userImg"}
          onError={onError}
          onSuccess={onSuccess}
        />
      </IKContext>
        
      </label>
      {showImages && (
        <Box width="100%" display="flex" flexWrap="wrap">
          {renderImages()}
        </Box>
      )}
    </div>
  );
};

export default FileUploader;
