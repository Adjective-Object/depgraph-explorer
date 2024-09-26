import { BundleDataState, AppAction } from "./schema";
import { produce } from "immer";
import { withDefault } from "./util/withDefault";
export const bundleDataReducer = withDefault(
  produce((data: BundleDataState, action: AppAction): BundleDataState => {
    switch (action.type) {
      case "SET_BUNDLE_DATA_SOURCE":
        data.bundleSource = {
          type: "SINGLE_URL",
          bundleSourceUrl: action.sourceUrl,
        };
        data.initializationState = {
          type: "INITIALIZING",
        };
        return data;
      case "SET_BUNDLE_DATA_MULTIPLE_SOURCES":
        data.bundleSource = {
          type: "MULTIPLE_URLS",
          prUrl: action.prBundleUrl,
          baselineUrl: action.baselineBundleUrl,
        };
        data.initializationState = {
          type: "INITIALIZING",
        };
        return data;
      case "SET_BUNDLE_DATA_BLOBS":
        data.bundleSource = {
          type: "MULTIPLE_BLOBS",
          prBlob: action.prBlob,
          baselineBlob: action.baselineBlob,
        };
        data.initializationState = {
          type: "INITIALIZING",
        };
        return data;
      case "SET_BUNDLE_DATA_BLOB":
        data.bundleSource = {
          type: "SINGLE_BLOB",
          blob: action.blob,
        };
        data.initializationState = {
          type: "INITIALIZING",
        };
        return data;
      case "MARK_BUNDLE_DATA_ERROR":
        data.initializationState = {
          type: "INITIALIZATION_FAILURE",
          errorMessage: action.errorMessage,
        };
        return data;
      case "MARK_BUNDLE_DATA_INITIALIZED":
        data.initializationState = { type: "INITIALIZED" };
        return data;
      default:
        return data;
    }
  }),
  {
    initializationState: { type: "UNINITIALIZED" },
    bundleSource: null,
  },
);
