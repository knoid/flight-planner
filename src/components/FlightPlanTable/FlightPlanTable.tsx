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
import * as legsDB from '../legsDB';
import * as math from '../math';
import POIInput from '../POIInput';
import POIsContext, { POI } from '../POIsContext';
import TimeInput from '../TimeInput';
import WindInput from '../WindInput';
import ControlButtons from './ControlButtons';
import styles from './FlightPlanTable.module.css';

const PrintFriendlyPaper = styled(Paper)({
  '@media print': {
    display: 'inline-block',
    width: 'auto',
  },
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

interface Leg {
  key: string;
  readonly poi: POI;
  wind: string;
}

interface Partial {
  course: number;
  distance: number;
  /** Estimated time of arrival in hours. */
  eta: Date | null;
  /** Estimated time enroute in hours. */
  ete: number;
  groundSpeed: number;
  heading: number;
  lat: number;
  lon: number;
  leg: Leg;
}

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

const h2m = 60 * 60 * 1000;

interface FlightPlanTableProps {
  cruiseSpeed: number;
  wmm: WorldMagneticModel;
}

const initialLegs = legsDB.getLegs();

export default function FlightPlanTable({
  cruiseSpeed,
  wmm,
}: FlightPlanTableProps) {
  const [legs, setLegs] = useState<Leg[]>([]);
  const [initialTime, setInitialTime] = useState<Date | null>(null);
  function onETAChange(value: string) {
    const date = new Date();
    const [hours, minutes] = value.split(':');
    date.setHours(+hours);
    date.setMinutes(+minutes);
    date.setSeconds(0);
    setInitialTime(date);
  }

  const { options, loading } = useContext(POIsContext);
  useEffect(() => {
    if (!loading && options.length > 0) {
      setLegs(
        initialLegs
          .map((code) => options.find((poi) => poi.code === code))
          .filter((poi): poi is POI => !!poi)
          .map((poi) => ({ key: `${poi.code}-${nanoid()}`, poi, wind: '' }))
      );
    }
  }, [loading, options]);

  function onChange(event: SyntheticEvent, poi: POI | null) {
    if (poi) {
      setLegs((legs) => [...legs, { key: nanoid(), poi, wind: '' }]);
    }
  }

  useEffect(() => {
    legsDB.setLegs(legs.map((leg) => leg.poi.code));
  }, [legs]);

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

  return (
    <TableContainer component={PrintFriendlyPaper}>
      <Table className={styles.root}>
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
          {legs
            .reduce((partials, leg) => {
              const lat = math.toRadians(leg.poi.lat);
              const lon = math.toRadians(leg.poi.lon);
              if (partials.length === 0) {
                return [
                  {
                    course: -1,
                    distance: 0,
                    eta: initialTime,
                    ete: -1,
                    groundSpeed: -1,
                    heading: -1,
                    lat,
                    lon,
                    leg,
                  },
                ];
              }

              const previousPartial = partials[partials.length - 1];
              const lastPOI = previousPartial.leg.poi;
              const lastETA = previousPartial.eta;
              const [windDirection, windSpeed = 0] = leg.wind
                .split('/')
                .map(Number);
              const { course, distance } = math.courseDistance(
                math.toRadians(lastPOI.lat),
                math.toRadians(lastPOI.lon),
                lat,
                lon
              );
              const heading = math.heading(
                course,
                cruiseSpeed,
                windDirection,
                windSpeed
              );
              const groundSpeed =
                heading > -1
                  ? math.groundSpeed(
                      cruiseSpeed,
                      heading,
                      windDirection,
                      windSpeed
                    )
                  : -1;
              const now = new Date();
              const declination = wmm.declination(
                1500 / 3,
                leg.poi.lat,
                leg.poi.lon,
                now.getFullYear() + now.getMonth() / 12
              );
              const ete = groundSpeed
                ? (math.toDegrees(distance) / groundSpeed) * 60
                : -1;
              return [
                ...partials,
                {
                  course: course - declination,
                  distance,
                  eta:
                    groundSpeed && lastETA
                      ? new Date(lastETA.getTime() + ete * h2m)
                      : null,
                  ete: groundSpeed
                    ? (math.toDegrees(distance) / groundSpeed) * 60
                    : -1,
                  groundSpeed,
                  heading: heading > 0 ? heading - declination : heading,
                  lat,
                  lon,
                  leg,
                },
              ];
            }, [] as Partial[])
            .map((partial, index) => (
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
                      {partial.heading > -1
                        ? formatDegrees(partial.heading)
                        : ''}
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
                    <TableCell colSpan={6} />
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
