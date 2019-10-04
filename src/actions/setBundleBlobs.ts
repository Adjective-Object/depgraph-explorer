import { SetBundleDataBlobsAction } from "../reducers/schema";
import { dispatch } from "../store";
import { InitStoreFromBundleRequestMessage } from "../worker/messages";
import { appWorker } from "..";

export const setBundleBlobs = (
  baselineBlob: string,
  prBlob: string
): SetBundleDataBlobsAction => {
  const initStoreMessage: InitStoreFromBundleRequestMessage = {
    type: "INIT_STORE_FROM_BUNDLE_STATS_STRINGS",
    baselineString: baselineBlob,
    prString: prBlob
  };
  appWorker.postMessage(initStoreMessage);

  return dispatch({
    type: "SET_BUNDLE_DATA_BLOBS",
    baselineBlob,
    prBlob
  });
};
