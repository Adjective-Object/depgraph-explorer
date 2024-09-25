import { MarkBundleDataInitializedAction } from "../reducers/schema";
import { dispatch } from "../store";

export const markBundleDataInitialized = (): MarkBundleDataInitializedAction =>
  dispatch({
    type: "MARK_BUNDLE_DATA_INITIALIZED",
  });
