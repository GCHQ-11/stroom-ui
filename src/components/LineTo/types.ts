export interface LineDefinition {
  lineId: string;
  fromRect: DOMRect;
  toRect: DOMRect;
}

export type LineElementCreator = React.FunctionComponent<LineDefinition>;

export interface LineType {
  lineId: string;
  fromId: string;
  toId: string;
}

export interface LineContextApi {
  lineCreated: (line: LineType) => void;
  lineDestroyed: (lineId: string) => void;
}
