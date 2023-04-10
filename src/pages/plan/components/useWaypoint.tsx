import { useEffect, useState } from 'react';

import cachedFetch from '../../../components/cachedFetch';
import type { Airport } from './FlightPlanTable/common';
import type { Leg } from './FlightPlanTable/legsToPartials';

function isOK(response: Response) {
  return response.ok && (response.headers.get('Content-Type')?.includes('json') || false);
}

export default function useWaypoint({ code, poi }: Leg) {
  const [data, setData] = useState<Airport | null>(null);

  useEffect(() => {
    let active = true;

    void (async () => {
      if (poi?.type === 'airport' || poi?.type === 'helipad') {
        const moreData = await cachedFetch(`local/AR/${code}.json`);

        if (isOK(moreData)) {
          const data = await moreData.json();
          if (active) {
            setData(data);
          }
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [code, poi?.type]);

  return data;
}
