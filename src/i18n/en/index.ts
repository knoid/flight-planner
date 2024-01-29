import type { BaseTranslation } from '../i18n-types';

const en = {
  addNew: 'Add new',
  airport: 'Airport',
  altitude: 'Altitude',
  callSign: 'Call Sign',
  cardinalDirections: { N: 'N', E: 'E', S: 'S', W: 'W' },
  closeNotes: 'close notes',
  coordinates: 'Coordinates',
  course: 'Course',
  cruiseSpeed: 'Cruise speed',
  date: 'Date',
  distance_abbr: 'Dist.',
  distance: 'Distance',
  dnd: {
    draggable: `
      To pick up a draggable item, press the space bar.
      While dragging, use the arrow keys to move the item.
      Press space again to drop the item in its new position, or press escape to cancel.
    `,
    onDragCancel: 'Dragging was cancelled. Draggable item {active:string} was dropped.',
    onDragEnd: 'Draggable item {active:string} was dropped.',
    onDragEnd_over: 'Draggable item {active:string} was dropped over droppable area {over:string}.',
    onDragOver: 'Draggable item {active:string} is no longer over a droppable area.',
    onDragOver_over: 'Draggable item {active:string} was moved over droppable area {over:string}.',
    onDragStart: 'Picked up draggable item {active:string}.',
  },
  dragLeg: 'drag leg',
  flightPlan: 'Flight Plan',
  frequencies_abbr: 'Freq.',
  frequencies: 'Frequencies',
  fuel: 'Fuel',
  fuelCapacity: 'Fuel Capacity',
  fuelFlow: 'Fuel Flow',
  fuelReserve: 'Fuel Reserve',
  includeFrequencies: 'Include frequencies',
  leaveFeedback: 'leave a comment',
  map: 'Map',
  nauticalMiles_unit: 'nm',
  notes_placeholder: 'Notes…',
  openNotes: 'open notes',
  plane: 'Plane',
  runways: 'Runways',
  searchPOI: 'Search POIs',
  title: 'Title',
  totals: 'Totals',
  wind_help: 'Wind direction and speed [dir/speed]',
  wind: 'Wind',
} satisfies BaseTranslation;

export default en;
