import { Box, Slider, SliderProps } from '@mui/material';

import { linear, log } from './logScale';

type AirspaceSliderProps = Pick<SliderProps, 'onChange' | 'value'>;

function toFL(num: number) {
  return `${Math.round(num / 100)}`.padStart(3, '0');
}

function altitudeFormat(value: number) {
  return value >= 4000 ? `FL${toFL(value)}` : `${value}ft`;
}

export default function AirspaceSlider({ value: values, onChange }: AirspaceSliderProps) {
  const value = values && (Array.isArray(values) ? values.map(linear) : linear(values));
  return (
    <Box bottom="12em" position="absolute" right="1em" height={300} zIndex={1000}>
      <Slider
        onChange={
          onChange &&
          ((event, values, activeThumb) => {
            onChange(event, Array.isArray(values) ? values.map(log) : log(values), activeThumb);
          })
        }
        orientation="vertical"
        value={value}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => altitudeFormat(Math.round(log(value)))}
      />
    </Box>
  );
}
