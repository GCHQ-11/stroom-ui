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
import * as React from "react";
import { useState } from "react";

import { storiesOf } from "@storybook/react";

import StroomDecorator from "../../testing/storybook/StroomDecorator";
import DocRefBreadcrumb from "./DocRefBreadcrumb";

import { DocRefType } from "../../types";
import { testPipelines } from "../../testing/data/pipelines";

import "../../styles/main.css";
import JsonDebug from "../../testing/JsonDebug";

interface Props {
  docRefUuid: string;
}

const BreadcrumbOpen = ({ docRefUuid }: Props) => {
  const [openDocRef, setOpenDocRef] = useState<DocRefType | undefined>(
    undefined
  );

  return (
    <div>
      <div>Doc Ref Breadcrumb</div>
      <DocRefBreadcrumb docRefUuid={docRefUuid} openDocRef={setOpenDocRef} />
      <JsonDebug currentValues={openDocRef} />
    </div>
  );
};

const testPipelineUuid = Object.keys(testPipelines)[0];

storiesOf("Doc Ref/Breadcrumb", module)
  .addDecorator(StroomDecorator)
  .add("first pipeline", () => (
    <BreadcrumbOpen docRefUuid={testPipelineUuid} />
  ));
