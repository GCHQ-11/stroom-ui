import * as React from "react";

import { storiesOf } from "@storybook/react";


import ElementImage from "./ElementImage";

import "../../styles/main.css";

storiesOf("Pipeline/Element Image", module)
  
  .add("default (large)", () => <ElementImage icon="ElasticSearch.svg" />)
  .add("small", () => <ElementImage size="sm" icon="kafka.svg" />)
  .add("large", () => <ElementImage size="lg" icon="stream.svg" />);
