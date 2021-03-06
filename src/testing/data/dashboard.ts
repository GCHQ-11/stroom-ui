import * as uuidv4 from "uuid/v4";
import * as loremIpsum from "lorem-ipsum";
import { DashboardDoc } from "src/types";

export const generate = (): DashboardDoc => ({
  type: "Dashboard",
  uuid: uuidv4(),
  name: loremIpsum({ count: 2, units: "words" }),
});
