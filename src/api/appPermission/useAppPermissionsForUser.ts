import { useEffect, useCallback } from "react";

import useApi from "./useApi";
import useListReducer from "../../lib/useListReducer/useListReducer";

/**
 * An API for managing the application permissions for a single user.
 */
interface UserAppPermissionApi {
  userAppPermissions: Array<string>;
  addPermission: (permissionName: string) => void;
  removePermission: (permissionName: string) => void;
}

/**
 * Encapsulates the management of application permissions for a single user.
 * Presenting a simpler API that is hooked into the REST API and Redux.
 *
 * @param userUuid The UUID of the user or group
 */
const useAppPermissionsForUser = (userUuid: string): UserAppPermissionApi => {
  const {
    items: userAppPermissions,
    itemsReceived,
    itemAdded,
    itemRemoved
  } = useListReducer<string>(g => g);

  const {
    getPermissionsForUser,
    addAppPermission,
    removeAppPermission
  } = useApi();

  useEffect(() => {
    getPermissionsForUser(userUuid).then(itemsReceived);
  }, [userUuid, getPermissionsForUser]);

  const addPermission = useCallback(
    (permissionName: string) =>
      addAppPermission(userUuid, permissionName).then(() =>
        itemAdded(permissionName)
      ),
    [userUuid, addAppPermission]
  );

  const removePermission = useCallback(
    (permissionName: string) =>
      removeAppPermission(userUuid, permissionName).then(() =>
        itemRemoved(permissionName)
      ),
    [userUuid, removeAppPermission]
  );

  return {
    userAppPermissions,
    addPermission,
    removePermission
  };
};

export default useAppPermissionsForUser;
