import * as React from "react";
import { useEffect, useCallback } from "react";

import useReduxState from "../../lib/useReduxState/useReduxState";
import useApi from "../../api/indexVolumeGroup/useApi";
import IndexVolumeGroupsTable, { useTable } from "./IndexVolumeGroupsTable";
import Button from "../../components/Button";
import NewIndexVolumeGroupDialog, {
  useDialog as useNewDialog
} from "./NewIndexVolumeGroupDialog/NewIndexVolumeGroupDialog";
import ThemedConfirm, {
  useDialog as useConfirmDialog
} from "../../components/ThemedConfirm";
import IconHeader from "../../components/IconHeader";
import useRouter from "../../lib/useRouter";

export interface Props {}

const IndexVolumeGroups = () => {
  const { history } = useRouter();

  const groups = useReduxState(({ indexVolumeGroups: { groups } }) => groups);
  const {
    createIndexVolumeGroup,
    deleteIndexVolumeGroup,
    getIndexVolumeGroups
  } = useApi();
  const { componentProps: tableProps } = useTable(groups);
  const {
    selectableTableProps: { selectedItems }
  } = tableProps;

  useEffect(() => {
    getIndexVolumeGroups();
  }, [getIndexVolumeGroups]);

  const {
    showDialog: showNewDialog,
    componentProps: newDialogComponentProps
  } = useNewDialog(createIndexVolumeGroup);

  const {
    showDialog: showDeleteDialog,
    componentProps: deleteDialogComponentProps
  } = useConfirmDialog({
    getQuestion: useCallback(
      () => `Are you sure you want to delete selected groups?`,
      []
    ),
    getDetails: useCallback(() => selectedItems.map(v => v.name).join(", "), [
      selectedItems.map(v => v.name)
    ]),
    onConfirm: useCallback(() => {
      selectedItems.forEach(g => deleteIndexVolumeGroup(g.name));
    }, [deleteIndexVolumeGroup, selectedItems.map(v => v.name)])
  });

  return (
    <div>
      <IconHeader text="Index Volume Groups" icon="database" />

      <Button text="Create" onClick={showNewDialog} />
      <Button
        text="View/Edit"
        disabled={selectedItems.length !== 1}
        onClick={() =>
          history.push(`/s/indexing/groups/${selectedItems[0].name}`)
        }
      />
      <Button
        text="Delete"
        disabled={selectedItems.length === 0}
        onClick={() => showDeleteDialog()}
      />

      <NewIndexVolumeGroupDialog {...newDialogComponentProps} />

      <ThemedConfirm {...deleteDialogComponentProps} />

      <IndexVolumeGroupsTable {...tableProps} />
    </div>
  );
};

export default IndexVolumeGroups;
