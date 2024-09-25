import { dispatch } from "../store";
import { MarkBundleDataLoadErrorAction } from "../reducers/schema";

export const markBundleDataLoadError = (
  errorMessage: string,
): MarkBundleDataLoadErrorAction =>
  dispatch({
    type: "MARK_BUNDLE_DATA_ERROR",
    errorMessage,
  });
