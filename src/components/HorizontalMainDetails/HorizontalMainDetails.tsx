import * as React from "react";
import * as Mousetrap from "mousetrap";

import PanelGroup from "react-panelgroup";
import useLocalStorage, { storeNumber } from "src/lib/useLocalStorage";
import HorizontalPanel from "../HorizontalPanel";

interface Props {
  storageKey: string;
  title: React.ReactNode;
  headerMenuItems?: React.ReactNode;
  mainContent: React.ReactNode;
  detailContent: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const HorizontalMainDetails: React.FunctionComponent<Props> = ({
  storageKey,
  title,
  headerMenuItems,
  mainContent,
  detailContent,
  onClose,
  isOpen,
}) => {
  const { value: mainHeight, setValue: setMainHeight } = useLocalStorage(
    `mainHeight_${storageKey}`,
    200,
    storeNumber,
  );
  const { value: detailsHeight, setValue: setDetailsHeight } = useLocalStorage(
    `detailsHeight_${storageKey}`,
    200,
    storeNumber,
  );

  React.useEffect(() => {
    Mousetrap.bind("esc", onClose);

    return () => {
      Mousetrap.unbind("esc");
    };
  }, []);

  return (
    <PanelGroup
      direction="column"
      panelWidths={[
        {
          resize: "dynamic",
          minSize: 100,
          size: mainHeight,
        },
        {
          resize: "dynamic",
          minSize: 100,
          size: detailsHeight,
        },
      ]}
      onUpdate={(panelWidths: any[]) => {
        setMainHeight(panelWidths[0].size);
        setDetailsHeight(panelWidths[1].size);
      }}
    >
      {mainContent}
      {isOpen && (
        <HorizontalPanel
          title={title}
          headerMenuItems={headerMenuItems}
          content={detailContent}
          onClose={onClose}
        />
      )}
    </PanelGroup>
  );
};

export default HorizontalMainDetails;
