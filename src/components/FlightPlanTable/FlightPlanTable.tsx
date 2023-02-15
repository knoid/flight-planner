import {
  lighten,
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
  '&&': {
    // https://github.com/styled-components/styled-components/issues/1816#issuecomment-398454088
    display: 'inline-block',
    width: 'auto',
  },
});

const InlineTable = styled(Table)({
  '@media print': {
    '& td:first-of-type, & th:first-of-type, & td:last-of-type, & th:last-of-type': {
      display: 'none',
    },
  },
  '& th': {
    fontWeight: 'bold',
  },
});

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  '@media screen': {
    backgroundColor: lighten(theme.palette.primary.main, .8)
  }
}))

interface FlightPlanTableProps {
  wmm: WorldMagneticModel;
}

function toDate(value: string) {
  const [hours, minutes] = value.split(':');
  const date = new Date();
  date.setHours(+hours);
  date.setMinutes(+minutes);
  date.setSeconds(0);
  return date;
}

export default function FlightPlanTable({ wmm }: FlightPlanTableProps) {
  const {
    cruiseSpeed,
    fuelCapacity,
    fuelFlow,
    legs: savedLegs,
    setLegs: setSavedLegs,
    startTime: savedStartTime,
  } = useStore();
  const [legs, setLegs] = useState<Leg[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(savedStartTime ? toDate(savedStartTime) : null);
  function onETAChange(value: string) {
    setStartTime(toDate(value));
  }

  const { options, loading } = useContext(POIsContext);
  useEffect(() => {
    if (loading) {
      setLegs(savedLegs.map((leg) => ({ key: `${leg.code}-${nanoid()}`, ...leg })));
    } else if (!loading && options.length > 0) {
      setLegs((legs) =>
        legs.map((leg) => ({
          ...leg,
          poi: options.find((poi) => poi.code === leg.code),
        }))
      );
    } else {
      // error loading data
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, options]);

  function onChange(event: SyntheticEvent, poi: POI | null) {
    if (poi) {
      setLegs((legs) => [
        ...legs,
        { code: poi.code, key: `${poi.code}-${nanoid()}`, poi, wind: '' },
      ]);
    }
  }

  useEffect(() => {
    if (!loading) {
      setSavedLegs(legs.map(({ code, notes, wind }) => ({ code, notes, wind })));
    }
  }, [setSavedLegs, legs, loading]);

  function onNotesChange(modifiedIndex: number, value?: string) {
    setLegs((legs) => [
      ...legs.map((leg, index) => (index === modifiedIndex ? { ...leg, notes: value } : leg)),
    ]);
  }

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
        <StyledTableHead>
          <TableRow>
            <TableCell />
            <TableCell colSpan={12} />
            <TableCell align="center" colSpan={2}>
              Fuel
            </TableCell>
            <TableCell />
          </TableRow>
          <TableRow>
            <TableCell />
            <TableCell>#</TableCell>
            <TableCell>POI</TableCell>
            {/* <TableCell align='center'>GND</TableCell> */}
            <TableCell align='center'>COM</TableCell>
            {/* <TableCell align='center'>VOR</TableCell> */}
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
            <TableCell />
          </TableRow>
        </StyledTableHead>
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
              onNotesChange={onNotesChange.bind(null, index)}
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
