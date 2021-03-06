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
import * as uuidv4 from "uuid/v4";

import LineContext from "./LineContext";

interface Props {
  fromId: string;
  toId: string;
}

const LineTo: React.FunctionComponent<Props> = ({ toId, fromId }) => {
  const { lineCreated, lineDestroyed } = React.useContext(LineContext);
  const lineId = React.useMemo(() => uuidv4(), []);

  React.useEffect(() => {
    lineCreated({ lineId, fromId, toId });

    return () => lineDestroyed(lineId);
  }, [toId, fromId, lineCreated, lineDestroyed]);

  return null;
};

export default LineTo;
