import * as React from "react";

import { DocumentApi, ResourcesByDocType, DOCUMENT_RESOURCES } from "./types";
import { DocumentType } from "src/types";
import { useConfig } from "src/startup/config";
import useHttpClient from "src/lib/useHttpClient";

/**
 * This returns an API that can fetch/save a particular document type.
 * The specific types supported and their respective resource URL's can be found under ./types.
 * This class is based on a certain common appearance for document resources.
 * Any documents which do not expose an interface like this will require a bespoke API + useHook combination.
 *
 * @param docRefType The doc ref type to retrieve/save
 */
const useDocumentApi = <
  T extends keyof ResourcesByDocType,
  D extends DocumentType<T>
>(
  docRefType: T,
): DocumentApi<D> => {
  const { stroomBaseServiceUrl } = useConfig();
  const { httpGetJson, httpPostEmptyResponse } = useHttpClient();
  const resourcePath = DOCUMENT_RESOURCES[docRefType];

  const fetchDocument = React.useCallback(
    (docRefUuid: string) =>
      httpGetJson(`${stroomBaseServiceUrl}${resourcePath}${docRefUuid}`),
    [resourcePath, stroomBaseServiceUrl, httpGetJson],
  );
  const saveDocument = React.useCallback(
    (docRefContents: D) =>
      httpPostEmptyResponse(
        `${stroomBaseServiceUrl}${resourcePath}${docRefContents.uuid}`,
        {
          body: docRefContents,
        },
      ),
    [resourcePath, stroomBaseServiceUrl, httpPostEmptyResponse],
  );

  if (!resourcePath) {
    throw new Error(
      `API for Doc Ref requested, no generic implementation ${docRefType}`,
    );
  }

  return {
    fetchDocument,
    saveDocument,
  };
};

export default useDocumentApi;
