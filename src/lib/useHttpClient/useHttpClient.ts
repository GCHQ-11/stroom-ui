import { Action } from "redux";
import { useCallback } from "react";

import { useActionCreators as useErrorActionCreators } from "../../components/ErrorPage";
import { prepareReducer, genUseActionCreators } from "../redux-actions-ts";

import handleStatus from "../handleStatus";
import { useContext } from "react";
import { StoreContext } from "redux-react-hook";
import useRouter from "../useRouter";

enum FetchState {
  UNREQUESTED,
  REQUESTED,
  RESPONDED,
  FAILED
}

export interface StoreState {
  [s: string]: FetchState;
}

const RESET_ALL_URLS = "RESET_ALL_URLS";
const URL_RESET = "URL_RESET";
const URL_REQUESTED = "URL_REQUESTED";
const URL_RESPONDED = "URL_RESPONDED";
const URL_FAILED = "URL_FAILED";

export interface UrlAction {
  url: string;
  fetchState: FetchState;
}

export type UrlResetAction = UrlAction & Action<"URL_RESET">;
export type UrlRequestedAction = UrlAction & Action<"URL_REQUESTED">;
export type UrlRespondedAction = UrlAction & Action<"URL_RESPONDED">;
export type UrlFailedAction = UrlAction & Action<"URL_FAILED">;
export type ResetAllUrlsAction = Action<"RESET_ALL_URLS">;

const defaultState: StoreState = {};

export const useActionCreators = genUseActionCreators({
  resetAllUrls: (): ResetAllUrlsAction => ({
    type: RESET_ALL_URLS
  }),
  urlReset: (url: string): UrlResetAction => ({
    type: URL_RESET,
    url,
    fetchState: FetchState.UNREQUESTED
  }),
  urlRequested: (url: string): UrlRequestedAction => ({
    type: URL_REQUESTED,
    url,
    fetchState: FetchState.REQUESTED
  }),
  urlResponded: (url: string): UrlRespondedAction => ({
    type: URL_RESPONDED,
    url,
    fetchState: FetchState.RESPONDED
  }),
  urlFailed: (url: string): UrlFailedAction => ({
    type: URL_FAILED,
    url,
    fetchState: FetchState.FAILED
  })
});

export const reducer = prepareReducer(defaultState)
  .handleAction(RESET_ALL_URLS, () => defaultState)
  .handleActions<Action & UrlAction>(
    [URL_RESET, URL_REQUESTED, URL_RESPONDED, URL_FAILED],
    (state, { url, fetchState }) => ({
      ...state,
      [url]: { fetchState, body: undefined }
    })
  )
  .getReducer();

/**
 * A wrapper around fetch that can be used to de-duplicate GET calls to the same resources.
 * It also allows us to track all the URL's which are being requested from remote servers so that we can
 * add a status bar to the UI to indicate how the requests are going.
 *
 * @param {function} dispatch The redux dispatch funciton
 * @param {object} state The current redux state
 * @param {string} url The URL to fetch
 * @param {function} successCallback The function to call with the response if successful. Failures will be handled generically
 */

export interface HttpClient {
  httpGet: (
    url: string,
    successCallback: (x: any) => void,
    options?: {
      [s: string]: any;
    },
    forceGet?: boolean
  ) => void;
  httpGetPromise: (
    url: string,
    bodyProcessor: <T>(r: Response) => Promise<T>,
    options?: {
      [s: string]: any;
    },
    forceGet?: boolean
  ) => Promise<any>;
  httpPost: (
    url: string,
    successCallback: (x: any) => void,
    options?: {
      [s: string]: any;
    }
  ) => void;
  httpPut: (
    url: string,
    successCallback: (x: any) => void,
    options?: {
      [s: string]: any;
    }
  ) => void;
  httpDelete: (
    url: string,
    successCallback: (x: any) => void,
    options?: {
      [s: string]: any;
    }
  ) => void;
  httpPatch: (
    url: string,
    successCallback: (x: any) => void,
    options?: {
      [s: string]: any;
    }
  ) => void;
}

const cache = {};

export const useHttpClient = (): HttpClient => {
  const store = useContext(StoreContext);
  const {
    setErrorMessage,
    setHttpErrorCode,
    setStackTrace
  } = useErrorActionCreators();
  const { urlRequested, urlResponded, urlFailed } = useActionCreators();
  const { history } = useRouter();

  if (!store) {
    throw new Error("Could not get Redux Store for making HTTP calls");
  }

  const httpGet = useCallback(
    (
      url: string,
      successCallback: (x: any) => void,
      options?: {
        [s: string]: any;
      },
      forceGet?: boolean
    ) => {
      const state = store.getState();
      const jwsToken = state.authentication.idToken;
      const currentFetchState = state.fetch[url] || FetchState.UNREQUESTED;
      let needToFetch = false;

      // console.group("Requesting ", url);
      // console.log("Current State of URL", { url, currentState });

      if (!forceGet) {
        switch (currentFetchState) {
          case undefined:
            // console.log('Never even heard of it', url);
            needToFetch = true;
            break;
          case FetchState.UNREQUESTED:
            // console.log('Has been reset, go again!', url);
            needToFetch = true;
            break;
          case FetchState.FAILED:
            // console.log('It failed last time, second times a charm?', url);
            needToFetch = true;
            break;
          case FetchState.REQUESTED:
            // console.log('Already asked, dont ask again', url);
            needToFetch = false;
            break;
          case FetchState.RESPONDED:
            // console.log('Already got it, dont ask again', url);
            needToFetch = false;
            break;
          default:
            // console.log('Default state? Nonsense');
            break;
        }
      } else {
        needToFetch = true;
      }

      if (needToFetch) {
        urlRequested(url);

        fetch(url, {
          method: "get",
          mode: "cors",
          ...options,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwsToken}`,
            ...(options ? options.headers : {})
          }
        })
          .then(handleStatus)
          .then(responseBody => {
            urlResponded(url);
            successCallback(responseBody);
          })
          .catch(error => {
            urlFailed(url);
            setErrorMessage(error.message);
            setStackTrace(error.stack);
            setHttpErrorCode(error.status);
            history.push("/s/error");
          });
      }

      // console.groupEnd();
    },
    [urlRequested, urlFailed, setErrorMessage, setHttpErrorCode, setStackTrace]
  );

  const httpGetPromise = useCallback(
    <T>(
      url: string,
      bodyProcessor: (r: Response) => Promise<T | void>,
      options?: {
        [s: string]: any;
      },
      forceGet?: boolean
    ): Promise<T | void> => {
      const state = store.getState();
      const jwsToken = state.authentication.idToken;
      const currentFetchState = state.fetch[url] || FetchState.UNREQUESTED;
      let needToFetch = false;

      // console.group("Requesting ", url);
      // console.log("Current State of URL", { url, currentState });

      if (!!cache[url]) {
        needToFetch = true;
      } else if (!forceGet) {
        switch (currentFetchState) {
          case undefined:
            // console.log('Never even heard of it', url);
            needToFetch = true;
            break;
          case FetchState.UNREQUESTED:
            // console.log('Has been reset, go again!', url);
            needToFetch = true;
            break;
          case FetchState.FAILED:
            // console.log('It failed last time, second times a charm?', url);
            needToFetch = true;
            break;
          case FetchState.REQUESTED:
            // console.log('Already asked, dont ask again', url);
            needToFetch = false;
            break;
          case FetchState.RESPONDED:
            // console.log('Already got it, dont ask again', url);
            needToFetch = false;
            break;
          default:
            // console.log('Default state? Nonsense');
            break;
        }
      } else {
        needToFetch = true;
      }

      if (needToFetch) {
        urlRequested(url);

        const p = fetch(url, {
          method: "get",
          mode: "cors",
          ...options,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwsToken}`,
            ...(options ? options.headers : {})
          }
        })
          .then(handleStatus)
          .then(responseBody => {
            urlResponded(url);
            return Promise.resolve(responseBody);
          })
          .then(bodyProcessor)
          .catch(error => {
            urlFailed(url);
            setErrorMessage(error.message);
            setStackTrace(error.stack);
            setHttpErrorCode(error.status);
            history.push("/s/error");
          });

        cache[url] = p;
        return p;
      } else {
        return cache[url];
      }

      // console.groupEnd();
    },
    [urlRequested, urlFailed, setErrorMessage, setHttpErrorCode, setStackTrace]
  );

  /**
   * Wrapper around fetch that allows us to track all the URL's being requested via the redux store.
   * This will not attempt de-duplication in the same way as the GET one does, because it doesn't make sense for
   * mutating calls to do that.
   *
   * @param {function} dispatch The redux dispatch funciton
   * @param {object} state The current redux state
   * @param {string} url The URL to fetch
   * @param {string} method The HTTP method to use (could be any of the mutating ones, PUT, POST, PATCH etc)
   * @param {object} body The string to send as the request body
   * @param {function} successCallback The function to call with the response if successful. Failures will be handled
   */
  const wrappedFetchWithBody = useCallback(
    (
      url: string,
      successCallback: (x: any) => void,
      options?: {
        [s: string]: any;
      }
    ) => {
      const state = store.getState();
      const jwsToken = state.authentication.idToken;

      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwsToken}`,
        ...(options ? options.headers : {})
      };

      fetch(url, {
        mode: "cors",
        ...options,
        headers
      })
        .then(handleStatus)
        .then(response => {
          urlResponded(url);
          successCallback(response);
        })
        .catch(error => {
          urlFailed(url);
          setErrorMessage(error.message);
          setStackTrace(error.stack);
          setHttpErrorCode(error.status);
          history.push("/s/error");
        });
    },
    [urlResponded, urlFailed, setErrorMessage, setStackTrace, setHttpErrorCode]
  );

  const httpPost = useCallback(
    (
      url: string,
      successCallback: (x: any) => void,
      options?: {
        [s: string]: any;
      }
    ) => {
      wrappedFetchWithBody(url, successCallback, {
        method: "post",
        ...options
      });
    },
    []
  );
  const httpPut = useCallback(
    (
      url: string,
      successCallback: (x: any) => void,
      options?: {
        [s: string]: any;
      }
    ) => {
      wrappedFetchWithBody(url, successCallback, {
        method: "put",
        ...options
      });
    },
    []
  );
  const httpDelete = useCallback(
    (
      url: string,
      successCallback: (x: any) => void,
      options?: {
        [s: string]: any;
      }
    ) => {
      wrappedFetchWithBody(url, successCallback, {
        method: "delete",
        ...options
      });
    },
    []
  );

  const httpPatch = useCallback(
    (
      url: string,
      successCallback: (x: any) => void,
      options?: {
        [s: string]: any;
      }
    ) => {
      wrappedFetchWithBody(url, successCallback, {
        method: "patch",
        ...options
      });
    },
    []
  );

  return {
    httpGet,
    httpGetPromise,
    httpDelete,
    httpPatch,
    httpPost,
    httpPut
  };
};

export default useHttpClient;
