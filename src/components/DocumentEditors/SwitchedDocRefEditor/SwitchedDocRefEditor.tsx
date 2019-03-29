import * as React from 'react';
import {useEffect, useMemo} from 'react';

import FolderExplorer from '../FolderExplorer';
import DictionaryEditor from '../DictionaryEditor';
import PipelineEditor from '../../PipelineEditor';
import XsltEditor from '../XsltEditor';
import PathNotFound from '../../PathNotFound';
import useRecentItems from '../../../lib/useRecentItems';
import IndexEditor from '../IndexEditor';
import {useDocumentTree} from '../../../api/explorer';

interface Props {
  docRefUuid: string;
}

let SwitchedDocRefEditor = ({docRefUuid}: Props) => {
  const {addRecentItem} = useRecentItems();
  const {findDocRefWithLineage} = useDocumentTree();
  const {node: docRef} = useMemo(() => findDocRefWithLineage(docRefUuid), [
    findDocRefWithLineage,
    docRefUuid,
  ]);

  useEffect(() => {
    addRecentItem(docRef);
  });

  switch (docRef.type) {
    case 'System':
    case 'Folder':
      return <FolderExplorer folderUuid={docRef.uuid} />;
    case 'AnnotationsIndex':
      return <div>Annotations Index Editor</div>;
    case 'ElasticIndex':
      return <div>Elastic Index Editor</div>;
    case 'XSLT':
      return <XsltEditor xsltUuid={docRef.uuid} />;
    case 'Pipeline':
      return <PipelineEditor pipelineId={docRef.uuid} />;
    case 'Dashboard':
      return <div>Dashboard Editor</div>;
    case 'Dictionary':
      return <DictionaryEditor dictionaryUuid={docRef.uuid} />;
    case 'Feed':
      return <div>Feed Editor</div>;
    case 'Index':
      return <IndexEditor indexUuid={docRef.uuid} />;
    case 'Script':
      return <div>Script Editor</div>;
    case 'StatisticStore':
      return <div>Statistics Store Editor</div>;
    case 'StroomStatsStore':
      return <div>Stroom Stats Store Editor</div>;
    case 'TextConverter':
      return <div>Text Converter Editor</div>;
    case 'Visualisation':
      return <div>Visualisation Editor</div>;
    case 'XMLSchema':
      return <div>XML Schema Editor</div>;
    default:
      return (
        <PathNotFound message="no editor provided for this doc ref type " />
      );
  }
};

export default SwitchedDocRefEditor;
