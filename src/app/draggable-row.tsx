import * as React from 'react';
import {
  ReorderContext,
  IsSelectedContext,
  DragHintContext,
  SelectionContext,
  GridContext,
} from './main';
import {
  NormalizedDragEvent,
  useDraggable,
  useDroppable,
  classNames,
} from '@progress/kendo-react-common';
import { GridRowProps } from '@progress/kendo-react-grid';

export const DraggableRow = (
  props: {
    elementProps: any;
  } & GridRowProps
) => {
  const scrollableContainer = React.useRef<HTMLElement | null>(null);

  const [dropped, setDropped] = React.useState(false);
  const [dragged, setDragged] = React.useState(false);
  const [direction, setDirection] = React.useState<'before' | 'after' | null>(
    null
  );

  const dragHint = React.useContext(DragHintContext);
  const grid = React.useContext(GridContext);
  const { dragStart, dragEnd, reorder } = React.useContext(ReorderContext);
  const [selection] = React.useContext(SelectionContext);

  const isSelected = selection.some(
    (item) => item.ProductID === props.dataItem.ProductID
  );

  const element = React.useRef<HTMLTableRowElement>(null);

  const handlePress = () => {
    /** noop */
  };

  const handleDragStart = () => {
    if (!isSelected) {
      return;
    }
    setDragged(true);
    dragStart(props.dataItem);
  };

  const handleDrag = (event: NormalizedDragEvent) => {
    if (
      !dragHint ||
      !dragHint.current ||
      !grid ||
      !grid.current ||
      !grid.current.element
    ) {
      return;
    }

    const gridRect = grid.current.element.getBoundingClientRect();
    const dragHintRect = dragHint.current.getBoundingClientRect();

    dragHint.current.style.top = `${
      event.clientY - gridRect.top - dragHintRect.height / 2
    }px`;
    dragHint.current.style.left = `${
      event.clientX - gridRect.left - dragHintRect.width / 2
    }px`;
  };

  const handleDragEnd = () => {
    setDragged(false);
    setDropped(false);
    dragEnd(props.dataItem);
  };

  const handleRelease = () => {
    if (!dragHint || !dragHint.current) {
      return;
    }
    dragHint.current.style.top = null;
  };

  const handleDragEnter = () => {
    setDropped(true);
    setDirection(null);
  };

  const handleDragOver = (event: NormalizedDragEvent) => {
    if (!element || !element.current) {
      return;
    }
    const rect = element.current.getBoundingClientRect();

    setDirection(
      rect.top + rect.height / 2 <= event.clientY ? 'after' : 'before'
    );
  };

  const handleDragLeave = () => {
    setDropped(false);
    setDirection(null);
  };

  const handleDrop = () => {
    reorder(props.dataItem, direction);
    setDropped(false);
    setDirection(null);
  };

  React.useEffect(() => {
    const virtualContent = document.querySelector(
      '.k-grid-content.k-virtual-content'
    ) as HTMLElement;
    scrollableContainer.current = virtualContent;
  }, []);

  useDraggable(
    element,
    {
      onPress: handlePress,
      onDragStart: handleDragStart,
      onDrag: handleDrag,
      onDragEnd: handleDragEnd,
      onRelease: handleRelease,
    },
    {
      autoScroll: dragged,
      hint: dragHint,
      scrollContainer: scrollableContainer,
    }
  );
  useDroppable(element, {
    onDragEnter: handleDragEnter,
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
  });

  return (
    <IsSelectedContext.Provider value={isSelected}>
      {dropped && direction === 'before' && (
        <tr
          style={{
            outlineStyle: 'solid',
            outlineWidth: 1,
            outlineColor: 'red',
          }}
        />
      )}
      <tr
        {...props.elementProps}
        ref={element}
        className={classNames(
          {
            'k-state-selected': isSelected,
          },
          props.elementProps.className
        )}
        style={{
          userSelect: 'none',
          pointerEvents: dragged ? 'none' : 'auto',
        }}
      />
      {dropped && direction === 'after' && (
        <tr
          style={{
            outlineStyle: 'solid',
            outlineWidth: 1,
            outlineColor: 'red',
          }}
        />
      )}
    </IsSelectedContext.Provider>
  );
};
