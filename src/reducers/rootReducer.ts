import { combineReducers } from "redux";
import { bundleDataReducer } from "./bundleDataReducer";
import { queryReducer } from "./queryReducer";
import { RootStore, AppAction } from "./schema";
import { graphOptionsReducer } from "./graphOptionsReducer";
import { appUIReducer } from "./appUIReducer";
import { tutorialReducer } from "./tutorialReducer";

export const rootReducer = combineReducers<RootStore, AppAction>({
  bundleData: bundleDataReducer,
  query: queryReducer,
  graphOptions: graphOptionsReducer,
  appUIState: appUIReducer,
  tutorials: tutorialReducer
});
