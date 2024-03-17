import { styled } from '@mui/material';
import { ForwardedRef, forwardRef, ReactNode } from 'react';

import { DIRECTION_SIZE, SIZE } from './WindPicker.types';

const DirectionRoot = styled('div', {
  name: 'WnDirection',
  slot: 'Root',
})<{ ownerState: DirectionProps }>(({ theme, ownerState }) => ({
  alignItems: 'center',
  borderRadius: '50%',
  color: ownerState.angle % 10 === 0 ? theme.palette.text.primary : theme.palette.text.secondary,
  display: 'flex',
  height: DIRECTION_SIZE,
  justifyContent: 'center',
  left: `calc((100% - ${DIRECTION_SIZE}px) / 2)`,
  position: 'absolute',
  width: DIRECTION_SIZE,
}));

interface DirectionProps {
  angle: number;
  children: ReactNode;
}

export const Direction = forwardRef(function Direction(
  props: DirectionProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const { angle, children } = props;

  const radians = (angle / 180) * Math.PI;
  const length = (SIZE - DIRECTION_SIZE - 2) / 2;
  const x = Math.round(Math.sin(radians) * length);
  const y = Math.round(-Math.cos(radians) * length);

  return (
    <DirectionRoot
      ownerState={props}
      ref={ref}
      role="option"
      style={{ transform: `translate(${x}px, ${y + (SIZE - DIRECTION_SIZE) / 2}px)` }}
    >
      {children}
    </DirectionRoot>
  );
});
