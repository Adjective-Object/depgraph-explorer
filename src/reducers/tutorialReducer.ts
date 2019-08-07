import { Tutorial, AppAction } from "./schema";
import { produce } from "immer";

export const tutorialReducer = produce(
  (data: Tutorial[] = [], action: AppAction): Tutorial[] => {
    switch (action.type) {
      case "SET_TUTORIALS":
        return action.newTutorials;
      default:
        return data;
    }
  }
);
