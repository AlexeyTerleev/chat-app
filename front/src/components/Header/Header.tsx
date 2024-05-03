import React, { useState } from 'react';
import { info } from "./constants"
import { Dialog } from '../../interfaces/Dialog';
import styles from "./Header.module.css";

interface HeaderProps {
  dialogs: Dialog[],
  setDialogs: React.Dispatch<React.SetStateAction<Dialog[]>>,
}

const Header: React.FC<HeaderProps> = ({dialogs, setDialogs}) => {

  const [showInfo , setShowInfo] = useState(false);

  const convertJsonToDialog = (jsonData: any): Dialog => {
    const dialog: Dialog = {
      id: jsonData.id,
      start_with: jsonData.start_with,
      updated_at: jsonData.updated_at,
    };
    return dialog;
  };
  
  const handleCreateDialog = async () => {
    try {
      const response = await fetch('http://localhost:8000/dialogs/', {
        method: 'POST',
      });
  
      if (response.ok) {
        const responseData = await response.json(); // Parse the response body as JSON
        const newDialog = convertJsonToDialog(responseData);
        setDialogs((prevDialogs) => [...prevDialogs, newDialog]); // Add the new dialog to the existing dialogs array
      } else {
        console.error('Failed to create dialog:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error creating dialog:', error);
    }
  };

  return (
    <div className={styles.Header}>
        {
        showInfo && 
          <div className={styles.InfoWrapper} onClick={()=>{setShowInfo(!showInfo)}}>
            <div className={styles.Info} onClick={(event)=>{event.stopPropagation()}}>
              { info }
            </div>
          </div>
        }
        <div className={styles.CreateDialogWrapper}>
          <button className={styles.CreateDialog} onClick={() => handleCreateDialog()}> + Новый диалог </button>
        </div>
        
        <div className={styles.InfoBar}>
            <div className={styles.Title}> vokmatfilm </div>
            <button className={styles.Help} onClick={()=>{setShowInfo(!showInfo)}}> ? </button>
        </div>
    </div>
  );
};

export default Header;  