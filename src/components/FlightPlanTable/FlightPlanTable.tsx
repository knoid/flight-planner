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
import { formatDuration } from './common';
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

const TotalsTableCell = styled(TableCell)({
  fontWeight: 'bold',
});

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  '@media screen': {
    backgroundColor: lighten(theme.palette.primary.main, 0.8),
  },
}));

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
    fuel,
    legs: savedLegs,
    setLegs: setSavedLegs,
    startTime: savedStartTime,
  } = useStore();
  const [legs, setLegs] = useState<Leg[]>([]);
  const startTime = savedStartTime ? toDate(savedStartTime) : null;

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
        { altitude: '', code: poi.code, key: `${poi.code}-${nanoid()}`, poi, wind: '' },
      ]);
    }
  }

  useEffect(() => {
    if (!loading) {
      setSavedLegs(
        legs.map(({ altitude, code, notes, wind }) => ({ altitude, code, notes, wind }))
      );
    }
  }, [setSavedLegs, legs, loading]);

  function onNotesChange(modifiedIndex: number, value?: string) {
    setLegs((legs) => [
      ...legs.map((leg, index) => (index === modifiedIndex ? { ...leg, notes: value } : leg)),
    ]);
  }

  function onChangeHandler(key: 'altitude' | 'wind') {
    return function onChange(modifiedIndex: number, value: string) {
      setLegs((legs) => [
        ...legs.map((leg, index) => (index === modifiedIndex ? { ...leg, [key]: value } : leg)),
      ]);
    };
  }

  const onAltitudeChange = onChangeHandler('altitude');
  const onWindChange = onChangeHandler('wind');

  function onCopyDownHandler(key: 'altitude' | 'wind') {
    return function onCopyDown(index: number) {
      const value = legs[index][key];
      setLegs((legs) => [
        ...legs.slice(0, index + 1),
        ...legs.slice(index + 1).map((leg) => ({ ...leg, [key]: value })),
      ]);
    };
  }

  const onAltitudeCopyDown = onCopyDownHandler('altitude');
  const onWindCopyDown = onCopyDownHandler('wind');

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

  const partials = legsToPartials(legs, cruiseSpeed, fuel.capacity, fuel.flow, startTime, wmm);
  const hasAltitude = !!legs.find((leg) => leg.altitude.length > 0);
  const totalFuelConsumption = math.sum(
    ...partials.map((partial) => partial.tripFuel).filter((trip) => trip > 0)
  );
  const totalTripDuration = math.sum(
    ...partials.map((partial) => partial.ete).filter((ete) => ete > 0)
  );

  return (
    <TableContainer component={PrintFriendlyPaper}>
      <InlineTable size="small">
        <StyledTableHead>
          <TableRow>
            <TableCell />
            <TableCell colSpan={12} />
            <TableCell hideInPrint={!hasAltitude} />
            <TableCell align="center" colSpan={2}>
              Fuel
            </TableCell>
            <TableCell />
          </TableRow>
          <TableRow>
            <TableCell />
            <TableCell>#</TableCell>
            <TableCell>POI</TableCell>
            <TableCell align="center">Freq.</TableCell>
            <TableCell align="center">Aero</TableCell>
            <TableCell title="Distance [nm]">Dist.</TableCell>
            <TableCell id="altitude-label" hideInPrint={!hasAltitude}>
              Altitude
            </TableCell>
            <TableCell>Course</TableCell>
            <TableCell id="wind-label" title="Wind speed and direction [dir/speed]">
              Wind
            </TableCell>
            <TableCell title="Heading">HD</TableCell>
            <TableCell title="Ground Speed [kt]">GS</TableCell>
            <TableCell align="center" title="Estimated Time Enroute [h:m]">
              ETE
            </TableCell>
            <TableCell align="center" title="Estimated Time of Arrival [h:m]">
              ETA
            </TableCell>
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
              hasAltitude={hasAltitude}
              index={index}
              key={partial.leg.key}
              onAltitudeChange={onAltitudeChange.bind(null, index)}
              onAltitudeCopyDown={onAltitudeCopyDown.bind(null, index)}
              onMoveDown={moveLeg.bind(null, 1, index)}
              onMoveUp={moveLeg.bind(null, -1, index)}
              onNotesChange={onNotesChange.bind(null, index)}
              onRemove={removeLeg.bind(null, index)}
              onWindChange={onWindChange.bind(null, index)}
              onWindCopyDown={onWindCopyDown.bind(null, index)}
              partial={partial}
            />
          ))}
        </TableBody>
        <HideOnPrint component={TableFooter}>
          <TableRow>
            <TableCell align="right" colSpan={2}>
              Add new
            </TableCell>
            <TableCell colSpan={5}>
              <POIInput onChange={onChange} />
            </TableCell>
            <TotalsTableCell align="right" colSpan={4}>
              Totals:
            </TotalsTableCell>
            <TableCell align="center">{formatDuration(totalTripDuration)}</TableCell>
            <TableCell colSpan={2} />
            <TableCell align="center">{totalFuelConsumption.toFixed(2)}</TableCell>
            <TableCell />
            <TableCell />
          </TableRow>
        </HideOnPrint>
      </InlineTable>
    </TableContainer>
  );
}
