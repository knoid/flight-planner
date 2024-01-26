import {
  Announcements,
  closestCenter,
  DndContext as DndKitContext,
  DndContextProps,
  KeyboardSensor,
  PointerSensor,
  ScreenReaderInstructions,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useMemo } from 'react';

import { useI18nContext } from '../../../i18n/i18n-react';

const modifiers = [restrictToVerticalAxis];

export default function DndContext({ children, ...props }: DndContextProps) {
  const { LL } = useI18nContext();

  const accessibility = useMemo(() => {
    const announcements: Announcements = {
      onDragStart: ({ active }) => LL.dnd.onDragStart({ active: active.data.current?.label }),
      onDragOver: ({ active, over }) =>
        over
          ? LL.dnd.onDragOver_over({
              active: active.data.current?.label,
              over: over.data.current?.label,
            })
          : LL.dnd.onDragOver({ active: active.data.current?.label }),
      onDragEnd: ({ active, over }) =>
        over
          ? LL.dnd.onDragEnd_over({
              active: active.data.current?.label,
              over: over.data.current?.label,
            })
          : LL.dnd.onDragEnd({
              active: active.data.current?.label,
            }),
      onDragCancel: ({ active }) => LL.dnd.onDragCancel({ active: active.data.current?.label }),
    };
    const screenReaderInstructions: ScreenReaderInstructions = { draggable: LL.dnd.draggable() };
    return { announcements, screenReaderInstructions };
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  return (
    <DndKitContext
      accessibility={accessibility}
      collisionDetection={closestCenter}
      modifiers={modifiers}
      sensors={sensors}
      {...props}
    >
      {children}
    </DndKitContext>
  );
}
