import { SetFilterTextAction } from "../reducers/schema";
import { dispatch } from "../store";

export const setFilterText = (newFilter: string): SetFilterTextAction =>
  dispatch({
    type: "SET_FILTER_TEXT",
    newFilter
  });
