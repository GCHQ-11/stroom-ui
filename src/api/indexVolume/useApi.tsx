import * as React from "react";

import useHttpClient from "src/lib/useHttpClient";
import { IndexVolume, IndexVolumeGroup } from "src/types";
import { useConfig } from "src/startup/config";

interface Api {
  getIndexVolumes: () => Promise<IndexVolume[]>;
  getIndexVolumeById: (id: string) => Promise<IndexVolume>;
  deleteIndexVolume: (id: string) => Promise<void>;
  getGroupsForIndexVolume: (id: string) => Promise<IndexVolumeGroup[]>;
  getIndexVolumesInGroup: (groupName: string) => Promise<IndexVolume[]>;
  createIndexVolume: (nodeName: string, path: string) => Promise<IndexVolume>;
  addVolumeToGroup: (indexVolumeId: string, groupName: string) => Promise<void>;
  removeVolumeFromGroup: (
    indexVolumeId: string,
    groupName: string,
  ) => Promise<void>;
}

export const useApi = (): Api => {
  const { stroomBaseServiceUrl } = useConfig();
  const {
    httpGetJson,
    httpDeleteEmptyResponse,
    httpPostJsonResponse,
    httpPostEmptyResponse,
  } = useHttpClient();

  return {
    addVolumeToGroup: React.useCallback(
      (indexVolumeId: string, groupName: string) =>
        httpPostEmptyResponse(
          `${stroomBaseServiceUrl}/stroom-index/volume/v1/inGroup/${indexVolumeId}/${groupName}`,
        ),
      [stroomBaseServiceUrl, httpPostEmptyResponse],
    ),
    createIndexVolume: React.useCallback(
      (nodeName: string, path: string) =>
        httpPostJsonResponse(
          `${stroomBaseServiceUrl}/stroom-index/volume/v1/${name}`,
          { body: JSON.stringify({ nodeName, path }) },
        ),
      [stroomBaseServiceUrl, httpPostJsonResponse],
    ),
    deleteIndexVolume: React.useCallback(
      (id: string) =>
        httpDeleteEmptyResponse(
          `${stroomBaseServiceUrl}/stroom-index/volume/v1/${id}`,
        ),
      [stroomBaseServiceUrl, httpDeleteEmptyResponse],
    ),
    getIndexVolumeById: React.useCallback(
      (id: string) =>
        httpGetJson(`${stroomBaseServiceUrl}/stroom-index/volume/v1/${id}`),
      [stroomBaseServiceUrl, httpGetJson],
    ),
    getIndexVolumes: React.useCallback(
      () => httpGetJson(`${stroomBaseServiceUrl}/stroom-index/volume/v1`),
      [stroomBaseServiceUrl, httpGetJson],
    ),
    getIndexVolumesInGroup: React.useCallback(
      (groupName: string) =>
        httpGetJson(
          `${stroomBaseServiceUrl}/stroom-index/volume/v1/inGroup/${groupName}`,
        ),
      [stroomBaseServiceUrl, httpGetJson],
    ),
    removeVolumeFromGroup: React.useCallback(
      (indexVolumeId: string, groupName: string) =>
        httpDeleteEmptyResponse(
          `${stroomBaseServiceUrl}/stroom-index/volume/v1/inGroup/${indexVolumeId}/${groupName}`,
        ),
      [stroomBaseServiceUrl, httpDeleteEmptyResponse],
    ),
    getGroupsForIndexVolume: React.useCallback(
      (id: string) =>
        httpGetJson(
          `${stroomBaseServiceUrl}/stroom-index/volume/v1/groupsFor/${id}`,
        ),
      [stroomBaseServiceUrl, httpGetJson],
    ),
  };
};

export default useApi;
