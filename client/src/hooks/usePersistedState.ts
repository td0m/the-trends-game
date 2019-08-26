import { useState, useEffect } from "react";

const usePersistedState = <T>(initialValue: T, key: string) => {
  const local = localStorage.getItem(key);
  if (local) initialValue = JSON.parse(local).value;
  const state = useState<T>(initialValue);
  const [value, setValue] = state;

  useEffect(() => {
    const local = localStorage.getItem(key);
    if (local) setValue(JSON.parse(local).value);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify({ value }));
    //eslint-disable-next-line
  }, [value]);

  return state;
};

export default usePersistedState;
