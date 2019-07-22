import { combineReducers } from "redux";
import { bundleDataReducer } from "./bundleDataReducer";
import { queryReducer } from "./queryReducer";
import { RootStore, AppAction } from "./schema";
import { graphOptionsReducer } from "./graphOptionsReducer";
import { appUIReducer } from "./appUIReducer";

export const rootReducer = combineReducers<RootStore, AppAction>({
  bundleData: bundleDataReducer,
  query: queryReducer,
  graphOptions: graphOptionsReducer,
  appUIState: appUIReducer
});
