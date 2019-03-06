import * as React from "react";
import { storiesOf } from "@storybook/react";
import StroomDecorator from "../../testing/storybook/StroomDecorator";
import { addThemedStories } from "../../lib/themedStoryGenerator";

import Tooltip from "./Tooltip";

const stories = storiesOf("General Purpose/Tooltip", module).addDecorator(
  StroomDecorator
);

addThemedStories(
  stories,
  <Tooltip
    trigger={
      <button onClick={() => console.log("Clicked the tooltip button")}>
        Click Me
      </button>
    }
    content="Click this button, check the console"
  />
);
