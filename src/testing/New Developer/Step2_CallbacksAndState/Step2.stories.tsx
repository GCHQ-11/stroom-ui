import * as React from "react";

import { storiesOf } from "@storybook/react";
import { addThemedStories } from "../../storybook/themedStoryGenerator";

import Step2 from "./Step2";

const stories = storiesOf("New Developer/Step 2", module);

addThemedStories(stories, <Step2 />);
