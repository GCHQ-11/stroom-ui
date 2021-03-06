import * as React from "react";

import useApi from "./useApi";
import { IndexVolume } from "src/types";
import useListReducer from "src/lib/useListReducer/useListReducer";

interface UseIndexVolume {
  indexVolume: IndexVolume | undefined;
  groupNames: string[];
  addToGroup: (groupName: string) => void;
  removeFromGroup: (groupName: string) => void;
}

const useIndexVolume = (volumeId: string): UseIndexVolume => {
  const [indexVolume, setIndexVolume] = React.useState<IndexVolume | undefined>(
    undefined,
  );
  const {
    items: groupNames,
    itemAdded,
    itemRemoved,
    itemsReceived,
  } = useListReducer<string>(g => g);

  const {
    getIndexVolumeById,
    getGroupsForIndexVolume,
    addVolumeToGroup,
    removeVolumeFromGroup,
  } = useApi();

  React.useEffect(() => {
    getIndexVolumeById(volumeId).then(setIndexVolume);
    getGroupsForIndexVolume(volumeId).then(groups =>
      itemsReceived(groups.map(g => g.name)),
    );
  }, [volumeId, getIndexVolumeById, setIndexVolume, getGroupsForIndexVolume]);

  const addToGroup = React.useCallback(
    (groupName: string) => {
      addVolumeToGroup(volumeId, groupName).then(() => itemAdded(groupName));
    },
    [volumeId, addVolumeToGroup],
  );
  const removeFromGroup = React.useCallback(
    (groupName: string) => {
      removeVolumeFromGroup(volumeId, groupName).then(() =>
        itemRemoved(groupName),
      );
    },
    [volumeId, removeVolumeFromGroup],
  );

  return { indexVolume, groupNames, addToGroup, removeFromGroup };
};

export default useIndexVolume;
