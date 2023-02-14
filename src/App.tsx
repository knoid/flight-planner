import { Button, CssBaseline } from '@mui/material';
import { styled } from '@mui/system';
import { useRef } from 'react';
import styles from './App.module.css';
import CruiseSpeedInput from './components/CruiseSpeedInput';
import FlightPlanTable from './components/FlightPlanTable';
import FuelCapacityInput from './components/FuelCapacityInput';
import FuelFlowInput from './components/FuelFlowInput';
import HideOnPrint from './components/HideOnPrint';
import { POIsProvider } from './components/POIsContext';
import { StoreProvider } from './components/store';
import { WorldMagneticModel } from './WorldMagneticModel';

const wmm = new WorldMagneticModel();

const Main = styled('main')({
  display: 'block',
  margin: 'auto',
  textAlign: 'center',
});

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
        <Main>
          <p>
            <CruiseSpeedInput />
            <FuelCapacityInput />
            <FuelFlowInput />
          </p>
          <p>
            <FlightPlanTable wmm={wmm} />
          </p>
        </Main>
      </POIsProvider>
    </StoreProvider>
  );
}
