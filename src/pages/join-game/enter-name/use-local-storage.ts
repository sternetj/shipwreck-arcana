import { useState } from "react";

export function useLocalStorage(
  key: string = "",
  initial: string,
): [string, (value: string) => any] {
  const [value, setValue] = useState<string>(() => {
    return window.localStorage.getItem(key) || initial;
  });

  const updateValue = (val: string) => {
    key && window.localStorage.setItem(key, val);
    setValue(val);
  };

  return [value, updateValue];
}
