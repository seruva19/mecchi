import { useState, useEffect, useRef } from 'react';

export const useArrayChange = (array: Array<any>) => {
  const [trigger, setTrigger] = useState(0);
  const prevArrayRef = useRef<any>([]);

  useEffect(() => {
    const isDifferent = (first: Array<any>, second: Array<any>) => {
      if (first.length !== second.length) return true;
      for (let i = 0; i < first.length; i++) {
        if (first[i] !== second[i]) return true;
      }
      return false;
    };

    if (isDifferent(array, prevArrayRef.current)) {
      setTrigger(trigger => trigger + 1);
      prevArrayRef!.current = array;
    }
  }, [array]);

  return trigger;
}
