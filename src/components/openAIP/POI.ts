import normalize from './normalize';

export interface POIProps {
  _id: string;
  name: string;
  country: string;
}

export default abstract class POI implements POIProps {
  _id!: string;
  name!: string;
  country!: string;

  getIdentifier() {
    return this.name;
  }

  getLabel() {
    return this.name;
  }

  matches(search: string) {
    return normalize(this.getLabel()).includes(normalize(search));
  }
}
