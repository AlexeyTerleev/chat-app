import React, { useEffect } from 'react';
import DialogMenu from './DialogMenu/DialogMenu';
import DialogArea from './DialogArea/DialogArea';
import { Dialog } from '../../interfaces/Dialog';

import styles from "./Body.module.css";

interface Body {
    dialogs: Dialog[],
    activeDialog: Dialog | undefined,
    setActiveDialog: React.Dispatch<React.SetStateAction<Dialog | undefined>>,
}



const Body: React.FC<Body> = ({dialogs, activeDialog, setActiveDialog}) => {

    return (
        <div className={styles.Body}>
            <div className={styles.SideBar}>
                <DialogMenu activeDialogKey={activeDialog?.id} dialogs={dialogs} setActiveDialog={setActiveDialog} />
            </div>
            <div className={styles.MainArea}>
                <DialogArea dialog={activeDialog} setDialog={setActiveDialog} />
            </div>
        </div>
    );
};

export default Body;  