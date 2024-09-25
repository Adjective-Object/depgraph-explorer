import { SetBundleDataBlobsAction } from "../reducers/schema";
import { dispatch } from "../store";

export const setBundleBlobs = (
  baselineBlob: string,
  prBlob: string,
): SetBundleDataBlobsAction => {
  return dispatch({
    type: "SET_BUNDLE_DATA_BLOBS",
    baselineBlob,
    prBlob,
  });
};
