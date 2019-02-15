declare module "react-panelgroup" {
  export interface Props {
    direction: "column" | "row";
    className?: string;
    panelWidths?: any;
    onUpdate?: (panelWidths: any) => void;
  }
  export default class PanelGroup extends React.Component<Props> {}
}
