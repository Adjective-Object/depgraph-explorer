import { ModuleGraphWithChildren } from "webpack-bundle-diff-add-children";
import {
  CompilationResult,
  CompilationSuccess
} from "../grammar/compilationTypes";
import { Data as VisData } from "vis";
import { Query } from "../utils/Query";

export interface BothBundleStats {
  baselineGraph: ModuleGraphWithChildren;
  pullRequestGraph: ModuleGraphWithChildren;
}

export interface BundleDataState {
  initializationState:
    | { type: "UNINITIALIZED" }
    | { type: "INITIALIZED" }
    | { type: "INITIALIZATION_FAILURE"; errorMessage: string };
  bundleSourceUrl: string | null;
}

export interface QueryError {
  type: "QUERY_ERROR";
  errorMessage: string;
}

export interface SizeSummary {
  numFilesAfter: number;
  numFilesDelta: number;
  totalBytesAfter: number;
  totalBytesDelta: number;
}

export interface BundleSizeSummary {
  packages: {
    [key: string]: SizeSummary;
  };
  total: SizeSummary;
}

export interface QuerySuccess {
  type: "QUERY_SUCCESS";
  data: VisData;
  summary: BundleSizeSummary;
}

export interface QueryState {
  currentFilterText: string;
  compilationResult: CompilationResult | null;
  lastSucessfulCompilation: CompilationSuccess | null;
  queryResult: QuerySuccess | null | QueryError;
}

export interface QueryResult {
  forQuery: string;
  resultingGraph: null;
}

export interface RootStore {
  bundleData: BundleDataState;
  query: QueryState;
  graphOptions: GraphViewOptions;
  appUIState: AppUIState;
  tutorials: Tutorial[];
}

export type SetFilterTextAction = {
  type: "SET_FILTER_TEXT";
  newFilter: string;
};

export type SetQueryResultAction = {
  type: "SET_QUERY_RESULT";
  forQuery: Query;
  resultingGraph: VisData;
  summary: BundleSizeSummary;
};

export type SetQueryErrorAction = {
  type: "SET_QUERY_ERROR";
  forQuery: Query;
  errorMessage: string;
};

export type QueryAction =
  | SetFilterTextAction
  | SetQueryResultAction
  | SetQueryErrorAction;

export type MarkBundleDataInitializedAction = {
  type: "MARK_BUNDLE_DATA_INITIALIZED";
};
export type MarkBundleDataLoadErrorAction = {
  type: "MARK_BUNDLE_DATA_ERROR";
  errorMessage: string;
};
export type SetBundleDataSourceAction = {
  type: "SET_BUNDLE_DATA_SOURCE";
  sourceUrl: string;
};
export type BundleDataAction =
  | MarkBundleDataInitializedAction
  | MarkBundleDataLoadErrorAction
  | SetBundleDataSourceAction;

export interface Tutorial {
  exampleName: string;
  exampleBody: string;
}
export interface SetTutorialsAction {
  type: "SET_TUTORIALS";
  newTutorials: Tutorial[];
}
export type TutorialAction = SetTutorialsAction;

export interface GraphViewOptions {
  isHierarchical: boolean;
  shouldStabilize: boolean;
}

/**
 * HACK this should probably be separate actions
 */
export interface SetGraphOptionsAction {
  type: "SET_GRAPH_OPTIONS";
  options: Partial<GraphViewOptions>;
}

export type GraphOptionsActions = SetGraphOptionsAction;

export interface AppUIState {
  isLeftSidebarOpen: boolean;
  isRightSidebarOpen: boolean;
}

/**
 * HACK this should probably be separate actions
 */
export interface SetAppUIStateAction {
  type: "SET_APP_UI";
  options: Partial<AppUIState>;
}

export type AppUIActions = SetAppUIStateAction;

export type AppAction =
  | BundleDataAction
  | QueryAction
  | GraphOptionsActions
  | AppUIActions
  | TutorialAction;
