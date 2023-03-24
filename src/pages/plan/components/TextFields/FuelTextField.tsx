import { IconButton, InputAdornment, styled } from '@mui/material';
import { MouseEvent, useEffect, useState } from 'react';
import * as math from '../../../../components/math';
import { FuelUnit, State, useStore } from '../../../../components/store';
import NumericTextField from './NumericTextField';

const UnitCycleButton = styled(IconButton)({
  '&&': {
    // https://github.com/styled-components/styled-components/issues/1816#issuecomment-398454088
    fontSize: 'inherit',
  },
});

export const fuelUnits = new Map<FuelUnit, string>([
  [FuelUnit.GallonUS, 'gal'],
  [FuelUnit.Liter, 'lts'],
  [FuelUnit.Pound, 'lbs'],
]);

interface FuelTextFieldProps {
  label: string;
  name: keyof State['fuel'];
}

function handleMouseDown(event: MouseEvent<HTMLButtonElement>) {
  event.preventDefault();
}

export default function FuelTextField({ label, name }: FuelTextFieldProps) {
  const { fuel, setFuel } = useStore();
  const storedValue = fuel[name];
  const [rawValue, setRawValue] = useState(storedValue > 0 ? storedValue.toString() : '');
  const value = Number(rawValue);

  useEffect(() => {
    setFuel({ [name]: value });
  }, [name, setFuel, value]);

  function handleClick() {
    setFuel({ unit: math.remainder(fuel.unit + 1, fuelUnits.size) });
  }

  return (
    <NumericTextField
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <UnitCycleButton
              aria-label="cycle through fuel units"
              edge="end"
              onClick={handleClick}
              onMouseDown={handleMouseDown}
              size="small"
            >
              {fuelUnits.get(fuel.unit)}
            </UnitCycleButton>
          </InputAdornment>
        ),
      }}
      inputProps={{ pattern: '[0-9.,]*' }}
      label={label}
      onChange={(event) => setRawValue(event.currentTarget.value)}
      value={rawValue}
    />
  );
}
