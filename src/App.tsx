import { Button, CssBaseline } from '@mui/material';
import { useRef } from 'react';
import styles from './App.module.css';
import HideOnPrint from './components/HideOnPrint/HideOnPrint';
import { WorldMagneticModel } from './WorldMagneticModel';
import { POIsProvider } from './components/POIsContext';
import FlightPlanTable from './components/FlightPlanTable';
import { StoreProvider } from './components/store';
import CruiseSpeedInput from './components/CruiseSpeedInput';

const wmm = new WorldMagneticModel();

export default function App() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <StoreProvider>
      <POIsProvider>
        <CssBaseline />
        <HideOnPrint component="header">
          Flight Planner
          <Button type="button">Export</Button>
          <Button type="button" onClick={() => fileInputRef.current?.click()}>
            Import
          </Button>
          <input className={styles.hidden} type="file" ref={fileInputRef} />
        </HideOnPrint>
        <main>
          <CruiseSpeedInput />
          <FlightPlanTable wmm={wmm} />
        </main>
      </POIsProvider>
    </StoreProvider>
  );
}
