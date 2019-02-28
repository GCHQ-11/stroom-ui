import * as React from "react";
import { useEffect } from "react";

import useReduxState from "../../lib/useReduxState/useReduxState";
import IconHeader from "../IconHeader";
import Button from "../Button";
import UsersInGroup from "./UsersInGroup";
import GroupsForUser from "./GroupsForUser";
import { GlobalStoreState } from "../../startup/reducers";
import useApi from "../../sections/UserPermissions/useUserPermissionsApi";
import Loader from "../Loader";
import useRouter from "../../lib/useRouter";

export interface Props {
  userUuid: string;
  listingId: string;
}

const UserPermissionEditor = ({ listingId, userUuid }: Props) => {
  const { history } = useRouter();
  const api = useApi();
  useEffect(() => {
    api.findUsers(listingId, undefined, undefined, userUuid);
  }, []);

  const user = useReduxState(
    ({ userPermissions: { users } }: GlobalStoreState) =>
      users[listingId] && users[listingId].find(u => u.uuid === userUuid),
    [listingId, userUuid]
  );

  return (
    <div>
      <IconHeader text={`User Permissions for ${userUuid}`} icon="user" />
      <Button text="Back" onClick={() => history.push("/s/userPermissions")} />
      {user ? (
        user.isGroup ? (
          <UsersInGroup group={user} />
        ) : (
          <GroupsForUser user={user} />
        )
      ) : (
        <Loader message="Loading user..." />
      )}
    </div>
  );
};

export default UserPermissionEditor;
