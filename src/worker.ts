import {
  AppToWorkerMessage,
  InitStoreResponseMessage,
  PerformQueryResponseMessage,
  PerformQueryResponseErrorMessage,
  InitStoreResponseErrorMessage,
} from "./worker/messages";
import { QueryExecutor } from "./worker/QueryExecutor";
import { buildGraphVisualization } from "./worker/buildGraphVisualization";
import { Query } from "./utils/Query";
import { getBundleSizeSummary } from "./worker/getBundleSizeSummary";
import { BothBundleStats } from "./reducers/schema";
import { getModuleGraphWithChildren } from "webpack-bundle-diff-add-children";

// eslint-disable-next-line no-restricted-globals
const ctx: Worker = self as any;

const queryExecutor: QueryExecutor = new QueryExecutor();

let pendingInitialQuery: Query | null = null;
let isInitialized: boolean = false;

const performQuery = (query: Query) => {
  try {
    const resultGraph = queryExecutor.filter(query);
    const resultVisualizationData = buildGraphVisualization(
      resultGraph,
      queryExecutor.getData(),
    );
    const response: PerformQueryResponseMessage = {
      type: "QUERY_RESULT",
      forQuery: query,
      result: resultVisualizationData,
      summary: getBundleSizeSummary(resultGraph),
    };
    return response;
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.stack);
    } else {
      console.error("query gave non-Error error:", e);
    }
    const response: PerformQueryResponseErrorMessage = {
      type: "QUERY_ERROR",
      forQuery: query,
      errorMessage: `${e}`,
    };
    return response;
  }
};

ctx.onmessage = function (e: MessageEvent): void {
  const messageData = e.data as AppToWorkerMessage;
  console.log("Worker: Message received from app script", messageData);
  switch (messageData.type) {
    case "INIT_STORE_FROM_BUNDLE_STATS_STRINGS":
      try {
        const stats: BothBundleStats = {
          baselineGraph: getModuleGraphWithChildren(
            JSON.parse(messageData.baselineString).bundleData.graph,
          ),
          pullRequestGraph: getModuleGraphWithChildren(
            JSON.parse(messageData.prString).bundleData.graph,
          ),
        };

        queryExecutor.setData(stats);
        isInitialized = true;
        const message: InitStoreResponseMessage = {
          type: "STORE_LOADED",
        };
        ctx.postMessage(message);
      } catch (e) {
        const message: InitStoreResponseErrorMessage = {
          type: "STORE_LOAD_ERROR",
          errorMessage: `${e}`,
        };
        ctx.postMessage(message);
        console.error(e);
      }
      break;
    case "INIT_STORE_FROM_URL":
      fetch(messageData.payloadUrl)
        .then((r) => r.json())
        .then((response) => {
          console.log("got data", response);
          queryExecutor.setData(response);
          isInitialized = true;
          const message: InitStoreResponseMessage = {
            type: "STORE_LOADED",
          };
          ctx.postMessage(message);

          // Run query if we have a pending one
          if (pendingInitialQuery !== null) {
            ctx.postMessage(performQuery(pendingInitialQuery));
          }
        })
        .catch((e) => {
          const message: InitStoreResponseErrorMessage = {
            type: "STORE_LOAD_ERROR",
            errorMessage: `${e}`,
          };
          ctx.postMessage(message);
          console.error(e);
        });
      break;
    case "QUERY_REQUEST":
      if (!isInitialized) {
        pendingInitialQuery = messageData.query;
      } else {
        ctx.postMessage(performQuery(messageData.query));
      }
      break;
  }
};

export default {} as any;
