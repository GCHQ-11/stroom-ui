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
import DocRefImage from "../DocRefImage";

interface Props {
  text: string;
  docRefType: string;
  className?: string;
}

const DocRefIconHeader: React.FunctionComponent<Props> = ({
  text,
  docRefType,
  className,
}) => (
  <div className={`icon-header ${className || ""}`}>
    <DocRefImage docRefType={docRefType} size="lg" />
    <p className="icon-header__text">{text}</p>
  </div>
);

export default DocRefIconHeader;
