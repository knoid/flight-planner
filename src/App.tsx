import { createTheme, CssBaseline, lighten, Link, styled, ThemeProvider } from '@mui/material';
import FlightPlanTable from './components/FlightPlanTable';
import HideOnPrint from './components/HideOnPrint';
import Metadata from './components/Metadata';
import { POIsProvider } from './components/POIsContext';
import { StoreProvider } from './components/store';
import CruiseSpeedInput from './components/TextFields/CruiseSpeedInput';
import FuelCapacityInput from './components/TextFields/FuelCapacityInput';
import FuelFlowInput from './components/TextFields/FuelFlowInput';
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
  margin: '1em',
});

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
  return (
    <StoreProvider>
      <POIsProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <HideOnPrint component="header">
            <Section>
              <InfoLink
                href="http://ais.anac.gov.ar/notam"
                rel="noopener noreferrer"
                target="_blank"
              >
                NOTAM
              </InfoLink>
              <InfoLink
                href="https://www.smn.gob.ar/meteorologia-aeronautica"
                rel="noopener noreferrer"
                target="_blank"
              >
                SMN
              </InfoLink>
            </Section>
          </HideOnPrint>
          <Main>
            <Metadata />
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
