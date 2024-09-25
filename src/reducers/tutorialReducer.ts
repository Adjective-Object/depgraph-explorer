import { Tutorial, AppAction } from "./schema";
import { produce } from "immer";
import { withDefault } from "./util/withDefault";

export const tutorialReducer = withDefault(
  produce((data: Tutorial[], action: AppAction): Tutorial[] => {
    switch (action.type) {
      case "SET_TUTORIALS":
        return action.newTutorials;
      default:
        return data;
    }
  }),
  [],
);
