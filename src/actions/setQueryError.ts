import { SetQueryErrorAction } from "../reducers/schema";
import { dispatch } from "../store";
import { Query } from "../utils/Query";

export const setQueryError = (
  forQuery: Query,
  errorMessage: string,
): SetQueryErrorAction =>
  dispatch({
    type: "SET_QUERY_ERROR",
    forQuery,
    errorMessage,
  });
