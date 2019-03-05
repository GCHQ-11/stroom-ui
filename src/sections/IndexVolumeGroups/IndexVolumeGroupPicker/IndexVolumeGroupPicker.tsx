import * as React from "react";
import { useEffect, useState } from "react";

import Select from "react-select";

import useApi from "../../../api/indexVolumeGroup";
import { SelectOptionType } from "../../../types";
import useReduxState from "../../../lib/useReduxState";

export interface Props {
  value?: string;
  onChange: (v: string) => any;
}

const IndexVolumeGroupPicker = ({ value, onChange }: Props) => {
  const {getIndexVolumeGroupNames} = useApi();
  useEffect(() => {
    getIndexVolumeGroupNames();
  }, [getIndexVolumeGroupNames]);

  const groupNames = useReduxState(
    ({ indexVolumeGroups: { groupNames } }) => groupNames
  );

  const options: Array<SelectOptionType> = groupNames.map(n => ({
    value: n,
    label: n
  }));

  return (
    <Select
      value={options.find(o => o.value === value)}
      onChange={(o: SelectOptionType) => onChange(o.value)}
      placeholder="Index Volume Group"
      options={options}
    />
  );
};

export interface UseProps extends Props {
  reset: () => void;
}

export const usePicker = (): UseProps => {
  const [value, onChange] = useState<string | undefined>(undefined);

  return {
    value,
    onChange,
    reset: () => onChange(undefined)
  };
};

export default IndexVolumeGroupPicker;
