import { Functions } from '@mui/icons-material';
import {
  alpha,
  darken,
  lighten,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
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
import TimeInput from '../TimeInput';
import WindInput from '../WindInput';
import ControlButtons from './ControlButtons';
import styles from './FlightPlanTable.module.css';
import legsToPartials, { Leg } from './legsToPartials';

const PrintFriendlyPaper = styled(Paper)({
  '@media print': {
    display: 'inline-block',
    width: 'auto',
  },
});

const SumIcon = styled(Functions)({
  verticalAlign: 'bottom',
  marginLeft: -24,
});

const FillInCell = styled(TableCell)(({ theme }) => {
  const borderColor =
    theme.palette.mode === 'light'
      ? lighten(alpha(theme.palette.divider, 1), 0.88)
      : darken(alpha(theme.palette.divider, 1), 0.68);
  return {
    borderLeft: `1px solid ${borderColor}`,
    color: borderColor,
  };
});

function formatDegrees(radians: number) {
  return Math.round(math.toDegrees(radians)).toString().padStart(3, '0');
}

function pad2(num: number) {
  return num.toString().padStart(2, '0');
}

function formatTime(date: Date) {
  const hours = pad2(date.getHours());
  const minutes = pad2(date.getMinutes());
  return `${hours}:${minutes}`;
}

function formatDuration(hours: number) {
  const minutes = hours * 60;
  return `${Math.floor(minutes / 60)}:${pad2(Math.round(minutes % 60))}`;
}

interface FlightPlanTableProps {
  wmm: WorldMagneticModel;
}

export default function FlightPlanTable({ wmm }: FlightPlanTableProps) {
  const { cruiseSpeed, legs: savedLegs, setLegs: setSavedLegs } = useStore();
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
      ...legs.map((leg, index) =>
        index === modifiedIndex ? { ...leg, wind: value } : leg
      ),
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

  const partials = legsToPartials(legs, cruiseSpeed, startTime, wmm);

  return (
    <TableContainer component={PrintFriendlyPaper}>
      <Table className={styles.root} size="small">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>#</TableCell>
            <TableCell>POI</TableCell>
            {/* <TableCell>GND</TableCell> */}
            <TableCell>TWR</TableCell>
            {/* <TableCell>VOR</TableCell> */}
            <TableCell>Aero</TableCell>
            {/* <TableCell></TableCell> */}
            {/* <TableCell></TableCell> */}
            {/* <TableCell></TableCell> */}
            <TableCell title="Distance [nm]">Dist.</TableCell>
            {/* <TableCell></TableCell> */}
            <TableCell>Course</TableCell>
            <TableCell
              id="wind-label"
              title="Wind speed and direction [dir/speed]"
            >
              Wind
            </TableCell>
            <TableCell title="Heading">HD</TableCell>
            <TableCell title="Ground Speed [kt]">GS</TableCell>
            <TableCell title="Estimated Time Enroute [h:m]">ETE</TableCell>
            <TableCell title="Estimated Time of Arrival [h:m]">ETA</TableCell>
            <TableCell>Real</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {partials.map((partial, index) => (
            <TableRow key={partial.leg.key}>
              <TableCell align="right" padding="none">
                <ControlButtons
                  disableDown={index === legs.length - 1}
                  disableUp={index === 0}
                  onMoveDown={moveLeg.bind(null, 1, index)}
                  onMoveUp={moveLeg.bind(null, -1, index)}
                  onRemove={removeLeg.bind(null, index)}
                />
              </TableCell>
              <TableCell>{index + 1}.</TableCell>
              <TableCell>{partial.leg.poi.code}</TableCell>
              {/* <TableCell>{partial.leg.poi.GND?.toFixed(2)}</TableCell> */}
              <TableCell>{partial.leg.poi.TWR?.toFixed(2)}</TableCell>
              {/* <TableCell>{partial.leg.poi.VOR?.toFixed(2)}</TableCell> */}
              <TableCell align="center">{partial.leg.poi.aero}</TableCell>
              {index > 0 ? (
                <>
                  {/* <TableCell>{partial.latR}</TableCell> */}
                  {/* <TableCell>{partial.lngR}</TableCell> */}
                  {/* <TableCell>{partial.distanceR}</TableCell> */}
                  <TableCell align="right">
                    {(math.toDegrees(partial.distance) * 60).toFixed(1)}
                  </TableCell>
                  {/* <TableCell>{partial.courseR}</TableCell> */}
                  <TableCell align="center">
                    {formatDegrees(partial.course)}
                  </TableCell>
                  <TableCell padding="none">
                    <WindInput
                      aria-describedby="wind-label"
                      onCopyDown={onWindCopyDown.bind(null, index)}
                      onChange={onWindChange.bind(null, index)}
                      value={partial.leg.wind}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {partial.heading > -1 ? formatDegrees(partial.heading) : ''}
                  </TableCell>
                  <TableCell>
                    {partial.groundSpeed > -1
                      ? Math.round(partial.groundSpeed)
                      : ''}
                  </TableCell>
                  <TableCell>
                    {partial.ete > 0 ? formatDuration(partial.ete) : ''}
                  </TableCell>
                  <FillInCell>
                    {partial.eta ? formatTime(partial.eta) : ''}
                  </FillInCell>
                  <FillInCell />
                </>
              ) : (
                <>
                  <TableCell colSpan={5} />
                  <TableCell>
                    <SumIcon aria-label="sum" />
                    {formatDuration(
                      math.sum(
                        ...partials
                          .map((partial) => partial.ete)
                          .filter((val) => val > 0)
                      )
                    )}
                  </TableCell>
                  <FillInCell>
                    <TimeInput onChange={onETAChange} />
                  </FillInCell>
                  <FillInCell />
                </>
              )}
            </TableRow>
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
          </TableRow>
        </HideOnPrint>
      </Table>
    </TableContainer>
  );
}
