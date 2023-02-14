import {
  Paper,
  styled,
  Table,
  TableBody,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from '@mui/material';
import { nanoid } from 'nanoid';
import { SyntheticEvent, useContext, useEffect, useState } from 'react';
import { WorldMagneticModel } from '../../WorldMagneticModel';
import HideOnPrint from '../HideOnPrint';
import * as math from '../math';
import POIInput from '../POIInput';
import POIsContext, { POI } from '../POIsContext';
import { useStore } from '../store';
import legsToPartials, { Leg } from './legsToPartials';
import TableCell from './TableCell';
import WaypointRow from './WaypointRow';

const PrintFriendlyPaper = styled(Paper)({
  '&&': { // https://github.com/styled-components/styled-components/issues/1816#issuecomment-398454088
    display: 'inline-block',
    width: 'auto',
  }
});

const InlineTable = styled(Table)({
  '@media print': {
    '& td:first-child, & th:first-child': {
      display: 'none',
    },
  },
  '& th': {
    fontWeight: 'bold'
  }
});

interface FlightPlanTableProps {
  wmm: WorldMagneticModel;
}

export default function FlightPlanTable({ wmm }: FlightPlanTableProps) {
  const {
    cruiseSpeed,
    fuelCapacity,
    fuelFlow,
    legs: savedLegs,
    setLegs: setSavedLegs,
  } = useStore();
  const [legs, setLegs] = useState<Leg[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  function onETAChange(value: string) {
    const date = new Date();
    const [hours, minutes] = value.split(':');
    date.setHours(+hours);
    date.setMinutes(+minutes);
    date.setSeconds(0);
    setStartTime(date);
  }

  const { options, loading } = useContext(POIsContext);
  useEffect(() => {
    if (!loading && options.length > 0) {
      setLegs(
        savedLegs
          .map(([code, wind]) => ({
            poi: options.find((poi) => poi.code === code),
            wind,
          }))
          .filter((leg): leg is Leg => !!leg.poi)
          .map(({ poi, wind }) => ({
            key: `${poi.code}-${nanoid()}`,
            poi,
            wind,
          }))
      );
    }
  }, [loading, options]);

  function onChange(event: SyntheticEvent, poi: POI | null) {
    if (poi) {
      setLegs((legs) => [...legs, { key: nanoid(), poi, wind: '' }]);
    }
  }

  useEffect(() => {
    if (!loading) {
      setSavedLegs(legs.map((leg) => [leg.poi.code, leg.wind]));
    }
  }, [setSavedLegs, legs, loading]);

  function onWindChange(modifiedIndex: number, value: string) {
    setLegs((legs) => [
      ...legs.map((leg, index) => (index === modifiedIndex ? { ...leg, wind: value } : leg)),
    ]);
  }

  function onWindCopyDown(index: number) {
    const value = legs[index].wind;
    setLegs((legs) => [
      ...legs.slice(0, index + 1),
      ...legs.slice(index + 1).map((leg) => ({ ...leg, wind: value })),
    ]);
  }

  function moveLeg(dir: number, index: number) {
    setLegs((legs) => {
      const tmp = [...legs];
      [tmp[index], tmp[index + dir]] = [tmp[index + dir], tmp[index]];
      return tmp;
    });
  }

  function removeLeg(index: number) {
    setLegs((legs) => legs.filter((leg, position) => position !== index));
  }

  const partials = legsToPartials(legs, cruiseSpeed, fuelCapacity, fuelFlow, startTime, wmm);

  return (
    <TableContainer component={PrintFriendlyPaper}>
      <InlineTable size="small">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell colSpan={12} />
            <TableCell align="center" colSpan={2}>
              Fuel
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell />
            <TableCell>#</TableCell>
            <TableCell>POI</TableCell>
            {/* <TableCell>GND</TableCell> */}
            <TableCell>COM</TableCell>
            {/* <TableCell>VOR</TableCell> */}
            <TableCell>Aero</TableCell>
            {/* <TableCell></TableCell> */}
            {/* <TableCell></TableCell> */}
            {/* <TableCell></TableCell> */}
            <TableCell title="Distance [nm]">Dist.</TableCell>
            {/* <TableCell></TableCell> */}
            <TableCell>Course</TableCell>
            <TableCell id="wind-label" title="Wind speed and direction [dir/speed]">
              Wind
            </TableCell>
            <TableCell title="Heading">HD</TableCell>
            <TableCell title="Ground Speed [kt]">GS</TableCell>
            <TableCell title="Estimated Time Enroute [h:m]">ETE</TableCell>
            <TableCell title="Estimated Time of Arrival [h:m]">ETA</TableCell>
            <TableCell>Real</TableCell>
            <TableCell>Trip</TableCell>
            <TableCell title="Remaining">Rem</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {partials.map((partial, index) => (
            <WaypointRow
              disableDown={index === legs.length - 1}
              disableUp={index === 0}
              index={index}
              key={partial.leg.key}
              onETAChange={onETAChange}
              onMoveDown={moveLeg.bind(null, 1, index)}
              onMoveUp={moveLeg.bind(null, -1, index)}
              onRemove={removeLeg.bind(null, index)}
              onWindChange={onWindChange.bind(null, index)}
              onWindCopyDown={onWindCopyDown.bind(null, index)}
              partial={partial}
              totalTime={math.sum(
                ...partials.map((partial) => partial.ete).filter((ete) => ete > 0)
              )}
            />
          ))}
        </TableBody>
        <HideOnPrint component={TableFooter}>
          <TableRow>
            <TableCell align="right" colSpan={2}>
              Add new
            </TableCell>
            <TableCell colSpan={7}>
              <POIInput onChange={onChange} />
            </TableCell>
          </TableRow>
        </HideOnPrint>
      </InlineTable>
    </TableContainer>
  );
}
