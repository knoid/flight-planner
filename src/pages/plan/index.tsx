import { lighten, Link, styled } from '@mui/material';

import { useI18nContext } from '../../i18n/i18n-react';
import { WorldMagneticModel } from '../../utils/WorldMagneticModel';
import AirportsTable from './components/AirportsTable';
import FlightPlanTable from './components/FlightPlanTable';
import HideOnPrint from './components/HideOnPrint';
import Metadata from './components/Metadata';
import CruiseSpeedInput from './components/TextFields/CruiseSpeedInput';
import FuelTextField from './components/TextFields/FuelTextField';

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
  display: 'flex',
  flexDirection: 'column',
  '@media screen': {
    backgroundColor: lighten(theme.palette.primary.main, 0.8),
  },
  '@media print': {
    margin: 0,
    padding: '0.5em',
  },
  [theme.breakpoints.up('sm')]: {
    display: 'inline-flex',
    flexDirection: 'row',
  },
}));

export const Component = function PlanPage() {
  const { LL } = useI18nContext();
  return (
    <>
      <HideOnPrint component="header">
        <Section>
          <InfoLink href="http://ais.anac.gov.ar/notam" rel="noopener noreferrer" target="_blank">
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
          <FuelTextField label={LL.fuelCapacity()} name="capacity" />
          <FuelTextField label={LL.fuelReserve()} name="reserve" />
          <FuelTextField label={LL.fuelFlow()} name="flow" />
        </Fieldset>
        <Section>
          <FlightPlanTable wmm={wmm} />
        </Section>
        <Section>
          <AirportsTable />
        </Section>
      </Main>
    </>
  );
};
