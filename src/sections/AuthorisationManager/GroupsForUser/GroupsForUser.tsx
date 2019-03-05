import * as React from "react";
import { useEffect, useCallback } from "react";

import { User } from "../../../types";

import useApi from "../../../api/userGroups";
import useReduxState from "../../../lib/useReduxState";
import Loader from "../../../components/Loader";
import UsersTable, { useTable as useUsersTable } from "../UsersTable";
import Button from "../../../components/Button";
import {
  UserGroupModalPicker,
  useDialog as useUserGroupModalPicker
} from "../UserGroupPicker";
import ThemedConfirm, {
  useDialog as useThemedConfirm
} from "../../../components/ThemedConfirm";

export interface Props {
  user: User;
}

const GroupsForUser = ({ user }: Props) => {
  const { findGroupsForUser, addUserToGroup, removeUserFromGroup } = useApi();
  useEffect(() => {
    findGroupsForUser(user.uuid);
  }, [user]);

  const groupsForUser = useReduxState(
    ({ userGroups: { groupsForUser } }) => groupsForUser
  );
  const groups = groupsForUser[user.uuid];

  const { componentProps: tableProps } = useUsersTable(groups);
  const {
    selectableTableProps: { selectedItems }
  } = tableProps;

  const {
    componentProps: deleteGroupMembershipComponentProps,
    showDialog: showDeleteGroupMembershipDialog
  } = useThemedConfirm({
    onConfirm: useCallback(
      () =>
        selectedItems
          .map(g => g.uuid)
          .forEach(gUuid => removeUserFromGroup(user.uuid, gUuid)),
      [removeUserFromGroup, user, selectedItems]
    ),
    getQuestion: useCallback(
      () => "Are you sure you want to remove the user from these groups?",
      []
    ),
    getDetails: useCallback(() => selectedItems.map(s => s.name).join(", "), [
      selectedItems
    ])
  });

  const {
    componentProps: userGroupPickerProps,
    showDialog: showUserGroupPicker
  } = useUserGroupModalPicker({
    onConfirm: useCallback(
      (groupUuid: string) => addUserToGroup(user.uuid, groupUuid),
      [addUserToGroup]
    )
  });

  if (!groups) {
    return <Loader message={`Loading Groups for User ${user.uuid}`} />;
  }

  return (
    <div>
      <h2>Groups for User {user.name}</h2>
      <Button text="Add to Group" onClick={showUserGroupPicker} />
      <Button
        text="Remove from Group"
        disabled={selectedItems.length === 0}
        onClick={showDeleteGroupMembershipDialog}
      />
      <ThemedConfirm {...deleteGroupMembershipComponentProps} />
      <UsersTable {...tableProps} />
      <UserGroupModalPicker {...userGroupPickerProps} />
    </div>
  );
};

export default GroupsForUser;
