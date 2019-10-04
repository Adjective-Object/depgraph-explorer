import { Data as VisData } from "vis";
import { Query } from "../utils/Query";
import { BundleSizeSummary, BothBundleStats } from "../reducers/schema";

export interface InitStoreFromUrlRequestMessage {
  type: "INIT_STORE_FROM_URL";
  payloadUrl: string;
}

export interface InitStoreFromMultiUrlRequestMessage {
  type: "INIT_STORE_FROM_MULTI_URL";
  prUrl: string;
  baselineUrl: string;
}

export interface InitStoreFromBundleRequestMessage {
  type: "INIT_STORE_FROM_BUNDLE_STATS_STRINGS";
  baselineString: string;
  prString: string;
}

export interface PerformQueryRequestMessage {
  type: "QUERY_REQUEST";
  query: Query;
}

export interface InitStoreResponseMessage {
  type: "STORE_LOADED";
}

export interface InitStoreResponseErrorMessage {
  type: "STORE_LOAD_ERROR";
  errorMessage: string;
}

export interface PerformQueryResponseMessage {
  type: "QUERY_RESULT";
  forQuery: Query;
  result: VisData;
  summary: BundleSizeSummary;
}

export interface PerformQueryResponseErrorMessage {
  type: "QUERY_ERROR";
  forQuery: Query;
  errorMessage: string;
}

export type AppToWorkerMessage =
  | InitStoreFromUrlRequestMessage
  | InitStoreFromBundleRequestMessage
  | PerformQueryRequestMessage;

export type WorkerToAppMessage =
  | InitStoreResponseMessage
  | InitStoreResponseErrorMessage
  | PerformQueryResponseMessage
  | PerformQueryResponseErrorMessage;
