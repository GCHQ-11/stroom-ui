import { useEffect } from "react";

import { StoreState } from "./types";
import useApi from "./useApi";
import useReduxState from "../../lib/useReduxState";
import { useActionCreators } from "./redux";

/**
 * Convenience hook for using the Element Definitions and the Element Property Definitions
 * from the server. Handles the link between the REST API and the Redux state.
 */
const useElements = (): StoreState => {
  const { fetchElements, fetchElementProperties } = useApi();
  const { elementsReceived, elementPropertiesReceived } = useActionCreators();

  useEffect(() => {
    fetchElements().then(elementsReceived);
    fetchElementProperties().then(elementPropertiesReceived);
  }, [
    fetchElements,
    fetchElementProperties,
    elementsReceived,
    elementPropertiesReceived
  ]);

  return useReduxState(({ elements }) => elements);
};

export default useElements;
