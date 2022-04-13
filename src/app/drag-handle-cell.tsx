import * as React from 'react';

export const DragHandleCell = (props) => {
  return (
    <td {...props}>
      <span
        className="k-icon k-i-reorder"
        style={{ cursor: 'move' }}
        data-drag-handle={true}
      />
    </td>
  );
};
