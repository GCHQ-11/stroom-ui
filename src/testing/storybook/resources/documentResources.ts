import { HttpRequest, HttpResponse } from "@pollyjs/adapter-fetch";

import { TestCache } from "../PollyDecorator";
import { Config } from "src/startup/config";
import { ResourceBuilder } from "./types";
import { DocumentType } from "src/types";
import { DOCUMENT_RESOURCES } from "src/api/useDocumentApi/types";

const resourceBuilder: ResourceBuilder = (
  server: any,
  { stroomBaseServiceUrl }: Config,
  testCache: TestCache,
) => {
  Object.entries(DOCUMENT_RESOURCES)
    .map(k => ({
      docRefType: k[0],
      resourcePath: k[1],
    }))
    .forEach(({ docRefType, resourcePath }) => {
      const resource = `${stroomBaseServiceUrl}${resourcePath}`;

      server
        .get(`${resource}/:docRefUuid`)
        .intercept((req: HttpRequest, res: HttpResponse) => {
          const dict = testCache.data!.documents[docRefType].find(
            (d: DocumentType<any>) => d.uuid === req.params.docRefUuid,
          );
          if (dict) {
            res.json(dict);
          } else {
            res.sendStatus(404);
          }
        });
      server
        .post(`${resource}/:docRefUuid`)
        .intercept((req: HttpRequest, res: HttpResponse) =>
          res.sendStatus(200),
        );
    });
};

export default resourceBuilder;
