import { AppAction, AppUIState } from "./schema";
import { produce } from "immer";
import { withDefault } from "./util/withDefault";

export const appUIReducer = withDefault(
  produce((store: AppUIState, action: AppAction): AppUIState => {
    switch (action.type) {
      case "SET_APP_UI":
        return { ...store, ...action.options };
      default:
        return store;
    }
  }),
  {
    isLeftSidebarOpen: false,
    isRightSidebarOpen: false,
  },
);
