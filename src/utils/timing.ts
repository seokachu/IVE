type Cancelable<A extends unknown[]> = ((...args: A) => void) & { cancel: () => void };

//지정한 간격 안에서는 한 번만 실행 — 마지막 호출도 간격이 지난 뒤 실행된다
export const throttle = <A extends unknown[]>(callback: (...args: A) => void, wait: number): Cancelable<A> => {
  let lastCalledAt = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: A | null = null;

  const invoke = (args: A) => {
    lastCalledAt = Date.now();
    lastArgs = null;
    callback(...args);
  };

  const throttled = ((...args: A) => {
    const remaining = wait - (Date.now() - lastCalledAt);
    lastArgs = args;

    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      invoke(args);
      return;
    }

    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        if (lastArgs) invoke(lastArgs);
      }, remaining);
    }
  }) as Cancelable<A>;

  throttled.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    lastArgs = null;
  };

  return throttled;
};

//마지막 호출로부터 wait만큼 조용해지면 실행
export const debounce = <A extends unknown[]>(callback: (...args: A) => void, wait: number): Cancelable<A> => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = ((...args: A) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      callback(...args);
    }, wait);
  }) as Cancelable<A>;

  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };

  return debounced;
};
