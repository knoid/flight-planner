import { useEffect, useState } from 'react';
import cachedFetch from '../../../components/cachedFetch';
import { Metadata } from './FlightPlanTable/common';

const km2nm = 1 / 1.852;

interface MadhelDetailsResponse {
  metadata: {
    localization: {
      distance_reference: string;
      direction_reference: string;
    };
  };
}

interface FrequenciesResponse {
  ATIS?: number;
  COM?: number;
}

function isOK(
  response: PromiseSettledResult<Response>
): response is PromiseFulfilledResult<Response> {
  return (
    response.status === 'fulfilled' &&
    response.value.ok &&
    (response.value.headers.get('Content-Type')?.includes('json') || false)
  );
}

export default function useWaypoint(code: string) {
  const [metadata, setMetadata] = useState<Metadata | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      const [madhelResponse, frequenciesResponse] = await Promise.allSettled([
        cachedFetch(`https://datos.anac.gob.ar/madhel/api/v2/airports/${code}/?format=json`),
        fetch(`data/AR/${code}.json`),
      ]);

      if (active) {
        const result: Metadata = { frequencies: {} };
        if (isOK(madhelResponse)) {
          const madhelResult: MadhelDetailsResponse = await madhelResponse.value.json();
          const { localization } = madhelResult.metadata;
          result.reference = {
            distance: Number(localization.distance_reference) * km2nm,
            direction: localization.direction_reference.replaceAll('O', 'W'),
          }
        }

        if (isOK(frequenciesResponse)) {
          const frequenciesResult: FrequenciesResponse = await frequenciesResponse.value.json();
          Object.assign(result.frequencies, frequenciesResult);
        }
        setMetadata(result);
      }
    })();

    return () => {
      active = false;
    };
  }, [code]);

  return metadata;
}
