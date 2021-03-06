import * as React from "react";
import {
  useDocTypePermissions,
  useDocumentPermissionsForUser,
} from "src/api/docPermission";
import {} from "src/api/docPermission";
import CheckboxSeries from "src/components/CheckboxSeries";
import Button from "src/components/Button";
import useRouter from "src/lib/useRouter";
import { useUser } from "src/api/userGroups";
import { useDocumentTree } from "src/api/explorer";

interface Props {
  docRefUuid: string;
  userUuid: string;
}

export const DocumentPermissionForUserEditor: React.FunctionComponent<
  Props
> = ({ docRefUuid, userUuid }) => {
  const { history } = useRouter();
  const { findDocRefWithLineage } = useDocumentTree();

  const { node: docRef } = findDocRefWithLineage(docRefUuid);

  const user = useUser(userUuid);
  const permissionsForType = useDocTypePermissions(docRef.type);
  const {
    permissionNames,
    addPermission,
    removePermission,
  } = useDocumentPermissionsForUser(docRefUuid, userUuid);

  return (
    <div>
      <h2>{`Document Permissions for Doc ${docRef.type}-${
        docRef.name
      }, user ${user && user.name}`}</h2>
      <Button text="Back" onClick={history.goBack} />

      <CheckboxSeries
        allValues={permissionsForType}
        includedValues={permissionNames}
        addValue={addPermission}
        removeValue={removePermission}
      />
    </div>
  );
};

export default DocumentPermissionForUserEditor;
