import { ModuleGraphWithChildren } from "webpack-bundle-diff-add-children";
import {
  CompilationResult,
  CompilationSuccess
} from "../grammar/compilationTypes";
import { Query } from "../utils/Query";
import * as Vis from "vis";

export interface BothBundleStats {
  baselineGraph: ModuleGraphWithChildren;
  pullRequestGraph: ModuleGraphWithChildren;
}

export interface InitializedBundleDataState {
  initializationState:
    | { type: "INITIALIZING" }
    | { type: "INITIALIZED" }
    | { type: "INITIALIZATION_FAILURE"; errorMessage: string };
  bundleSource:
    | {
        type: "SINGLE_URL";
        bundleSourceUrl: string;
      }
    | { type: "MULTIPLE_BLOBS"; prBlob: string; baselineBlob: string }
    | { type: "MULTIPLE_URLS"; prUrl: string; baselineUrl: string };
}
export interface UninitializedBundleDataState {
  initializationState: { type: "UNINITIALIZED" };
  bundleSource: null;
}

export type BundleDataState =
  | InitializedBundleDataState
  | UninitializedBundleDataState;

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
  data: GeneratedGraphData;
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
  resultingGraph: GeneratedGraphData;
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
export type SetBundleDataMultipleSourcesAction = {
  type: "SET_BUNDLE_DATA_MULTIPLE_SOURCES";
  baselineBundleUrl: string;
  prBundleUrl: string;
};
export type SetBundleDataBlobsAction = {
  type: "SET_BUNDLE_DATA_BLOBS";
  baselineBlob: string;
  prBlob: string;
};
export type BundleDataAction =
  | MarkBundleDataInitializedAction
  | MarkBundleDataLoadErrorAction
  | SetBundleDataSourceAction
  | SetBundleDataMultipleSourcesAction
  | SetBundleDataBlobsAction;

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
  shouldShowReasonEdges: boolean;
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

export interface GeneratedGraphData {
  nodes: Vis.Node[];
  reasonChildrenEdges: Vis.Edge[];
  dependencyEdges: Vis.Edge[];
}
