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
        data.bundleSourceUrl = action.sourceUrl;
        return data;
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
