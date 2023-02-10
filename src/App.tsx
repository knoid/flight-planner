import { Button, CssBaseline, TextField } from '@mui/material';
import React, { useRef, useState } from 'react';
import styles from './App.module.css';
import HideOnPrint from './components/HideOnPrint/HideOnPrint';
import { WorldMagneticModel } from './WorldMagneticModel';
import { POIsProvider } from './components/POIsContext';
import FlightPlanTable from './components/FlightPlanTable';

const wmm = new WorldMagneticModel();

export default function App() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rawCruiseSpeed, setRawCruiseSpeed] = useState('');
  const cruiseSpeed = Number(rawCruiseSpeed);

  return (
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
        <TextField
          error={isNaN(cruiseSpeed)}
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          label="Cruise speed"
          onChange={(event) => setRawCruiseSpeed(event.currentTarget.value)}
          value={rawCruiseSpeed}
        />
        <FlightPlanTable cruiseSpeed={cruiseSpeed} wmm={wmm} />
      </main>
    </POIsProvider>
  );
}
