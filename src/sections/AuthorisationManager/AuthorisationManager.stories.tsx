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
import { Switch, Route, RouteComponentProps } from "react-router";

import AuthorisationManager from ".";
import StroomDecorator from "../../testing/storybook/StroomDecorator";
import { addThemedStories } from "../../lib/themedStoryGenerator";

import "../../styles/main.css";
import UserAuthorisationEditor from "./UserAuthorisationEditor";

const AuthorisationManagerWithRouter = () => (
  <Switch>
    <Route
      exact
      path="/s/authorisationManager/:userUuid"
      render={(props: RouteComponentProps<any>) => (
        <UserAuthorisationEditor userUuid={props.match.params.userUuid} />
      )}
    />
    <Route component={AuthorisationManager} />
  </Switch>
);

const stories = storiesOf(
  "Sections/Authorisation Manager",
  module
).addDecorator(StroomDecorator);

addThemedStories(stories, <AuthorisationManagerWithRouter />);
