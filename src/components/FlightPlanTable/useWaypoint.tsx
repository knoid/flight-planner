import { useEffect, useState } from 'react';
import cachedFetch from '../cachedFetch';
import { Metadata } from './common';

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
        const result: Metadata = {};
        if (isOK(madhelResponse)) {
          const madhelResult: MadhelDetailsResponse = await madhelResponse.value.json();
          result.distanceReference =
            Number(madhelResult.metadata.localization.distance_reference) * km2nm;
          result.directionReference =
            madhelResult.metadata.localization.direction_reference.replace(/O$/u, 'W');
        }

        if (isOK(frequenciesResponse)) {
          const frequenciesResult: FrequenciesResponse = await frequenciesResponse.value.json();
          Object.assign(result, frequenciesResult);
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
