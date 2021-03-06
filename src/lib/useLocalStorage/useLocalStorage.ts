import * as React from "react";

interface OutProps<T> {
  value: T;
  setValue: (value: T) => void;
}

interface StringConversion<T> {
  toString: (v: T) => string;
  fromString: (v: string) => T;
}

/**
 * Pre-made utility string conversion for storing boolean
 */
export const storeBoolean: StringConversion<boolean> = {
  toString: v => (v ? "true" : "false"),
  fromString: s => s === "true",
};

/**
 * Pre-made utility string conversion for storing string (no transform)
 */
export const storeString: StringConversion<string> = {
  toString: v => v,
  fromString: s => s,
};

/**
 * Pre-made utility string conversion for storing number
 */
export const storeNumber: StringConversion<number> = {
  toString: n => `${n}`,
  fromString: v => Number.parseInt(v),
};

/**
 * Pre-made utility string conversion generator for storing objects
 */
export const useStoreObjectFactory = <T>(): StringConversion<T> => {
  return React.useMemo(
    () => ({
      toString: (v: T) => JSON.stringify(v),
      fromString: (v: string) => JSON.parse(v),
    }),
    [],
  );
};

const useLocalStorage = function<T>(
  stateName: string,
  noLocalStorageInitialState: T,
  stringConversion: StringConversion<T>,
): OutProps<T> {
  const [value, setStateValue] = React.useState<T>(noLocalStorageInitialState);

  React.useEffect(() => {
    const rawValue: string | null = localStorage.getItem(stateName);
    if (rawValue !== null) {
      const value = stringConversion.fromString(rawValue);
      setStateValue(value);
    }
  }, [stateName, setStateValue]);

  const setValue = (valueToSet: T) => {
    const asString = stringConversion.toString(valueToSet);
    localStorage.setItem(stateName, asString);
    setStateValue(valueToSet);
  };

  return {
    value,
    setValue,
  };
};

export default useLocalStorage;
