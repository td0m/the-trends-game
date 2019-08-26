import React, { useState, useEffect } from "react";
const useDelay = (ms: number) => {
  const [value, setValue] = useState(false);
  useEffect(() => {
    setTimeout(() => setValue(true), ms);
  }, []);
  return value;
};

const useCountUp = (initial: number, tick: number) => {
  const [value, setValue] = useState(0);
  const mounted = useDelay(200);

  useEffect(() => {
    if (mounted) {
      setTimeout(() => {
        if (value < initial) setValue(value + 1);
      }, tick);
    }
  }, [value, mounted]);

  if (initial <= 0) return initial;

  return value;
};

const CountUp = ({ value, tick = 25 }: { value: number; tick?: number }) => {
  const score = useCountUp(value, tick);
  return <span>{score}</span>;
};

export default CountUp;
