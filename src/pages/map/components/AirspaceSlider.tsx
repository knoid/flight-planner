import { Box, Slider, SliderProps } from '@mui/material';

type AirspaceSliderProps = Pick<SliderProps, 'onChange' | 'value'>;

function toFL(num: number) {
  return `${num / 100}`.padStart(3, '0');
}

export default function AirspaceSlider(props: AirspaceSliderProps) {
  return (
    <Box bottom="12em" position="absolute" right="1em" height={300} zIndex={1000}>
      <Slider
        max={50 * 1000}
        min={0}
        orientation="vertical"
        step={500}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => (value >= 4000 ? `FL${toFL(value)}` : `${value}ft`)}
        {...props}
      />
    </Box>
  );
}
