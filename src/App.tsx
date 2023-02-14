import { Button, createTheme, CssBaseline, lighten, Link, ThemeProvider } from '@mui/material';
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

const Section = styled('div')({
  margin: '1.5em 0',
  textAlign: 'center',
});

const InfoLink = styled(Link)({
  margin: '1em'
})

const Fieldset = styled(Section)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  display: 'inline-block',
  padding: '1.2em',
  '@media screen': {
    backgroundColor: lighten(theme.palette.primary.main, 0.8),
  },
  '@media print': {
    margin: 0,
    padding: '0.5em',
  },
}));

const theme = createTheme();

export default function App() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <StoreProvider>
      <POIsProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <HideOnPrint component="header">
            Flight Planner
            <Button type="button">Export</Button>
            <Button type="button" onClick={() => fileInputRef.current?.click()}>
              Import
            </Button>
            <input className={styles.hidden} type="file" ref={fileInputRef} />
            <Section>
              <InfoLink href="http://ais.anac.gov.ar/notam" rel="noopener noreferrer" target="_blank">NOTAM</InfoLink>
              <InfoLink href="https://www.smn.gob.ar/metar" rel="noopener noreferrer" target="_blank">SMN</InfoLink>
            </Section>
          </HideOnPrint>
          <Main>
            <Fieldset>
              <CruiseSpeedInput />
              <FuelCapacityInput />
              <FuelFlowInput />
            </Fieldset>
            <Section>
              <FlightPlanTable wmm={wmm} />
            </Section>
          </Main>
        </ThemeProvider>
      </POIsProvider>
    </StoreProvider>
  );
}
