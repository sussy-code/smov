import classNames from "classnames";
import { f } from "ofetch/dist/shared/ofetch.441891d5";
import { useCallback, useMemo, useState } from "react";
import { useAsyncFn } from "react-use";

import { mwFetch } from "@/backend/helpers/fetch";
import { Button } from "@/components/Button";
import { Icon, Icons } from "@/components/Icon";
import { Box } from "@/components/layout/Box";
import { Divider } from "@/components/player/internals/ContextMenu/Misc";
import { Heading2 } from "@/components/utils/Text";
import { conf } from "@/setup/config";

export function WorkerItem(props: {
  name: string;
  errored?: boolean;
  success?: boolean;
  errorText?: string;
}) {
  return (
    <div className="flex mb-2">
      <Icon
        icon={
          props.errored
            ? Icons.WARNING
            : props.success
            ? Icons.CIRCLE_CHECK
            : Icons.EYE_SLASH
        }
        className={classNames({
          "text-xl mr-2 mt-0.5": true,
          "text-video-scraping-error": props.errored,
          "text-video-scraping-noresult": !props.errored && !props.success,
          "text-video-scraping-success": props.success,
        })}
      />
      <div className="flex-1">
        <p className="text-white font-bold">{props.name}</p>
        {props.errorText ? <p>{props.errorText}</p> : null}
      </div>
    </div>
  );
}

export function WorkerTestPart() {
  const workerList = useMemo(() => {
    return conf().PROXY_URLS.map((v, ind) => ({
      id: ind.toString(),
      url: v,
    }));
  }, []);
  const [workerState, setWorkerState] = useState<
    { id: string; status: "error" | "success"; error?: Error }[]
  >([]);

  const runTests = useAsyncFn(async () => {
    function updateWorker(id: string, data: (typeof workerState)[number]) {
      setWorkerState((s) => {
        return [...s.filter((v) => v.id !== id), data];
      });
    }
    setWorkerState([]);
    for (const worker of workerList) {
      try {
        await mwFetch(worker.url, {
          query: {
            destination: "https://postman-echo.com/get",
          },
        });
        updateWorker(worker.id, {
          id: worker.id,
          status: "success",
        });
      } catch (err) {
        updateWorker(worker.id, {
          id: worker.id,
          status: "error",
          error: err as Error,
        });
      }
    }
  }, [workerList, setWorkerState]);

  return (
    <>
      <Heading2 className="mb-0 mt-12">Worker tests</Heading2>
      <p className="mb-8 mt-2">15 workers registered</p>
      <Box>
        {workerList.map((v, i) => {
          const s = workerState.find((segment) => segment.id);
          const name = `Worker ${i + 1}`;
          if (!s) return <WorkerItem name={name} key={v.id} />;
          if (s.status === "error")
            return (
              <WorkerItem
                name={name}
                errored
                key={v.id}
                errorText={s.error?.toString()}
              />
            );
          if (s.status === "success")
            return <WorkerItem name={name} success key={v.id} />;
          return <WorkerItem name={name} key={v.id} />;
        })}
        <Divider />
        <div className="flex justify-end">
          <Button theme="purple">Run tests</Button>
        </div>
      </Box>
    </>
  );
}
