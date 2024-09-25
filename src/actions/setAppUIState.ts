import { AppUIState, SetAppUIStateAction } from "../reducers/schema";
import { dispatch } from "../store";

export const setAppUIState = (
  options: Partial<AppUIState>,
): SetAppUIStateAction =>
  dispatch({
    type: "SET_APP_UI",
    options,
  });
