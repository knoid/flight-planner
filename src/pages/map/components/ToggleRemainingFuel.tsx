import { alpha, styled, ToggleButton, ToggleButtonProps } from '@mui/material';

const Border = styled(ToggleButton)(({ theme, selected }) => ({
  background: 'rgba(255, 255, 255, 0.25)',
  border: '2px solid white',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[selected ? 7 : 3],
  height: '3em',
  overflow: 'hidden',
  position: 'absolute',
  right: '1em',
  top: '1em',
  width: '3em',
  zIndex: 1000,
}));

const MoveALittle = styled('div')({
  position: 'relative',
  left: '0.45em',
  top: '0.65em',
});

interface CircleProps {
  color: string;
  size: string;
}

const Circle = styled('div', {
  shouldForwardProp: (propName) => propName !== 'color' && propName !== 'size',
})<CircleProps>(({ color, size }) => ({
  backgroundColor: alpha(color, 0.2),
  border: `2px solid ${color}`,
  borderRadius: '50%',
  height: size,
  left: '50%',
  position: 'absolute',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: size,
}));

type ToggleRemainingFuelProps = Pick<ToggleButtonProps, 'onChange' | 'selected'>;

export default function ToggleRemainingFuel({ onChange, selected }: ToggleRemainingFuelProps) {
  return (
    <Border aria-label="toggle reminder fuel" value={1} selected={selected} onChange={onChange}>
      <MoveALittle>
        <Circle color="#FF0" size="3em">
          <Circle color="#00F" size="2em" />
        </Circle>
      </MoveALittle>
    </Border>
  );
}
