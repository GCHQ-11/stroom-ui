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

import Button from "../Button";
import ThemedModal from "./ThemedModal";
import StroomDecorator from "../../lib/storybook/StroomDecorator";
import { addThemedStories } from "../../lib/themedStoryGenerator";

import "../../styles/main.css";

const TestModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <React.Fragment>
      <ThemedModal
        isOpen={isOpen}
        header={<h3>This is the header</h3>}
        content={<div>Maybe put something helpful in here</div>}
        actions={
          <React.Fragment>
            <Button text="Nothing" onClick={() => setIsOpen(false)} />
            <Button text="Something" onClick={() => setIsOpen(false)} />
          </React.Fragment>
        }
        onRequestClose={() => setIsOpen(false)}
      />
      <Button onClick={() => setIsOpen(!isOpen)} text="Open" />
    </React.Fragment>
  );
};

const stories = storiesOf("General Purpose/Themed Modal", module).addDecorator(
  StroomDecorator
);

addThemedStories(stories, <TestModal />);
