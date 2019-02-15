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
import { storiesOf } from "@storybook/react";

import PipelineElement from "./PipelineElement";
import Pipeline from "./Pipeline";

import { testPipelines } from "./test";
import StroomDecorator from "../../lib/storybook/StroomDecorator";

import "../../styles/main.css";
import { PipelineElementType } from "src/types";
import { ShowDialog as ShowAddElementDialog } from "./AddElementModal";

const pipelineStories = storiesOf("Pipeline/Element", module).addDecorator(
  StroomDecorator
);

const showAddElementDialog: ShowAddElementDialog = () =>
  console.error("Adding Elements Not Supported in Stories");
const existingNames: Array<string> = [];

testPipelines.simple.merged.elements.add!.forEach((k: PipelineElementType) => {
  pipelineStories.add(k.id, () => (
    <React.Fragment>
      <div className="Pipeline-editor__elements_cell element">
        <PipelineElement
          pipelineId="simple"
          elementId={k.id}
          existingNames={existingNames}
          showAddElementDialog={showAddElementDialog}
        />
      </div>
      <div style={{ display: "none" }}>
        <Pipeline
          pipelineId="simple"
          showAddElementDialog={showAddElementDialog}
        />
      </div>{" "}
    </React.Fragment>
  ));
});
