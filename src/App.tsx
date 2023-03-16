import { createTheme, CssBaseline, lighten, Link, styled, ThemeProvider } from '@mui/material';
import AirportsTable from './components/AirportsTable';
import FlightPlanTable from './components/FlightPlanTable';
import HideOnPrint from './components/HideOnPrint';
import { LegsProvider } from './components/LegsContext';
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

const Section = styled('div')(({ theme }) => ({
  margin: '0.5em 0',
  textAlign: 'center',
  [theme.breakpoints.up('sm')]: {
    margin: '1.5em 0',
  },
}));

const InfoLink = styled(Link)({
  margin: '1em',
});

const Fieldset = styled(Section)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  display: 'inline-flex',
  padding: '1.2em 0',
  '@media screen': {
    backgroundColor: lighten(theme.palette.primary.main, 0.8),
  },
  '@media print': {
    margin: 0,
    padding: '0.5em',
  },
  [theme.breakpoints.up('sm')]: {
    padding: '1.2em',
  },
}));

const theme = createTheme();

export default function App() {
  return (
    <StoreProvider>
      <POIsProvider>
        <LegsProvider>
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
              <Section>
                <AirportsTable />
              </Section>
            </Main>
          </ThemeProvider>
        </LegsProvider>
      </POIsProvider>
    </StoreProvider>
  );
}
