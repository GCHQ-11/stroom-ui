import * as React from "react";
import { useEffect, useCallback } from "react";

import useReduxState from "../../lib/useReduxState";
import useApi from "../../api/userGroups/useApi";
import { IsGroup } from "../../api/userGroups/useApi";
import { GlobalStoreState } from "../../startup/reducers";
import IconHeader from "../../components/IconHeader";
import UsersTable, { useTable } from "./UsersTable";
import Button from "../../components/Button";
import NewUserDialog, {
  useDialog as useNewUserDialog
} from "./NewUserDialog/NewUserDialog";
import ThemedConfirm, {
  useDialog as useThemedConfim
} from "../../components/ThemedConfirm";
import useRouter from "../../lib/useRouter";
import useForm from "../../lib/useForm";
import IsGroupPicker from "./IsGroupPicker/IsGroupPicker";

const LISTING_ID = "user_permissions";

export interface Props {}

interface Values {
  name: string;
  isGroup?: IsGroup;
  uuid: string;
}

const defaultValues: Values = {
  name: "",
  uuid: "",
  isGroup: ""
};

const Authorisation = () => {
  const { history } = useRouter();
  const { createUser, findUsers, deleteUser } = useApi();

  // Get data from and subscribe to the store
  const users = useReduxState(
    ({ authorisationManager: { users } }: GlobalStoreState) => users[LISTING_ID]
  );

  useEffect(() => {
    findUsers(LISTING_ID);
  }, [findUsers]);

  const { componentProps: tableProps } = useTable(users);
  const {
    selectableTableProps: { selectedItems }
  } = tableProps;

  const {
    componentProps: newDialogComponentProps,
    showDialog: showNewDialog
  } = useNewUserDialog(createUser);
  const {
    componentProps: deleteDialogProps,
    showDialog: showDeleteDialog
  } = useThemedConfim({
    getQuestion: useCallback(() => `Are you sure you want to delete user`, []),
    getDetails: useCallback(() => selectedItems.map(v => v.name).join(", "), [
      selectedItems.map(v => v.uuid)
    ]),
    onConfirm: useCallback(() => {
      selectedItems.forEach(v => deleteUser(v.uuid));
    }, [selectedItems.map(v => v.uuid)])
  });

  const {
    generateControlledInputProps,
    inputProps: {
      text: { name: nameProps, uuid: uuidProps }
    }
  } = useForm({
    initialValues: defaultValues,
    inputs: { text: ["name", "uuid"] },
    onValidate: ({ name, isGroup, uuid }: Values) =>
      findUsers(LISTING_ID, name, isGroup, uuid)
  });

  const isGroupProps = generateControlledInputProps<IsGroup>("isGroup");

  return (
    <div className="Authorisation">
      <IconHeader icon="users" text="User Permissions" />

      <form>
        <label htmlFor="name">Name</label>
        <input {...nameProps} />
        <label htmlFor="uuid">UUID</label>
        <input {...uuidProps} />
        <label htmlFor="isGroup">Is Group</label>
        <IsGroupPicker {...isGroupProps} />
      </form>

      <div className="UserTable__container">
        <Button text="Create" onClick={showNewDialog} />
        <Button
          text="View/Edit"
          disabled={selectedItems.length !== 1}
          onClick={() =>
            history.push(`/s/authorisation/${selectedItems[0].uuid}`)
          }
        />
        <Button
          text="Delete"
          disabled={selectedItems.length === 0}
          onClick={showDeleteDialog}
        />

        <UsersTable {...tableProps} />
      </div>

      <ThemedConfirm {...deleteDialogProps} />
      <NewUserDialog {...newDialogComponentProps} />
    </div>
  );
};

export default Authorisation;
