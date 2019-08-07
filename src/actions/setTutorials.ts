import { SetTutorialsAction, Tutorial } from "../reducers/schema";
import { dispatch } from "../store";

export const setTutorials = (newTutorials: Tutorial[]): SetTutorialsAction =>
  dispatch({
    type: "SET_TUTORIALS",
    newTutorials
  });
