import { BundleDataState, AppAction } from "./schema";
import produce from "immer";
export const bundleDataReducer = produce(
  (
    data: BundleDataState = {
      initializationState: { type: "UNINITIALIZED" },
      bundleSourceUrl: null
    },
    action: AppAction
  ): BundleDataState => {
    switch (action.type) {
      case "SET_BUNDLE_DATA_SOURCE":
        data.bundleSource = {
          type: "SINGLE_URL",
          bundleSourceUrl: action.sourceUrl
        };
        return data;
      case "SET_BUNDLE_DATA_MULTIPLE_SOURCES":
        data.bundleSource = {
          type: "MULTIPLE_URLS",
          prUrl: action.prBundleUrl,
          baselineUrl: action.baselineBundleUrl
        };
        return data;
      case "SET_BUNDLE_DATA_BLOBS":
        data.bundleSource = {
          type: "MULTIPLE_BLOBS",
          prBlob: action.prBlob,
          baselineBlob: action.baselineBlob
        };
      case "MARK_BUNDLE_DATA_ERROR":
        data.initializationState = {
          type: "INITIALIZATION_FAILURE",
          errorMessage: action.errorMessage
        };
        return data;
      case "MARK_BUNDLE_DATA_INITIALIZED":
        data.initializationState = { type: "INITIALIZED" };
        return data;
      default:
        return data;
    }
  }
);
