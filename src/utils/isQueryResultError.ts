import { QuerySuccess, QueryError } from "../reducers/schema";

export const isQueryError = (
  r: QuerySuccess | QueryError | null,
): r is QueryError => !!r && r.type === "QUERY_ERROR";

export const isQuerySuccess = (
  r: QuerySuccess | QueryError | null,
): r is QuerySuccess => !!r && r.type === "QUERY_SUCCESS";
