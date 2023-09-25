import {
  Checkbox,
  FormControlLabel,
  styled,
  TableBody,
  TableFooter,
  TableRow,
} from '@mui/material';
import { nanoid } from 'nanoid';
import { SyntheticEvent } from 'react';

import fuelUnits from '../../../../components/fuelUnits';
import { useLegs } from '../../../../components/LegsContext';
import * as math from '../../../../components/math';
import { POI } from '../../../../components/POIsContext';
import { useStore } from '../../../../components/store';
import { useI18nContext } from '../../../../i18n/i18n-react';
import timeToDate from '../../../../utils/timeToDate';
import { WorldMagneticModel } from '../../../../utils/WorldMagneticModel';
import HideOnPrint from '../HideOnPrint';
import POIInput from '../POIInput';
import Table, { TableCell, TableHead } from '../Table';
import { formatDistance, formatDuration } from './common';
import legsToPartials from './legsToPartials';
import WaypointRow from './WaypointRow';

const TotalsTableCell = styled(TableCell)({
  fontWeight: 'bold',
});

const Unit = styled('span')({
  position: 'absolute',
  marginLeft: '.3em',
});

interface FlightPlanTableProps {
  wmm: WorldMagneticModel;
}

export default function FlightPlanTable({ wmm }: FlightPlanTableProps) {
  const { LL } = useI18nContext();
  const {
    cruiseSpeed,
    fuel,
    includeFrequencies,
    startTime: savedStartTime,
    setIncludeFrequencies,
  } = useStore();
  const intIncludeFrequencies = includeFrequencies ? 1 : 0;
  const [legs, setLegs] = useLegs();
  const startTime = savedStartTime ? timeToDate(savedStartTime) : null;

  function onChange(event: SyntheticEvent, poi: POI | null) {
    if (poi) {
      setLegs((legs) => [
        ...legs,
        {
          altitude: '',
          code: poi.identifiers.local,
          key: `${poi.identifiers.local}-${nanoid()}`,
          poi,
          wind: '',
        },
      ]);
    }
  }

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
      setLegs((legs) => {
        const value = legs[index][key];
        return [
          ...legs.slice(0, index + 1),
          ...legs.slice(index + 1).map((leg) => ({ ...leg, [key]: value })),
        ];
      });
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
    ...partials.map((partial) => partial.tripFuel).filter((trip) => trip > 0),
  );
  const totalTripDistance = math.sum(...partials.map((partial) => partial.distance));
  const totalTripDuration = math.sum(
    ...partials.map((partial) => partial.ete).filter((ete) => ete > 0),
  );

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell />
          <TableCell colSpan={11 + intIncludeFrequencies} padding="checkbox">
            <HideOnPrint>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeFrequencies}
                    onChange={(event) => setIncludeFrequencies(event.target.checked)}
                    size="small"
                  />
                }
                label={LL.includeFrequencies()}
              />
            </HideOnPrint>
          </TableCell>
          <TableCell hideInPrint={!hasAltitude} />
          <TableCell align="center" colSpan={2}>
            {LL.fuel()}
          </TableCell>
          <TableCell />
        </TableRow>
        <TableRow>
          <TableCell />
          <TableCell>#</TableCell>
          <TableCell>POI</TableCell>
          {includeFrequencies && (
            <TableCell align="center" title={LL.frequencies()}>
              {LL.frequencies_abbr()}
            </TableCell>
          )}
          <TableCell align="center">Aero</TableCell>
          <TableCell title={`${LL.distance()} [${LL.nauticalMiles_unit()}]`}>
            {LL.distance_abbr()}
          </TableCell>
          <TableCell id="altitude-label" hideInPrint={!hasAltitude}>
            {LL.altitude()}
          </TableCell>
          <TableCell>{LL.course()}</TableCell>
          <TableCell id="wind-label" title={LL.wind_help()}>
            {LL.wind()}
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
      </TableHead>
      <TableBody>
        {partials.map((partial, index) => (
          <WaypointRow
            disableDown={index === legs.length - 1}
            disableUp={index === 0}
            hasAltitude={hasAltitude}
            index={index}
            key={partial.leg.key}
            onAltitudeChange={onAltitudeChange}
            onAltitudeCopyDown={onAltitudeCopyDown}
            onMoveLeg={moveLeg}
            onNotesChange={onNotesChange}
            onRemove={removeLeg}
            onWindChange={onWindChange}
            onWindCopyDown={onWindCopyDown}
            partial={partial}
          />
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell />
          <TotalsTableCell align="right" colSpan={2}>
            {LL.totals()}:
          </TotalsTableCell>
          <TableCell colSpan={1 + intIncludeFrequencies} />
          <TableCell align="right">
            {formatDistance(totalTripDistance)}
            <Unit>{LL.nauticalMiles_unit()}</Unit>
          </TableCell>
          <TableCell hideInPrint={!hasAltitude} />
          <TableCell colSpan={4} />
          <TableCell align="center">
            {formatDuration(totalTripDuration)}
            <Unit>hs</Unit>
          </TableCell>
          <TableCell colSpan={2} />
          <TableCell align="right">
            {totalFuelConsumption.toFixed(2)}
            <Unit>{fuelUnits.get(fuel.unit)}</Unit>
          </TableCell>
          <TableCell />
          <TableCell />
        </TableRow>
        <HideOnPrint component={TableRow}>
          <TableCell />
          <TableCell align="right" colSpan={2}>
            {LL.addNew()}
          </TableCell>
          <TableCell colSpan={4 + intIncludeFrequencies}>
            <POIInput onChange={onChange} />
          </TableCell>
          <TableCell />
        </HideOnPrint>
      </TableFooter>
    </Table>
  );
}
