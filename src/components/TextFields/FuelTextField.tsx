import { IconButton, InputAdornment, TextFieldProps } from '@mui/material';
import { styled } from '@mui/system';
import { MouseEvent } from 'react';
import { FuelUnit, useStore } from '../store';
import NumericTextField from './NumericTextField';

const UnitCycleButton = styled(IconButton)({
  '&&': {
    // https://github.com/styled-components/styled-components/issues/1816#issuecomment-398454088
    fontSize: 'inherit',
  },
});

const fuelUnits: Record<FuelUnit, string> = {
  [FuelUnit.GallonUS]: 'gal',
  [FuelUnit.Liter]: 'lts',
  [FuelUnit.Pound]: 'lbs',
};
const fuelUnitsLength = Object.values(fuelUnits).length;

export default function FuelTextField({ InputProps, ...props }: TextFieldProps) {
  const { fuel, setFuel } = useStore();

  function handleClick() {
    setFuel({ unit: (fuel.unit + 1) % fuelUnitsLength });
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
              {fuelUnits[fuel.unit]}
            </UnitCycleButton>
          </InputAdornment>
        ),
        ...InputProps,
      }}
    />
  );
}
