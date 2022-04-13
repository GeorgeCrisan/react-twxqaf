import * as React from 'react';

export class DragHandleCell extends React.Component {

  render() {
    return (
      <td {...this.props}>
        <span
          className="k-icon k-i-reorder"
          style={{ cursor: 'move' }}
          data-drag-handle={true}
        />
      </td>
    );
  }
}

export default DragHandleCell;
