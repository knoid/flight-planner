import { Typography } from '@mui/material';

import { Airport, Composite, FrequencyType, Runway } from '../openAIP';
import Labelled from './Labelled';

function similarObjects<T>(a: T, b: T, fields: (keyof T)[]) {
  return fields.every((field) => a[field] === b[field]);
}

function sameRunway(a: Runway, b: Runway) {
  return (
    Math.abs(a.trueHeading - b.trueHeading) === 180 &&
    similarObjects(a, b, [
      'mainRunway',
      'landingOnly',
      'operations',
      'pilotCtrlLighting',
      'takeOffOnly',
      // 'turnDirection',
    ]) &&
    a.surface.mainComposite === b.surface.mainComposite
  );
}

interface AirportDetailsProps {
  airport: Airport;
}

export default function AirportDetails({ airport }: AirportDetailsProps) {
  const runways = airport.runways?.reduce((accumulator: Runway[][], runway) => {
    const sameRunwayIndex = accumulator.findIndex(([runway1]) => sameRunway(runway1, runway));
    if (sameRunwayIndex >= 0) {
      accumulator[sameRunwayIndex].push(runway);
    } else {
      accumulator.push([runway]);
    }
    return accumulator;
  }, []);

  return (
    <>
      <Typography variant="subtitle1">Radios</Typography>
      {airport.frequencies
        ?.sort((a, b) => FrequencyType[a.type].localeCompare(FrequencyType[b.type]))
        .map(({ _id, name, remarks, type, value }) => (
          <Labelled key={_id} type={name || FrequencyType[type]}>
            {value} {remarks}
          </Labelled>
        ))}
      <Typography variant="subtitle1">Runways</Typography>
      {runways?.map(([runway, runway2]) => (
        <Typography key={runway._id}>
          {runway.designator} {runway2 ? `/ ${runway2.designator}` : ''}{' '}
          {Composite[runway.surface.mainComposite]}
        </Typography>
      ))}
    </>
  );
}
