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
import { POI } from '../../../../components/openAIP';
import { useStore } from '../../../../components/store';
import { useI18nContext } from '../../../../i18n/i18n-react';
import { WorldMagneticModel } from '../../../../utils/WorldMagneticModel';
import HideOnPrint from '../HideOnPrint';
import POIInput from '../POIInput';
import Table, { TableCell, TableHead } from '../Table';
import { formatDistance, formatDuration } from './common';
import usePartials, { initialValues, Partial } from './usePartials';
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

const partialKeys = Object.keys(initialValues) as (keyof typeof initialValues)[];

export default function FlightPlanTable({ wmm }: FlightPlanTableProps) {
  const { LL } = useI18nContext();
  const { fuel, includeFrequencies, legs, setIncludeFrequencies, setLegs } = useStore();
  const intIncludeFrequencies = includeFrequencies ? 1 : 0;

  function onChange(_event: SyntheticEvent, poi: POI | null) {
    if (poi) {
      setLegs((legs) => [
        ...legs,
        {
          _id: poi._id,
          altitude: '',
          key: nanoid(),
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

  function onChangeHandler(key: 'wind') {
    return function onChange(modifiedIndex: number, value: string) {
      setLegs((legs) => [
        ...legs.map((leg, index) => (index === modifiedIndex ? { ...leg, [key]: value } : leg)),
      ]);
    };
  }

  const onWindChange = onChangeHandler('wind');

  function onCopyDownHandler(key: 'wind') {
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

  const onWindCopyDown = onCopyDownHandler('wind');

  function moveLeg(dir: number, index: number) {
    setLegs((legs) => {
      const tmp = [...legs];
      [tmp[index], tmp[index + dir]] = [tmp[index + dir], tmp[index]];
      return tmp;
    });
  }

  function removeLeg(index: number) {
    setLegs((legs) => legs.filter((_leg, position) => position !== index));
  }

  const partials = usePartials(wmm);
  const addedPartials = partials.reduce((previousPartials: Partial[], partial, index) => {
    if (index === 0) {
      return [partial];
    }

    const last = { ...previousPartials[index - 1] };
    partialKeys.forEach((key) => {
      last[key] = (last[key] >= 0 ? last[key] : 0) + partial[key];
    });
    return [...previousPartials, last];
  }, []);
  const totals = addedPartials.length > 0 ? addedPartials[addedPartials.length - 1] : initialValues;

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
            index={index}
            key={legs[index].key}
            leg={legs[index]}
            onMoveLeg={moveLeg}
            onNotesChange={onNotesChange}
            onRemove={removeLeg}
            onWindChange={onWindChange}
            onWindCopyDown={onWindCopyDown}
            partial={partial}
            totals={addedPartials[index]}
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
            {formatDistance(totals.distance)}
            <Unit>{LL.nauticalMiles_unit()}</Unit>
          </TableCell>
          <TableCell hideInPrint={true} />
          <TableCell colSpan={4} />
          <TableCell align="center">
            {totals.ete >= 0 ? formatDuration(totals.ete) : 0}
            <Unit>hs</Unit>
          </TableCell>
          <TableCell colSpan={2} />
          <TableCell align="right">
            {totals.tripFuel.toFixed(2)}
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
