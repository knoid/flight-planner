import { Navigation as NavigationIcon } from '@mui/icons-material';
import { Button, styled } from '@mui/material';
import { DateOrTimeView } from '@mui/x-date-pickers';
import { PickerSelectionState, PickersModalDialog } from '@mui/x-date-pickers/internals';
import { PickerViewRoot } from '@mui/x-date-pickers/internals/components/PickerViewRoot';
import { useIsLandscape } from '@mui/x-date-pickers/internals/hooks/useIsLandscape';
import { OpenStateProps, useOpenState } from '@mui/x-date-pickers/internals/hooks/useOpenState';
import { UsePickerLayoutProps } from '@mui/x-date-pickers/internals/hooks/usePicker/usePickerLayoutProps';
import { PickersLayout } from '@mui/x-date-pickers/PickersLayout';
import { forwardRef, MouseEvent, Ref, TouchEvent, useEffect, useRef, useState } from 'react';

import * as math from '../../../../components/math';
import { useI18nContext } from '../../../../i18n/i18n-react';
import { Direction } from './Direction';
import { clockCenter, cx, cy, SIZE, slotProps, slots, TValue, views } from './WindPicker.types';

export const noop = () => {};

const WindRoot = styled(PickerViewRoot, {
  name: 'WnWind',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
});

const WindUnderRoot = styled('div', {
  name: 'WnWind',
  slot: 'UnderRoot',
  overridesResolver: (_, styles) => styles.underRoot,
})(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: theme.spacing(2),
}));

const WindSelector = styled('div')({
  borderRadius: '50%',
  height: SIZE,
  position: 'relative',
  width: SIZE,
});

const WindClock = styled('div', {
  name: 'WnClock',
  slot: 'Clock',
  overridesResolver: (_, styles) => styles.clock,
})({
  backgroundColor: 'rgba(0,0,0,.07)',
  borderRadius: '50%',
  height: 220,
  width: 220,
  flexShrink: 0,
  position: 'relative',
  pointerEvents: 'none',
});

const WindSquareMask = styled('div', {
  name: 'WnWind',
  slot: 'SquareMask',
  overridesResolver: (_, styles) => styles.squareMask,
})({
  width: '100%',
  height: '100%',
  position: 'absolute',
  pointerEvents: 'auto',
  outline: 0,
  // Disable scroll capabilities.
  touchAction: 'none',
  userSelect: 'none',
  '@media (pointer: fine)': {
    cursor: 'pointer',
    borderRadius: '50%',
  },
  '&:active': {
    cursor: 'move',
  },
});

const WindPin = styled('div', {
  name: 'WnWind',
  slot: 'Pin',
  overridesResolver: (_, styles) => styles.pin,
})(({ theme }) => ({
  width: 6,
  height: 6,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
}));

const getAngleValue = (offsetX: number, offsetY: number) => {
  const x = offsetX - clockCenter.x;
  const y = offsetY - clockCenter.y;

  const atan = Math.atan2(cx, cy) - Math.atan2(x, y);

  const speed = Math.min(99, Math.sqrt(x ** 2 + y ** 2) / 3);
  const direction = math.toDegrees(atan) % 360;

  return { direction, speed };
};

const formatWind = (value: TValue) =>
  [
    `${Math.round(value.direction)}`.padStart(3, '0'),
    `${Math.floor(value.speed)}`.padStart(2, '0'),
  ].join('/');

const parseWind = (value: string) => {
  const [direction, speed] = (value || '0/0').split('/').map(Number);
  return { direction, speed };
};

interface MobileWindPicker extends OpenStateProps, UsePickerLayoutProps {
  onChange: (value: string, isFinish: PickerSelectionState) => void;
  value: string;
}

export const MobileWindPicker = forwardRef(function MobileWindPicker(
  props: MobileWindPicker,
  ref: Ref<HTMLButtonElement>,
) {
  const { isOpen, setIsOpen } = useOpenState(props);
  const { LL } = useI18nContext();
  const { onChange, value: providedValue } = props;
  const isLandscape = useIsLandscape(views, undefined);
  const [value, setValue] = useState<TValue>(parseWind(providedValue));
  const isMoving = useRef(false);

  useEffect(() => {
    if (isOpen) {
      setValue(parseWind(providedValue));
    }
  }, [isOpen]);

  const onAccept = () => setIsOpen(false);
  const onCancel = () => setIsOpen(false);
  const onClear = () => {
    onChange('', 'finish');
    setIsOpen(false);
  };
  const onClose = () => setIsOpen(false);
  const onDismiss = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);
  const onSetToday = noop;
  const events = {
    onAccept,
    onCancel,
    onClear,
    onClose,
    onDismiss,
    onOpen,
    onSetToday,
  };

  const setTime = (
    event: TouchEvent | MouseEvent,
    [clientX, clientY]: [number, number],
    isFinish: PickerSelectionState,
  ) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;

    const newValue = getAngleValue(offsetX, offsetY);
    setValue(newValue);
    onChange(formatWind(newValue), isFinish);
  };

  const handleTouchMove = (event: TouchEvent) => {
    isMoving.current = true;
    const { clientX, clientY } = event.changedTouches[0];
    setTime(event, [clientX, clientY], 'shallow');
  };

  const handleTouchEnd = (event: TouchEvent) => {
    if (isMoving.current) {
      const { clientX, clientY } = event.changedTouches[0];
      setTime(event, [clientX, clientY], 'finish');
      isMoving.current = false;
    }
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    // event.buttons & PRIMARY_MOUSE_BUTTON
    if (event.buttons > 0) {
      setTime(event, [event.clientX, event.clientY], 'shallow');
    }
  };

  const handleMouseUp = (event: MouseEvent) => {
    isMoving.current = false;

    setTime(event, [event.clientX, event.clientY], 'finish');
  };

  return (
    <>
      <Button ref={ref} onClick={() => setIsOpen(true)} sx={{ lineHeight: 1, padding: 0 }}>
        {providedValue ? providedValue : LL.wind()}
      </Button>
      <PickersModalDialog open={isOpen} {...events}>
        <PickersLayout<TValue, TValue, DateOrTimeView>
          isLandscape={isLandscape}
          isValid={() => true}
          onChange={noop}
          onSelectShortcut={noop}
          onViewChange={noop}
          slots={slots}
          slotProps={slotProps}
          value={value}
          view="day"
          views={views}
          wrapperVariant="mobile"
          {...events}
        >
          <WindRoot>
            <WindUnderRoot>
              <WindClock>
                <WindSquareMask
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                />
                <WindPin />
                {value.speed > 0 && (
                  <NavigationIcon
                    sx={{ left: '50%', position: 'absolute', top: '50%' }}
                    style={{
                      fontSize: `${0.15 * value.speed}em`,
                      transform: [
                        `rotate(${(180 + value.direction) % 360}deg)`,
                        'translate(-50%, -50%)',
                      ].join(' '),
                    }}
                  />
                )}
                <WindSelector role="listbox" tabIndex={0}>
                  <Direction angle={0}>{LL.cardinalDirections.N()}</Direction>
                  <Direction angle={45}>
                    {LL.cardinalDirections.N()}
                    {LL.cardinalDirections.E()}
                  </Direction>
                  <Direction angle={90}>{LL.cardinalDirections.E()}</Direction>
                  <Direction angle={135}>
                    {LL.cardinalDirections.S()}
                    {LL.cardinalDirections.E()}
                  </Direction>
                  <Direction angle={180}>{LL.cardinalDirections.S()}</Direction>
                  <Direction angle={225}>
                    {LL.cardinalDirections.S()}
                    {LL.cardinalDirections.W()}
                  </Direction>
                  <Direction angle={270}>{LL.cardinalDirections.W()}</Direction>
                  <Direction angle={315}>
                    {LL.cardinalDirections.N()}
                    {LL.cardinalDirections.W()}
                  </Direction>
                </WindSelector>
              </WindClock>
            </WindUnderRoot>
          </WindRoot>
        </PickersLayout>
      </PickersModalDialog>
    </>
  );
});
