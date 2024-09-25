import { QueryState, AppAction } from "./schema";
import { produce } from "immer";
import { isCompilationError } from "../grammar/isCompilationError";
import { parseFilterStringToQuery } from "../grammar/grammar";
import { withDefault } from "./util/withDefault";

export const queryReducer = withDefault(produce(
  (
    data: QueryState,
    action: AppAction
  ): QueryState => {
    switch (action.type) {
      case "SET_FILTER_TEXT":
        data.currentFilterText = action.newFilter;
        data.compilationResult = parseFilterStringToQuery(action.newFilter);
        console.log(data.compilationResult);
        if (
          // Only commit update if the actual result is different deeply
          !isCompilationError(data.compilationResult) &&
          JSON.stringify(data.compilationResult) !==
          JSON.stringify(data.lastSucessfulCompilation)
        ) {
          console.log("updating last sucessful compilation");
          data.lastSucessfulCompilation = data.compilationResult;
          data.queryResult = null;
        }
        break;
      case "SET_QUERY_RESULT":
        if (
          data.lastSucessfulCompilation !== null &&
          JSON.stringify(action.forQuery) !==
          JSON.stringify(data.lastSucessfulCompilation.query)
        ) {
          console.log(
            "ignoring query result because the last sucessful compilation does not match the query's target"
          );
          return data;
        }
        data.queryResult = {
          type: "QUERY_SUCCESS",
          data: action.resultingGraph,
          summary: action.summary
        };
        break;
      case "SET_QUERY_ERROR":
        if (
          data.lastSucessfulCompilation !== null &&
          JSON.stringify(action.forQuery) ===
          JSON.stringify(data.lastSucessfulCompilation.query)
        ) {
          data.queryResult = {
            type: "QUERY_ERROR",
            errorMessage: action.errorMessage
          };
        }
        break;
      default:
        return data;
    }
    return data;
  }
), {
  currentFilterText: "",
  compilationResult: null,
  lastSucessfulCompilation: null,
  queryResult: null
});
