import { render, screen } from '@testing-library/react';

import { Airport, CommonCells } from './common';
import { Leg, Partial } from './legsToPartials';

function noop() {
  // no op
}

describe('CommonCells', () => {
  it('links to google with appropriate latitude and longitude', () => {
    const airport = {
      type: 'airport',
      condition: 'public',
      controlled: false,
      coordinates: [-20, -30],
      frequencies: [{ type: 'COM', frequency: 120.5 }],
      identifiers: { local: 'TEST' },
      name: 'Test Airfield',
      radio_helpers: [],
      runways: [{ type: 'dirt', orientations: ['16', '34'] }],
    } satisfies Airport;
    const leg = {
      altitude: '',
      code: 'TEST',
      key: 'TEST-ABCD',
      wind: '',
      poi: airport,
    } satisfies Leg;
    const partial = {
      course: Math.PI,
      distance: 1,
      eta: new Date(),
      ete: 3,
      groundSpeed: 4,
      heading: 5,
      leg,
      remainingFuel: 6,
      tripFuel: 7,
    } satisfies Partial;
    render(
      <table>
        <tbody>
          <tr>
            <CommonCells
              airport={airport}
              disableDown
              disableUp
              index={1}
              onMoveLeg={noop}
              onRemove={noop}
              partial={partial}
            />
          </tr>
        </tbody>
      </table>,
    );
    const link = screen.getByRole<HTMLAnchorElement>('link');
    expect(link.href).toMatch(new RegExp(encodeURIComponent('-20,-30')));
  });
});
