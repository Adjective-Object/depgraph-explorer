import { SetQueryResultAction, BundleSizeSummary } from "../reducers/schema";
import { dispatch } from "../store";
import { Query } from "../utils/Query";
import { Data as VisData } from "vis";

export const setQueryResult = (
  forQuery: Query,
  resultingGraph: VisData,
  summary: BundleSizeSummary
): SetQueryResultAction =>
  dispatch({
    type: "SET_QUERY_RESULT",
    forQuery,
    resultingGraph,
    summary
  });
