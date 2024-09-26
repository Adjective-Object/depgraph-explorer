import { store } from "../store";
import { appWorker } from "..";
import { AppToWorkerMessage } from "../worker/messages";

let hasPosted = false;

store.subscribe(() => {
  const bundleData = store.getState().bundleData;
  if (
    hasPosted ||
    !bundleData.bundleSource ||
    bundleData.initializationState.type !== "INITIALIZING"
  ) {
    return;
  }

  let message: AppToWorkerMessage;
  switch (bundleData.bundleSource.type) {
    case "SINGLE_URL":
      message = ({
        type: "INIT_STORE_FROM_URL",
        payloadUrl: bundleData.bundleSource.bundleSourceUrl,
      });
      break;
    case "MULTIPLE_URLS":
      message = ({
        type: "INIT_STORE_FROM_MULTI_URL",
        prUrl: bundleData.bundleSource.prUrl,
        baselineUrl: bundleData.bundleSource.baselineUrl,
      });
      break;
    case "MULTIPLE_BLOBS":
      message = ({
        type: "INIT_STORE_FROM_BUNDLE_STATS_STRINGS",
        baselineString: bundleData.bundleSource.baselineBlob,
        prString: bundleData.bundleSource.prBlob,
      });
      break;
    case "SINGLE_BLOB":
      message = ({
        type: "INIT_STORE_FROM_BUNDLE_STATS_STRING",
        blobString: bundleData.bundleSource.blob,
      });
      break;
  }
  appWorker.postMessage(message)
  hasPosted = true;
});
