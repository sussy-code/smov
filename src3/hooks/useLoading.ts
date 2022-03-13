import React, { useMemo, useRef, useState } from "react";

export function useLoading<T extends (...args: any) => Promise<any>>(
  action: T
) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<any | undefined>(undefined);
  const isMounted = useRef(true);

  // we want action to be memoized forever
  const actionMemo = useMemo(() => action, []); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const doAction = useMemo(
    () =>
      async (...args: Parameters<T>) => {
        setLoading(true);
        setSuccess(false);
        setError(undefined);
        return new Promise((resolve) => {
          actionMemo(...args)
            .then((v) => {
              if (!isMounted.current) return resolve(undefined);
              setSuccess(true);
              resolve(v);
              return null;
            })
            .catch((err) => {
              if (isMounted) {
                setError(err);
                setSuccess(false);
              }
              resolve(undefined);
            });
        }).finally(() => isMounted.current && setLoading(false));
      },
    [actionMemo]
  );
  return [doAction, loading, error, success];
}
