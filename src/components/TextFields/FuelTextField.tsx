import { IconButton, InputAdornment, TextFieldProps } from '@mui/material';
import { styled } from '@mui/system';
import { MouseEvent } from 'react';
import * as math from '../math';
import { FuelUnit, useStore } from '../store';
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

export default function FuelTextField({ InputProps, ...props }: TextFieldProps) {
  const { fuel, setFuel } = useStore();

  function handleClick() {
    setFuel({ unit: math.remainder(fuel.unit + 1, fuelUnits.size) });
  }

  function handleMouseDown(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
  }

  return (
    <NumericTextField
      {...props}
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
        ...InputProps,
      }}
    />
  );
}
