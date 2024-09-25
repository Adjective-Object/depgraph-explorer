import { AppAction, GraphViewOptions } from "./schema";
import { produce } from "immer";
import { withDefault } from "./util/withDefault";

export const graphOptionsReducer = withDefault(
  produce((store: GraphViewOptions, action: AppAction): GraphViewOptions => {
    switch (action.type) {
      case "SET_GRAPH_OPTIONS":
        return { ...store, ...action.options };
      default:
        return store;
    }
  }),
  {
    isHierarchical: false,
    shouldStabilize: false,
    shouldShowReasonEdges: false,
  },
);
