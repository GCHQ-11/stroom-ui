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
import { Dispatch } from "redux";
import { actionCreators } from "./redux";
import { wrappedGet, wrappedPost } from "../../lib/fetchTracker.redux";
import { GlobalStoreState } from "../../startup/reducers";
import useThunk from "../../lib/useThunk";

const { indexReceived, indexSaved } = actionCreators;

export const fetchIndex = (indexUuid: string) => (
  dispatch: Dispatch,
  getState: () => GlobalStoreState
) => {
  const state = getState();
  const url = `${
    state.config.values.stroomBaseServiceUrl
  }/index/v1/${indexUuid}`;
  wrappedGet(
    dispatch,
    state,
    url,
    response =>
      response
        .text()
        .then((index: string) => dispatch(indexReceived(indexUuid, index))),
    {
      headers: {
        Accept: "application/xml",
        "Content-Type": "application/xml"
      }
    }
  );
};
export const useFetchIndex = () => useThunk(fetchIndex);

export const saveIndex = (indexUuid: string) => (
  dispatch: Dispatch,
  getState: () => GlobalStoreState
) => {
  const state = getState();
  const url = `${
    state.config.values.stroomBaseServiceUrl
  }/index/v1/${indexUuid}`;

  const body = state.indexEditor[indexUuid].indexData;

  wrappedPost(
    dispatch,
    state,
    url,
    response => response.text().then(() => dispatch(indexSaved(indexUuid))),
    {
      body,
      headers: {
        Accept: "application/xml",
        "Content-Type": "application/xml"
      }
    }
  );
};
export const useSaveIndex = () => useThunk(saveIndex);
