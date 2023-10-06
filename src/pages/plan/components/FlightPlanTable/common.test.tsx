import { render, screen } from '@testing-library/react';
import { nanoid } from 'nanoid';

import {
  Airport,
  AirportType,
  Composite,
  Condition,
  FrequencyType,
  FrequencyUnit,
} from '../../../../components/openAIP';
import { Leg } from '../../../../components/store/constants';
import { CommonCells } from './common';
import { Partial } from './usePartials';

function noop() {
  // no op
}

describe('CommonCells', () => {
  it('links to google with appropriate latitude and longitude', () => {
    const airport = Airport.fromJSON({
      _id: nanoid(),
      country: 'AR',
      geometry: { type: 'Point', coordinates: [-30, -20] },
      frequencies: [
        { _id: nanoid(), type: FrequencyType.Multicom, unit: FrequencyUnit.MHz, value: '120.500' },
      ],
      altIdentifier: 'TEST',
      name: 'Test Airfield',
      type: AirportType.AirfieldCivil,
      runways: [
        {
          _id: nanoid(),
          designator: '16',
          surface: {
            composition: [Composite.Grass],
            condition: Condition.Good,
            mainComposite: Composite.Grass,
          },
        },
        {
          _id: nanoid(),
          designator: '34',
          surface: {
            composition: [Composite.Grass],
            condition: Condition.Good,
            mainComposite: Composite.Grass,
          },
        },
      ],
    });
    const leg = {
      _id: airport._id,
      altitude: '',
      key: 'TEST-ABCD',
      wind: '',
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
              poi={airport}
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
