import React from 'react';
import { Dialog } from "../../../interfaces/Dialog";
import styles from "./DialogMenu.module.css";



interface DialogSideProps {
  dialog: Dialog,
  setActiveDialog: React.Dispatch<React.SetStateAction<Dialog | undefined>>,
  className?: string; 
}

const DialogSide: React.FC<DialogSideProps> = ({dialog, setActiveDialog, className}) => {

  return (
    <div className={`${styles.Dialog} ${className}`} onClick={()=>setActiveDialog(dialog)}>
        {dialog.start_with}
    </div>
  );
};


interface DialogMenuProps {
  activeDialogKey: number | undefined,
  dialogs: Dialog[],
  setActiveDialog: React.Dispatch<React.SetStateAction<Dialog | undefined>>,
}

const DialogMenu: React.FC<DialogMenuProps> = ({activeDialogKey, dialogs, setActiveDialog}) => {

  return (
    <div className={styles.DialogMenuContainet}>
        {
          dialogs.map(
            (dialog) => 
            <DialogSide
              key={dialog.id}
              dialog={dialog}
              setActiveDialog={setActiveDialog}
              className={activeDialogKey === dialog.id ? styles.Active : ""}
            />
          )
        }
    </div>
  );
};

export default DialogMenu;  