import { actionCreators } from "./redux";
import { wrappedGet, wrappedPatch } from "../../lib/fetchTracker.redux";
import { StreamTasksResponseType } from "../../types";
import { Dispatch } from "redux";
import { GlobalStoreState } from "../../startup/reducers";
import useThunk from "../../lib/useThunk";

export enum TrackerSelection {
  first = "first",
  last = "last",
  none = "none"
}

export const fetchTrackers = (trackerSelection?: TrackerSelection) => (
  dispatch: Dispatch,
  getState: () => GlobalStoreState
) => {
  const state = getState();

  const rowsToFetch = state.processing.pageSize;
  dispatch(actionCreators.updatePageSize(rowsToFetch));

  let url = `${state.config.values.stroomBaseServiceUrl}/streamtasks/v1/?`;
  url += `pageSize=${rowsToFetch}`;
  url += `&offset=${state.processing.pageOffset}`;
  if (state.processing.sortBy !== undefined) {
    url += `&sortBy=${state.processing.sortBy}`;
    url += `&sortDirection=${state.processing.sortDirection}`;
  }

  if (
    state.processing.searchCriteria !== "" &&
    state.processing.searchCriteria !== undefined
  ) {
    url += `&filter=${state.processing.searchCriteria}`;
  }

  wrappedGet(
    dispatch,
    state,
    url,
    response => {
      response.json().then((trackers: StreamTasksResponseType) => {
        dispatch(
          actionCreators.updateTrackers(
            trackers.streamTasks,
            trackers.totalStreamTasks
          )
        );
        switch (trackerSelection) {
          case TrackerSelection.first:
            dispatch(actionCreators.selectFirst());
            break;
          case TrackerSelection.last:
            dispatch(actionCreators.selectLast());
            break;
          case TrackerSelection.none:
            dispatch(actionCreators.selectNone());
            break;
          default:
            break;
        }
      });
    },
    {},
    true
  );
};
export const useFetchTrackers = () => useThunk(fetchTrackers);

export const fetchMore = (trackerSelection: TrackerSelection) => (
  dispatch: Dispatch,
  getState: () => GlobalStoreState
) => {
  const state = getState();

  const rowsToFetch = state.processing.pageSize;
  dispatch(actionCreators.updatePageSize(rowsToFetch));

  const nextPageOffset = state.processing.pageOffset + 1;
  dispatch(actionCreators.changePage(nextPageOffset));

  let url = `${state.config.values.stroomBaseServiceUrl}/streamtasks/v1/?`;
  url += `pageSize=${rowsToFetch}`;
  url += `&offset=${nextPageOffset}`;
  if (state.processing.sortBy !== undefined) {
    url += `&sortBy=${state.processing.sortBy}`;
    url += `&sortDirection=${state.processing.sortDirection}`;
  }

  if (
    state.processing.searchCriteria !== "" &&
    state.processing.searchCriteria !== undefined
  ) {
    url += `&filter=${state.processing.searchCriteria}`;
  }

  wrappedGet(
    dispatch,
    state,
    url,
    response => {
      response.json().then((trackers: StreamTasksResponseType) => {
        dispatch(
          actionCreators.addTrackers(
            trackers.streamTasks,
            trackers.totalStreamTasks
          )
        );
        switch (trackerSelection) {
          case TrackerSelection.first:
            dispatch(actionCreators.selectFirst());
            break;
          case TrackerSelection.last:
            dispatch(actionCreators.selectLast());
            break;
          case TrackerSelection.none:
            dispatch(actionCreators.selectNone());
            break;
          default:
            break;
        }
      });
    },
    {},
    true
  );
};
export const useFetchMore = () => useThunk(fetchMore);

export const enableToggle = (filterId: number, isCurrentlyEnabled: boolean) => (
  dispatch: Dispatch,
  getState: () => GlobalStoreState
) => {
  const state = getState();
  const url = `${
    state.config.values.stroomBaseServiceUrl
  }/streamtasks/v1/${filterId}`;
  const body = JSON.stringify({
    op: "replace",
    path: "enabled",
    value: !isCurrentlyEnabled
  });

  wrappedPatch(
    dispatch,
    state,
    url,
    () => dispatch(actionCreators.updateEnabled(filterId, !isCurrentlyEnabled)),
    { body }
  );
};
export const useEnableToggle = () => useThunk(enableToggle);

// TODO: This isn't currently used.
// const getRowsPerPage = (isDetailsVisible) => {
//   const viewport = document.getElementById('table-container');
//   let rowsInViewport = 20; // Fallback default
//   const headerHeight = 46;
//   const footerHeight = 36;
//   // const detailsHeight = 295;
//   const rowHeight = 30;
//   if (viewport) {
//     const viewportHeight = viewport.offsetHeight;
//     const heightAvailableForRows = viewportHeight - headerHeight - footerHeight;
//     // if (isDetailsVisible) {
//     // heightAvailableForRows -= detailsHeight;
//     // }
//     rowsInViewport = Math.floor(heightAvailableForRows / rowHeight);
//   }

//   // Make sure we always request at least 1 row, even if the viewport is too small
//   // to display it without scrolling. Anything less will be rejected by the
//   // service for being rediculous.
//   if (rowsInViewport <= 0) {
//     return 1;
//   }
//   return rowsInViewport;
// };
