import { useMap } from 'usehooks-ts';

import { POI } from './openAIP';

export type POIMap<V> = Omit<Map<string, V | undefined>, 'set' | 'clear' | 'delete'>;

export default function usePOIMap<V extends POI>(): [
  POIMap<V>,
  (newPOIs: V[]) => void,
  (_id: string, value?: V | undefined) => void,
] {
  const [pois, { set }] = useMap<string, V | undefined>();

  function setAllPOIs(newPOIs: V[]) {
    newPOIs.map((poi) => set(poi._id, poi));
  }

  return [pois, setAllPOIs, set];
}
