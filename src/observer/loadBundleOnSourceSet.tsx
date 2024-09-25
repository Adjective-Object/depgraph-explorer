import { store } from "../store";
import { appWorker } from "..";

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

  switch (bundleData.bundleSource.type) {
    case "SINGLE_URL":
      appWorker.postMessage({
        type: "INIT_STORE_FROM_URL",
        payloadUrl: bundleData.bundleSource.bundleSourceUrl,
      });
      break;
    case "MULTIPLE_URLS":
      appWorker.postMessage({
        type: "INIT_STORE_FROM_MULTI_URL",
        prUrl: bundleData.bundleSource.prUrl,
        baselineUrl: bundleData.bundleSource.baselineUrl,
      });
      break;
    case "MULTIPLE_BLOBS":
      appWorker.postMessage({
        type: "INIT_STORE_FROM_BUNDLE_STATS_STRINGS",
        baselineString: bundleData.bundleSource.baselineBlob,
        prString: bundleData.bundleSource.prBlob,
      });
      break;
  }
  hasPosted = true;
});
