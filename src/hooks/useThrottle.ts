import { useCallback, useRef } from "react";

export function useThrottle<T extends (...args: any[]) => void>(
  fn: T,
  limit: number
): T {
  const isThrottled = useRef<boolean>(false);

  return useCallback(
    (...args: any[]) => {
      if (isThrottled.current) return;

      fn(...args);
      isThrottled.current = true;

      setTimeout(() => {
        isThrottled.current = false;
      }, limit);
    },
    [fn, limit]
  ) as T;
}
