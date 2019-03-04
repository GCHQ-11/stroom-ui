import * as React from "react";

import DocRefImage from "../DocRefImage";
import { OptionType } from "../../types";
import DropdownSelect, { DropdownOptionProps } from "../DropdownSelect";
import useDocRefTypes from "../FolderExplorer/useDocRefTypes";

const DocRefTypeOption = ({
  inFocus,
  option: { text, value },
  onClick
}: DropdownOptionProps) => (
  <div className={`hoverable ${inFocus ? "inFocus" : ""}`} onClick={onClick}>
    <DocRefImage size="sm" docRefType={value} />
    {text}
  </div>
);

export interface Props {
  onChange: (docRefType: string) => any;
  value?: string;
}

let DocRefTypePicker = ({ ...rest }: Props) => {
  const { docRefTypes } = useDocRefTypes();

  let options: Array<OptionType> = docRefTypes.map((d: string) => ({
    text: d,
    value: d
  }));
  return (
    <DropdownSelect
      {...rest}
      options={options}
      OptionComponent={DocRefTypeOption}
    />
  );
};

export default DocRefTypePicker;
