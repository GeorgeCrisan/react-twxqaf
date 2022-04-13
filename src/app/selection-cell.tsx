import * as React from 'react';
import { Checkbox } from '@progress/kendo-react-inputs';
import { SelectionContext, IsSelectedContext } from './main';
import { GridCellProps } from '@progress/kendo-react-grid';

export const SelectionCell = (props: GridCellProps) => {
  const [selection, setSelection] = React.useContext(SelectionContext);
  const isSelected = React.useContext(IsSelectedContext);

  const handleChange = () => {
    if (isSelected) {
      setSelection([
        ...selection.filter(
          (item) => item.ProductID !== props.dataItem.ProductID
        ),
      ]);
    } else {
      setSelection([...selection, props.dataItem]);
    }
  };

  return (
    <td
      className={props.className}
      colSpan={props.colSpan}
      role={'gridcell'}
      aria-colindex={props.ariaColumnIndex}
      aria-selected={props.isSelected}
    >
      <Checkbox checked={isSelected} onChange={handleChange} />
    </td>
  );
};
