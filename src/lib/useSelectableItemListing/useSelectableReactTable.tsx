import * as React from "react";
import { TableProps, RowInfo } from "react-table";
import { TableOutProps, InProps } from "./types";
import useSelectableItemListing from ".";

function useSelectableReactTable<TItem>(
  props: InProps<TItem>,
  customTableProps: Partial<TableProps>,
): TableOutProps<TItem> {
  const selectableItemProps = useSelectableItemListing<TItem>(props);
  const { getKey, items } = props;
  const { toggleSelection, selectedItems, focussedItem } = selectableItemProps;

  const getTdProps = React.useCallback(
    (state: any, rowInfo: RowInfo) => {
      return {
        onClick: (_: any, handleOriginal: () => void) => {
          if (!!rowInfo && !!rowInfo.original) {
            toggleSelection(getKey(rowInfo.original));
          }

          if (handleOriginal) {
            handleOriginal();
          }
        },
      };
    },
    [toggleSelection, getKey],
  );

  const getTrProps = React.useCallback(
    (_: any, rowInfo: RowInfo) => {
      // We don't want to see a hover on a row without data.
      // If a row is selected we want to see the selected color.
      let rowId =
        !!rowInfo && !!rowInfo.original ? getKey(rowInfo.original) : undefined;
      const isSelected =
        selectedItems.findIndex(v => getKey(v) === rowId) !== -1;
      const hasFocus = !!focussedItem && getKey(focussedItem) === rowId;
      const hasData = rowId !== undefined;
      let classNames = ["hoverable"];
      if (hasData) {
        classNames.push("hoverable");
        if (isSelected) {
          classNames.push("selected");
        }
        if (hasFocus) {
          classNames.push("focussed");
        }
      }
      return {
        className: classNames.join(" "),
      };
    },
    [selectedItems, focussedItem, getKey],
  );

  return {
    ...selectableItemProps,
    tableProps: {
      data: items,
      getTdProps,
      getTrProps,
      ...customTableProps,
    },
  };
}

export default useSelectableReactTable;
