import React, { useState } from "react";

export function useLoading<T extends (...args: any) => Promise<any>>(
  action: T
) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<any | undefined>(undefined);
  let isMounted = true;

  React.useEffect(() => {
    isMounted = true;
    return () => {
      isMounted = false;
    };
  }, []);

  const doAction = async (...args: Parameters<T>) => {
    setLoading(true);
    setSuccess(false);
    setError(undefined);
    return new Promise((resolve) => {
      action(...args)
        .then((v) => {
          if (!isMounted) return resolve(undefined);
          setSuccess(true);
          resolve(v);
        })
        .catch((err) => {
          if (isMounted) {
            setError(err);
            setSuccess(false);
          }
          resolve(undefined);
        });
    }).finally(() => isMounted && setLoading(false));
  };
  return [doAction, loading, error, success];
}
