import type { Translation } from '../i18n-types';

const es = {
  addNew: 'Agregar otro',
  airport: 'Aeropuerto',
  altitude: 'Altitud',
  callSign: 'Matrícula',
  cardinalDirections: { N: 'N', E: 'E', S: 'S', W: 'O' },
  closeNotes: 'cerrar notas',
  coordinates: 'Coordenadas',
  course: 'Curso',
  cruiseSpeed: 'Velocidad crusero',
  date: 'Fecha',
  distance_abbr: 'Dist.',
  distance: 'Distancia',
  dnd: {
    draggable: `
      Para tomar un elemento arrastable, presione la barra espaciadora.
      Mientras arrastra, use las flechas para mover el elemento.
      Presione espacio nuevamente para soltar el elemento en su nueva posición, o presione escape para cancelar.
    `,
    onDragCancel: 'El movimiento fue cancelado. El elemento {active} fue soltado.',
    onDragEnd: 'El elemento {active} fue soltado.',
    onDragEnd_over: 'El elemento {active} fue soltado sobre el area {over}.',
    onDragOver: 'El elemento {active} no está sobre un area válida para soltarlo.',
    onDragOver_over: 'El elemento {active} ha sido movido al area {over}.',
    onDragStart: 'Tomó el elemento {active}.',
  },
  dragLeg: 'arrastrar tramo',
  flightPlan: 'Plan de vuelo',
  frequencies_abbr: 'Frec.',
  frequencies: 'Frecuencias',
  fuel: 'Combustible',
  fuelCapacity: 'Capacidad de combustible',
  fuelFlow: 'Consumo de combustible',
  fuelReserve: 'Reserva de combustible',
  includeFrequencies: 'Incluir frecuencias',
  leaveFeedback: 'dejar un comentario',
  map: 'Mapa',
  nauticalMiles_unit: 'mn',
  notes_placeholder: 'Notas…',
  openNotes: 'abrir notas',
  plane: 'Avión',
  runways: 'Pistas',
  searchPOI: 'Buscar punto de interés',
  title: 'Título',
  totals: 'Totales',
  wind_help: 'Dirección y velocidad del viento [dir/velocidad]',
  wind: 'Viento',
} satisfies Translation;

export default es;
