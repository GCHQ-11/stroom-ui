import { DocRefType, DocRefConsumer } from "src/types";

export interface Props {
  docRef: DocRefType;
  dndIsOver?: boolean;
  dndCanDrop?: boolean;
  openDocRef: DocRefConsumer;
  enterFolder?: DocRefConsumer;
  children?: React.ReactNode;
  toggleSelection: (itemKey: string) => void;
  selectedDocRefs: Array<DocRefType>;
  focussedDocRef?: DocRefType;
}
