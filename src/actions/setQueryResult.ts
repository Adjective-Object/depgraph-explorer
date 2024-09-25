import {
  SetQueryResultAction,
  BundleSizeSummary,
  GeneratedGraphData,
} from "../reducers/schema";
import { dispatch } from "../store";
import { Query } from "../utils/Query";

export const setQueryResult = (
  forQuery: Query,
  resultingGraph: GeneratedGraphData,
  summary: BundleSizeSummary,
): SetQueryResultAction =>
  dispatch({
    type: "SET_QUERY_RESULT",
    forQuery,
    resultingGraph,
    summary,
  });
