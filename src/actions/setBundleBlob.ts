import { SetBundleDataBlobAction } from "../reducers/schema";
import { dispatch } from "../store";

export const setBundleBlob = (
  blob: string,
): SetBundleDataBlobAction => {
  return dispatch({
    type: "SET_BUNDLE_DATA_BLOB",
    blob,
  });
};
