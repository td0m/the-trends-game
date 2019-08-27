import React, { useState, useEffect } from "react";
const useDelay = (ms: number) => {
  const [value, setValue] = useState(false);
  useEffect(() => {
    setTimeout(() => setValue(true), ms);
  }, []);
  return value;
};

const useCountUp = (final: number, duration: number) => {
  const [value, setValue] = useState(0);
  const mounted = useDelay(200);

  const tick = 1;
  console.log(tick);

  useEffect(() => {
    if (mounted) {
      setTimeout(() => {
        if (value < final) setValue(value + 1);
      }, tick);
    }
  }, [value, mounted]);

  if (final <= 0) return final;

  return value;
};

const CountUp = ({
  value,
  duration = 200
}: {
  value: number;
  duration?: number;
}) => {
  const score = useCountUp(value, duration);
  return <span>{score}</span>;
};

export default CountUp;
