import { AppAction, AppUIState } from "./schema";
import { produce } from "immer";

export const appUIReducer = produce(
  (
    store: AppUIState = {
      isLeftSidebarOpen: false,
      isRightSidebarOpen: false
    },
    action: AppAction
  ): AppUIState => {
    switch (action.type) {
      case "SET_APP_UI":
        return { ...store, ...action.options };
      default:
        return store;
    }
  }
);
