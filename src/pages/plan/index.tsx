import { Link, styled } from '@mui/material';

import Section from '../../components/Section';
import { WorldMagneticModel } from '../../utils/WorldMagneticModel';
import AirportsTable from './components/AirportsTable';
import FlightPlanTable from './components/FlightPlanTable';
import HideOnPrint from './components/HideOnPrint';
import Metadata from './components/Metadata';

const wmm = new WorldMagneticModel();

const Main = styled('main')({
  display: 'block',
  margin: 'auto',
  textAlign: 'center',
});

const InfoLink = styled(Link)({
  margin: '1em',
});

export const Component = function PlanPage() {
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
