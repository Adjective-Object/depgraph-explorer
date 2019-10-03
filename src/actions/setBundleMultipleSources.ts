import { SetBundleDataMultipleSourcesAction } from "../reducers/schema";
import { dispatch } from "../store";

export const setBundleMultipleSources = (
  prBundleUrl: string,
  baselineBundleUrl: string
): SetBundleDataMultipleSourcesAction =>
  dispatch({
    type: "SET_BUNDLE_DATA_MULTIPLE_SOURCES",
    baselineBundleUrl,
    prBundleUrl
  });
