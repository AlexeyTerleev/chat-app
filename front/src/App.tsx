
import Header from './components/Header/Header';
import Body from './components/Body/Body';
import styles from "./App.module.css";

import { Dialog } from './interfaces/Dialog';
import { useEffect, useState } from 'react';


function App() {

  const [dialog, setDialog] = useState<Dialog | undefined>();
  const [dialogs, setDialogs] = useState<Dialog[]>([]);

  const convertJsonToDialog = (jsonData: any) : Dialog => {
      const dialog: Dialog = {
          id: jsonData.id,
          start_with: jsonData.start_with,
          updated_at: jsonData.updated_at,
      };
      return dialog;
  }
  useEffect(
      () => {
          const fetchData = async () => {
              try {
                  const response = await fetch('http://localhost:8000/dialogs/');
                  if (!response.ok) {
                      throw new Error('Failed to fetch dialogs');
                  }
                  const data = await response.json();
                  const sortedDialogs = data.map((d: any) => convertJsonToDialog(d)).sort((a, b) => {
                      return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
                  });
                  setDialogs(sortedDialogs);
                  if (sortedDialogs.length > 0) {
                    setDialog(sortedDialogs[sortedDialogs.length - 1]);
                  }
              } catch (error) {
                  console.error(error);
              }
          };
          fetchData();
      }, []
  )

  useEffect(() => {
      if (dialogs.length > 0) {
        setDialog(dialogs[dialogs.length - 1]);
      }
  }, [dialogs]);


  return (
    <div className={styles.AppWrapper}>
      <Header dialogs={dialogs} setDialogs={setDialogs}/>
      <Body dialogs={dialogs} activeDialog={dialog} setActiveDialog={setDialog} />
    </div>
  )
}

export default App
