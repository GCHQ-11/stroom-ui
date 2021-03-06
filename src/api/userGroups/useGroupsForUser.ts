import * as React from "react";

import useApi from "./useApi";
import { User } from "src/types";
import useListReducer from "src/lib/useListReducer/useListReducer";

interface UseGroupsForUser {
  groups: User[];
  addToGroup: (groupUuid: string) => void;
  removeFromGroup: (groupUuid: string) => void;
}

const useGroupsForUser = (user: User): UseGroupsForUser => {
  const {
    items: groups,
    itemsReceived,
    itemAdded,
    itemRemoved,
  } = useListReducer<User>(g => g.uuid);

  const {
    findGroupsForUser,
    addUserToGroup,
    removeUserFromGroup,
    fetchUser,
  } = useApi();

  React.useEffect(() => {
    findGroupsForUser(user.uuid).then(itemsReceived);
  }, [user]);

  const addToGroup = React.useCallback(
    (groupUuid: string) => {
      addUserToGroup(user.uuid, groupUuid)
        .then(() => fetchUser(groupUuid))
        .then(itemAdded);
    },
    [user, fetchUser, addUserToGroup],
  );
  const removeFromGroup = React.useCallback(
    (groupUuid: string) => {
      removeUserFromGroup(user.uuid, groupUuid).then(() =>
        itemRemoved(groupUuid),
      );
    },
    [user, removeUserFromGroup],
  );

  return {
    groups,
    addToGroup,
    removeFromGroup,
  };
};

export default useGroupsForUser;
