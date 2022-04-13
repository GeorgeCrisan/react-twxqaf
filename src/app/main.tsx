// @ts-nocheck
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { DragAndDrop } from '@progress/kendo-react-common';

import { DraggableRow } from './draggable-row';
import { SelectionCell } from './selection-cell';
import { DragHint } from './drag-hint';

import products from './products.json';
import { Product } from './interfaces';

export const ReorderContext = React.createContext<{
  reorder: (dataItem: Product, direction: 'before' | 'after' | null) => void,
  dragStart: (dataItem: Product) => void;
  dragEnd: (dataItem?: Product) => void;
}>({reorder: () => {}, dragStart: ()=> {}, dragEnd: () => {}});
export const SelectionContext = React.createContext<[Product[], any]>([[], () => {}]);
export const IsSelectedContext = React.createContext<boolean>(false);
export const DragHintContext = React.createContext<React.RefObject<HTMLElement> | null>(null);
export const GridContext = React.createContext<React.RefObject<Grid> | null>(null);

const App = () => {
  const grid = React.useRef(null);
  const hint = React.useRef(null);
  const [gridData, setGridData] = React.useState<Product[]>(products);
  const [selection, setSelection] = React.useState<Product[]>([]);
  const [activeItem, setActiveItem] = React.useState<Product | null>(null);

  const reorder = (dataItem: any, direction: 'before' | 'after') => {
      if (activeItem === dataItem) {
          return;
      }
      let reorderedData = gridData.slice();
      reorderedData = reorderedData.filter((item) => !selection.some((selectedItem) => selectedItem.ProductID === item.ProductID));
      let nextIndex = reorderedData.findIndex(p => (p === dataItem));

      reorderedData.splice(Math.max(nextIndex + (direction === 'before' ? 0 : 1), 0), 0, ...selection);

      setGridData(reorderedData);
  };

  const dragStart = (dataItem: any) => {
      setActiveItem(dataItem);
  };

  const dragEnd = () => {
      setActiveItem(null);
  };

  return (
    <GridContext.Provider value={grid}>
      <DragHintContext.Provider value={hint}>
        <ReorderContext.Provider value={{reorder, dragStart, dragEnd}}>
          <SelectionContext.Provider value={[selection, setSelection]}>
            <DragAndDrop>
              <Grid
                ref={grid}
                style={{ height: '400px' }}
                data={gridData}
                dataItemKey={'ProductID'}
                rowRender={(row, rowProps) => <DraggableRow elementProps={row.props} {...rowProps} />}
          >
                <Column title="" width="80px" cell={SelectionCell} />
                <Column field="ProductID" title="ID" width="60px" />
                <Column field="ProductName" title="Name" width="200px" />
                <Column field="Category.CategoryName" title="CategoryName" />
                <Column field="UnitPrice" title="Price" width="80px" />
                <Column field="UnitsInStock" title="In stock" width="80px" />
              </Grid>
              <DragHint ref={hint} portal={grid} className="k-card" style={{display: activeItem ? undefined: 'none'}}>
                {activeItem && activeItem.ProductName}
                {(selection.length > 1) && (<div style={{
                    position: 'absolute',
                    pointerEvents: 'none',
                    bottom: 0,
                    right: 0,
                    background: 'red',
                    padding: 8,
                    width: 32,
                    color: 'white',
                    borderRadius: '50%',
                    transform: 'translate(50%, 50%)'
                  }}>
                  +{selection.length - 1}
                </div>)}
              </DragHint>
            </DragAndDrop>
          </SelectionContext.Provider>
        </ReorderContext.Provider>
      </DragHintContext.Provider>
    </GridContext.Provider>
  );
};

ReactDOM.render(
  <App />,
    document.querySelector('my-app')
);
