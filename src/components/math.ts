import { Coords } from "../types";

const { abs, acos, asin, cos, PI, sin, sqrt } = Math;

/** protect against rounding error on input argument */
function acosf(x: number) {
  if (abs(x) > 1) {
    x /= abs(x);
  }
  return acos(x);
}

export function course(distance: number, from: Coords, to: Coords) {
  const [lat1, lon1] = from;
  const [lat2, lon2] = to;
  if (distance === 0 || lat1 === -(PI / 180) * 90) {
    return 2 * PI;
  } else if (lat1 === (PI / 180) * 90) {
    return PI;
  } else {
    const argacos = (sin(lat2) - sin(lat1) * cos(distance)) / (sin(distance) * cos(lat1));
    if (sin(lon2 - lon1) > 0) {
      return acosf(argacos);
    } else {
      return 2 * PI - acosf(argacos);
    }
  }
}

export function distance(from: Coords, to: Coords) {
  const [lat1, lon1] = from;
  const [lat2, lon2] = to;
  return acos(sin(lat1) * sin(lat2) + cos(lat1) * cos(lat2) * cos(lon1 - lon2));
}

export function heading(
  course: number,
  cruiseSpeed: number,
  windSource: number,
  windSpeed: number
) {
  const swc = (windSpeed / cruiseSpeed) * sin(windSource - course);
  return swc > 1 ? -1 : course + asin(swc);
}

export function groundSpeed(
  cruiseSpeed: number,
  heading: number,
  windSource: number,
  windSpeed: number
) {
  const cruiseSpeed2 = cruiseSpeed ** 2;
  const windSpeed2 = windSpeed ** 2;
  return sqrt(windSpeed2 + cruiseSpeed2 - 2 * windSpeed * cruiseSpeed * cos(heading - windSource));
}

export function sum(...args: number[]): number {
  return args.reduce((accum, value) => accum + value, 0);
}

export function toDegrees(radians: number): number {
  return (180 / PI) * (radians % (PI * 2));
}

export function toRadians(degrees: number) {
  return (PI / 180) * (degrees % 360);
}
