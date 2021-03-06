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

import { LineContainer, LineTo } from ".";

import Curve from "./lineCreators/Curve";

let testBlockStyle: React.CSSProperties = {
  position: "absolute",
  width: "50px",
  backgroundColor: "red",
  borderStyle: "thin",
  color: "white",
};

const DefaultLineTest: React.FunctionComponent = () => {
  return (
    <div>
      <LineContainer>
        <div
          id="myFirst"
          style={{
            ...testBlockStyle,
            top: "50px",
            left: "50px",
          }}
        >
          From
        </div>
        <div
          id="mySecond"
          style={{
            ...testBlockStyle,
            top: "250px",
            left: "150px",
          }}
        >
          To
        </div>
        <LineTo fromId="myFirst" toId="mySecond" />
      </LineContainer>
    </div>
  );
};

const CurveTest: React.FunctionComponent = () => {
  return (
    <div>
      <LineContainer LineElementCreator={Curve}>
        <div
          id="myFirst"
          style={{
            ...testBlockStyle,
            top: "50px",
            left: "150px",
          }}
        >
          From
        </div>
        <div
          id="mySecond"
          style={{
            ...testBlockStyle,
            top: "250px",
            left: "50px",
          }}
        >
          Mid1
        </div>
        <div
          id="myThird"
          style={{
            ...testBlockStyle,
            top: "150px",
            left: "350px",
          }}
        >
          End
        </div>
        <LineTo fromId="myFirst" toId="mySecond" />
        <LineTo fromId="mySecond" toId="myThird" />
      </LineContainer>
    </div>
  );
};

storiesOf("General Purpose/Line To SVG", module)
  .add("Default Line", () => <DefaultLineTest />)
  .add("Custom Curve", () => <CurveTest />);
