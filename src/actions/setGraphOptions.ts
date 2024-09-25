import { GraphViewOptions, SetGraphOptionsAction } from "../reducers/schema";
import { dispatch } from "../store";

export const setGraphOptions = (
  options: Partial<GraphViewOptions>,
): SetGraphOptionsAction =>
  dispatch({
    type: "SET_GRAPH_OPTIONS",
    options,
  });
