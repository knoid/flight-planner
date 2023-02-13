const { abs, acos, asin, cos, PI, sin, sqrt } = Math;

export function toDegrees(radians: number): number {
  return (180 / PI) * radians;
}

export function toRadians(degrees: number) {
  return (PI / 180) * degrees;
}

/** protect against rounding error on input argument */
function acosf(x: number) {
  if (abs(x) > 1) {
    x /= abs(x);
  }
  return acos(x);
}

export function courseDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const d = acos(
    sin(lat1) * sin(lat2) + cos(lat1) * cos(lat2) * cos(lon1 - lon2)
  );
  let crs12: number;
  if (d === 0 || lat1 === -(PI / 180) * 90) {
    crs12 = 2 * PI;
  } else if (lat1 === (PI / 180) * 90) {
    crs12 = PI;
  } else {
    const argacos = (sin(lat2) - sin(lat1) * cos(d)) / (sin(d) * cos(lat1));
    if (sin(lon2 - lon1) > 0) {
      crs12 = acosf(argacos);
    } else {
      crs12 = 2 * PI - acosf(argacos);
    }
  }
  return { distance: d, course: crs12 };
}

export function heading(
  course: number,
  cruiseSpeed: number,
  windDirection: number,
  windSpeed: number
) {
  const swc = (windSpeed / cruiseSpeed) * sin(windDirection - course);
  return swc > 1 ? -1 : course + asin(swc);
}

export function groundSpeed(
  cruiseSpeed: number,
  heading: number,
  windDirection: number,
  windSpeed: number
) {
  return sqrt(
    (windSpeed ** 2) +
      (cruiseSpeed ** 2) -
      2 * windSpeed * cruiseSpeed * cos(heading - windDirection)
  );
}

export function sum(...args: number[]): number {
  return args.reduce((accum, value) => accum + value, 0);
}