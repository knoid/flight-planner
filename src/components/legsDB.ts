const storageKey = 'legs';
const version = 1;

interface State {
  legs: string[];
  version: number;
}

const initialState: State = {
  legs: [],
  version,
};

const savedLegs = (function () {
  try {
    return JSON.parse(localStorage.getItem(storageKey)!) as State;
  } catch (error) {
    return null;
  }
})() || initialState;

export function getLegs() {
  return savedLegs.legs;
}

export function setLegs(legs: string[]) {
  localStorage.setItem(storageKey, JSON.stringify({ legs, version }));
}
