import { AppAction, GraphViewOptions } from "./schema";
import { produce } from "immer";

export const graphOptionsReducer = produce(
  (
    store: GraphViewOptions = {
      isHierarchical: false,
      shouldStabilize: false
    },
    action: AppAction
  ): GraphViewOptions => {
    switch (action.type) {
      case "SET_GRAPH_OPTIONS":
        return { ...store, ...action.options };
      default:
        return store;
    }
  }
);
