import { useState } from "react";
import { useAsyncFn } from "react-use";

import { MetaResponse, getBackendMeta } from "@/backend/accounts/meta";
import { Button } from "@/components/buttons/Button";
import { Icon, Icons } from "@/components/Icon";
import { Box } from "@/components/layout/Box";
import { Divider } from "@/components/utils/Divider";
import { Heading2 } from "@/components/utils/Text";
import { conf } from "@/setup/config";

export function BackendTestPart() {
  const backendUrl = conf().BACKEND_URL;

  const [status, setStatus] = useState<{
    hasTested: boolean;
    success: boolean;
    errorText: string;
    value: MetaResponse | null;
  }>({
    hasTested: false,
    success: false,
    errorText: "",
    value: null,
  });

  const [testState, runTests] = useAsyncFn(async () => {
    setStatus({
      hasTested: false,
      success: false,
      errorText: "",
      value: null,
    });

    try {
      const backendData = await getBackendMeta(backendUrl);
      return setStatus({
        hasTested: true,
        success: true,
        errorText:
          "Failed to call backend, double check the URL key and your internet connection",
        value: backendData,
      });
    } catch (err) {
      return setStatus({
        hasTested: true,
        success: false,
        errorText:
          "Failed to call backend, double check the URL key and your internet connection",
        value: null,
      });
    }
  }, [setStatus]);

  return (
    <>
      <Heading2 className="mb-8 mt-12">Backend API test</Heading2>
      <Box>
        <div>
          <div className="flex-1">
            {status.hasTested && status.success ? (
              <>
                <p>
                  <span className="inline-block w-36 text-white font-medium">
                    Version:
                  </span>
                  {status.value?.version}
                </p>
                <p>
                  <span className="inline-block w-36 text-white font-medium">
                    Backend name:
                  </span>
                  {status.value?.name}
                </p>
                <p>
                  <span className="inline-block w-36 text-white font-medium">
                    Description:
                  </span>
                  {status.value?.description ?? "Not set"}
                </p>
                <p>
                  <span className="inline-block w-36 text-white font-medium">
                    Captcha enabled:
                  </span>
                  {status.value?.hasCaptcha ? "Yes" : "No"}
                </p>
                <Divider />
              </>
            ) : null}
          </div>
        </div>
        <div className="w-full flex gap-6 justify-between items-center">
          {!status.hasTested ? (
            <p>Run the test to validate backend</p>
          ) : status.success ? (
            <p className="flex items-center text-md">
              <Icon
                icon={Icons.CIRCLE_CHECK}
                className="text-video-scraping-success mr-2"
              />
              Backend is working as expected
            </p>
          ) : (
            <div>
              <p className="text-white font-bold w-full mb-3 flex items-center gap-1">
                <Icon
                  icon={Icons.CIRCLE_EXCLAMATION}
                  className="text-video-scraping-error mr-2"
                />
                Backend is not working
              </p>
              <p>{status.errorText}</p>
            </div>
          )}
          <Button
            theme="purple"
            loading={testState.loading}
            className="whitespace-nowrap"
            onClick={runTests}
          >
            Test backend
          </Button>
        </div>
      </Box>
    </>
  );
}
