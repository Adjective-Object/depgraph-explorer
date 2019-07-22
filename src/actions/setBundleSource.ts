import { SetBundleDataSourceAction } from "../reducers/schema";
import { dispatch } from "../store";

export const setBundleSource = (sourceUrl: string): SetBundleDataSourceAction =>
  dispatch({
    type: "SET_BUNDLE_DATA_SOURCE",
    sourceUrl
  });
