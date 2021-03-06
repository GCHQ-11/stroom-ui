/*
 * Copyright 2018 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as uuidv4 from "uuid/v4";

import {
  DocRefTree,
  copyDocRef,
  Dictionary,
  StreamTaskType,
  IndexDoc,
  XsltDoc,
  XMLSchemaDoc,
  VisualisationDoc,
  StatisticStoreDoc,
  StroomStatsStoreDoc,
  ScriptDoc,
  ElasticIndexDoc,
  DashboardDoc,
  AnnotationsIndexDoc,
  FeedDoc,
} from "src/types";
import { testPipelines, elements, elementProperties } from "./pipelines";
import testDocRefsTypes from "./docRefTypes";
import { generate as generateAnnotationsIndex } from "./annotationsIndex";
import { generate as generateDashboard } from "./dashboard";
import { generate as generateDictionary } from "./dictionary";
import { generate as generateElasticIndex } from "./elasticIndex";
import { generate as generateFeed } from "./feed";
import { generate as generateIndex } from "./indexDocs";
import { generate as generateScript } from "./script";
import { generate as generateStatisticStore } from "./statisticStore";
import { generate as generateStroomStatsStore } from "./stroomStatsStore";
import { generate as generateVisualisation } from "./visualisation";
import { generate as generateXmlSchema } from "./xmlSchema";
import { generate as generateXslt } from "./xslt";
import { generateGenericTracker } from "./trackers";
import { dataList, dataSource } from "./data";
import { generateTestUser, generateTestGroup } from "./usersAndGroups";
import {
  generateTestIndexVolumeGroup,
  generateTestIndexVolume,
} from "./indexVolumes";
import {
  IndexVolumeGroupMembership,
  User,
  IndexVolumeGroup,
  IndexVolume,
} from "src/types";
import allAppPermissions from "./appPermissions";
import { UserGroupMembership, TestData, UserDocPermission } from "../testTypes";
import { documentPermissionNames } from "./docPermissions";
import { iterateNodes } from "src/lib/treeUtils";

let docPermissionByType = testDocRefsTypes.reduce(
  (acc, curr) => ({ ...acc, [curr]: documentPermissionNames }),
  {},
);

let groups: User[] = Array(5)
  .fill(1)
  .map(generateTestGroup);
let users: User[] = Array(30)
  .fill(1)
  .map(generateTestUser);
let userGroupMemberships: UserGroupMembership[] = [];
let userIndex = 0;
groups.forEach(group => {
  for (let x = 0; x < 10; x++) {
    var user: User = users[userIndex++];
    userIndex %= users.length; // wrap
    userGroupMemberships.push({
      userUuid: user.uuid,
      groupUuid: group.uuid,
    });
  }
});
const allUsers = users.concat(groups);
let permissionIndex = 0;
const userAppPermissions = {};
allUsers.forEach(u => {
  let permissions = [];
  for (let x = 0; x < 2; x++) {
    permissions.push(allAppPermissions[permissionIndex++]);
    permissionIndex %= allAppPermissions.length; // wrap the index
  }
  userAppPermissions[u.uuid] = permissions;
});

let indexVolumeGroups: IndexVolumeGroup[] = Array(5)
  .fill(1)
  .map(generateTestIndexVolumeGroup);

let indexVolumes: IndexVolume[] = Array(30)
  .fill(1)
  .map(generateTestIndexVolume);

let annotationIndexes: AnnotationsIndexDoc[] = Array(3)
  .fill(1)
  .map(generateAnnotationsIndex);
let dashboards: DashboardDoc[] = Array(3)
  .fill(1)
  .map(generateDashboard);
let elasticIndexes: ElasticIndexDoc[] = Array(3)
  .fill(1)
  .map(generateElasticIndex);
let feeds: FeedDoc[] = Array(3)
  .fill(1)
  .map(generateFeed);
let scripts: ScriptDoc[] = Array(3)
  .fill(1)
  .map(generateScript);
let statisticStores: StatisticStoreDoc[] = Array(3)
  .fill(1)
  .map(generateStatisticStore);
let stroomStatsStores: StroomStatsStoreDoc[] = Array(3)
  .fill(1)
  .map(generateStroomStatsStore);
let visualisations: VisualisationDoc[] = Array(3)
  .fill(1)
  .map(generateVisualisation);
let xmlSchemas: XMLSchemaDoc[] = Array(3)
  .fill(1)
  .map(generateXmlSchema);

let indexVolumeGroupMemberships: IndexVolumeGroupMembership[] = [];
let indexVolumeIndex = 0; // Best variable name ever
indexVolumeGroups.forEach(group => {
  for (let x = 0; x < 10; x++) {
    let indexVolume: IndexVolume = indexVolumes[indexVolumeIndex];
    indexVolumeGroupMemberships.push({
      groupName: group.name,
      volumeId: indexVolume.id,
    });

    indexVolumeIndex = (indexVolumeIndex + 1) % indexVolumes.length;
  }
});

let dictionaries: Dictionary[] = Array(5)
  .fill(null)
  .map(generateDictionary);

let xslt: XsltDoc[] = Array(5)
  .fill(null)
  .map(generateXslt);

let trackers: StreamTaskType[] = Array(10)
  .fill(null)
  .map(generateGenericTracker);

let indexes: IndexDoc[] = Array(5)
  .fill(null)
  .map(generateIndex);

const docTree = {
  uuid: "0",
  type: "System",
  name: "System",
  children: [
    {
      uuid: uuidv4(),
      name: "Raw Materials",
      type: "Folder",
      children: [
        {
          uuid: uuidv4(),
          name: "Dictionaries",
          type: "Folder",
          children: dictionaries.map(copyDocRef),
        },
        {
          uuid: uuidv4(),
          name: "XML_Schemas",
          type: "Folder",
          children: xmlSchemas.map(copyDocRef),
        },
        {
          uuid: uuidv4(),
          name: "Feeds",
          type: "Folder",
          children: feeds.map(copyDocRef),
        },
        {
          uuid: uuidv4(),
          name: "Scripts",
          type: "Folder",
          children: scripts.map(copyDocRef),
        },
        {
          uuid: uuidv4(),
          name: "XSLT",
          type: "Folder",
          children: xslt.map(copyDocRef),
        },
      ],
    },
    {
      uuid: uuidv4(),
      name: "Compound Stuff",
      type: "Folder",
      children: [
        {
          uuid: uuidv4(),
          name: "Pipelines",
          type: "Folder",
          children: Object.values(testPipelines).map(copyDocRef),
        },
        {
          uuid: uuidv4(),
          name: "Dashboards",
          type: "Folder",
          children: dashboards.map(copyDocRef),
        },
        {
          uuid: uuidv4(),
          name: "Indexes",
          type: "Folder",
          children: indexes.map(copyDocRef),
        },
        {
          uuid: uuidv4(),
          name: "Annotation Indexes",
          type: "Folder",
          children: annotationIndexes.map(copyDocRef),
        },
        {
          uuid: uuidv4(),
          name: "Elastic Indexes",
          type: "Folder",
          children: elasticIndexes.map(copyDocRef),
        },
        {
          uuid: uuidv4(),
          name: "Visualisations",
          type: "Folder",
          children: visualisations.map(copyDocRef),
        },
        {
          uuid: uuidv4(),
          name: "StatisticStore",
          type: "Folder",
          children: statisticStores.map(copyDocRef),
        },
        {
          uuid: uuidv4(),
          name: "StroomStatsStore",
          type: "Folder",
          children: stroomStatsStores.map(copyDocRef),
        },
      ],
    },
    {
      uuid: uuidv4(),
      name: "Empty Directory with a Long Name",
      type: "Folder",
      children: [],
    },
  ],
} as DocRefTree;

const userDocPermission: UserDocPermission[] = [];

// give first two users permissions to all documents
iterateNodes(docTree, (_, { uuid: docRefUuid }) => {
  allUsers.slice(0, 2).forEach(({ uuid: userUuid }) => {
    documentPermissionNames
      .filter(p => p !== "OWNER")
      .forEach(permissionName => {
        userDocPermission.push({
          userUuid,
          docRefUuid,
          permissionName,
        });
      });
  });
});

export const fullTestData: TestData = {
  documentTree: docTree,
  docRefTypes: testDocRefsTypes,
  elements,
  elementProperties,
  documents: {
    XSLT: Object.values(xslt),
    Dictionary: Object.values(dictionaries),
    Feed: feeds,
    Index: indexes,
    Pipeline: Object.values(testPipelines),
    AnnotationsIndex: annotationIndexes,
    Dashboard: dashboards,
    ElasticIndex: elasticIndexes,
    Script: scripts,
    StatisticStore: statisticStores,
    StroomStatsStore: stroomStatsStores,
    Visualisation: visualisations,
    XMLSchema: xmlSchemas,
  },
  dataList,
  dataSource,
  trackers,
  usersAndGroups: {
    users: allUsers,
    userGroupMemberships,
  },
  indexVolumesAndGroups: {
    volumes: indexVolumes,
    groups: indexVolumeGroups,
    groupMemberships: indexVolumeGroupMemberships,
  },
  allAppPermissions,
  userAppPermissions,
  docPermissionByType,
  userDocPermission,
};

export default fullTestData;
