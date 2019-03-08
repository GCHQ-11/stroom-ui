import { useEffect, useMemo, useState, useCallback } from "react";

import { useApi as usePipelineApi } from "../../api/pipelineDocument";
import { useDocRefEditor } from "../DocRefEditor";
import {
  getPipelineAsTree,
  moveElementInPipeline,
  removeElementFromPipeline,
  createNewElementInPipeline,
  reinstateElementToPipeline,
  setElementPropertyValueInPipeline,
  revertPropertyToParent,
  revertPropertyToDefault
} from "./pipelineUtils";
import { PipelineEditApi, PipelineProps } from "./types";

export const usePipelineState = (pipelineId: string): PipelineProps => {
  const { fetchPipeline, savePipeline } = usePipelineApi();

  useEffect(() => {
    fetchPipeline(pipelineId);
  }, [pipelineId]);

  const [selectedElementId, setSelectedElementId] = useState<
    string | undefined
  >(undefined);
  const [elementInitialValues, setInitialValues] = useState<object>({});

  const useEditorProps = useDocRefEditor({
    docRefUuid: pipelineId,
    saveDocument: savePipeline
  });

  const { docRefContents, onDocumentChange } = useEditorProps;
  const asTree = useMemo(() => getPipelineAsTree(docRefContents), [
    docRefContents
  ]);

  return {
    asTree,
    useEditorProps,
    pipelineEditApi: {
      elementInitialValues,
      selectedElementId,
      settingsUpdated: useCallback<PipelineEditApi["settingsUpdated"]>(
        ({ description }) => {
          onDocumentChange({ description });
        },
        [onDocumentChange]
      ),
      elementSelected: useCallback<PipelineEditApi["elementReinstated"]>(
        (elementId, initialValues) => {
          setSelectedElementId(elementId);
          setInitialValues(initialValues);
        },
        [setSelectedElementId, setInitialValues]
      ),
      elementSelectionCleared: useCallback<
        PipelineEditApi["elementSelectionCleared"]
      >(() => {
        setSelectedElementId(undefined);
        setInitialValues({});
      }, [setSelectedElementId, setInitialValues]),
      elementDeleted: useCallback<PipelineEditApi["elementDeleted"]>(
        elementId => {
          if (!!docRefContents) {
            onDocumentChange(
              removeElementFromPipeline(docRefContents, elementId)
            );
          }
        },
        [docRefContents]
      ),
      elementReinstated: useCallback<PipelineEditApi["elementReinstated"]>(
        (parentId, recycleData) => {
          if (!!docRefContents) {
            onDocumentChange(
              reinstateElementToPipeline(docRefContents, parentId, recycleData)
            );
          }
        },
        [docRefContents]
      ),
      elementAdded: useCallback<PipelineEditApi["elementAdded"]>(
        (parentId, elementDefinition, name) => {
          if (!!docRefContents) {
            onDocumentChange(
              createNewElementInPipeline(
                docRefContents,
                parentId,
                elementDefinition,
                name
              )
            );
          }
        },
        [docRefContents, onDocumentChange]
      ),
      elementMoved: useCallback<PipelineEditApi["elementMoved"]>(
        (itemToMove, destination) => {
          if (!!docRefContents) {
            onDocumentChange(
              moveElementInPipeline(docRefContents, itemToMove, destination)
            );
          }
        },
        []
      ),
      elementPropertyUpdated: useCallback<
        PipelineEditApi["elementPropertyUpdated"]
      >((element, name, propertyType, propertyValue) => {
        if (!!docRefContents) {
          onDocumentChange(
            setElementPropertyValueInPipeline(
              docRefContents,
              element,
              name,
              propertyType,
              propertyValue
            )
          );
        }
      }, []),
      elementPropertyRevertToDefault: useCallback<
        PipelineEditApi["elementPropertyRevertToDefault"]
      >((elementId, name) => {
        if (!!docRefContents) {
          onDocumentChange(
            revertPropertyToDefault(docRefContents, elementId, name)
          );
        }
      }, []),
      elementPropertyRevertToParent: useCallback<
        PipelineEditApi["elementPropertyRevertToParent"]
      >((elementId, name) => {
        if (!!docRefContents) {
          onDocumentChange(
            revertPropertyToParent(docRefContents, elementId, name)
          );
        }
      }, [])
    }
  };
};

export default usePipelineState;
