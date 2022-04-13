import * as React from 'react';
import * as ReactDOM from 'react-dom';

export const DragHint = React.forwardRef<HTMLElement, any>(
  ({ portal, ...props }, ref) => {
    const Component = (
      <div
        ref={ref}
        {...props}
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          userSelect: 'none',
          padding: 16,
          overflow: 'visible',
          cursor: 'move',
          ...(props.style || {}),
        }}
      >
        {props.children}
      </div>
    );

    return portal && portal.current && portal.current.element
      ? ReactDOM.createPortal(Component, portal.current.element)
      : Component;
  }
);
