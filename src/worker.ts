import {
  AppToWorkerMessage,
  InitStoreResponseMessage,
  PerformQueryResponseMessage,
  PerformQueryRequestMessage,
  PerformQueryResponseErrorMessage,
  InitStoreResponseErrorMessage
} from "./worker/messages";
import { QueryExecutor } from "./worker/QueryExecutor";
import { buildGraphVisualization } from "./worker/buildGraphVisualization";
import { Query } from "./utils/Query";
import { getBundleSizeSummary } from "./worker/getBundleSizeSummary";

// eslint-disable-next-line no-restricted-globals
const ctx: Worker = self as any;

const queryExecutor: QueryExecutor = new QueryExecutor();

let pendingInitialQuery: Query | null = null;
let isInitialized: boolean = false;

const performQuery = (query: Query) => {
  try {
    const resultGraph = queryExecutor.filter(query);
    const resultVisualizationData = buildGraphVisualization(resultGraph);
    const response: PerformQueryResponseMessage = {
      type: "QUERY_RESULT",
      forQuery: query,
      result: resultVisualizationData,
      summary: getBundleSizeSummary(resultGraph)
    };
    return response;
  } catch (e) {
    const response: PerformQueryResponseErrorMessage = {
      type: "QUERY_ERROR",
      forQuery: query,
      errorMessage: e.toString()
    };
    return response;
  }
};

ctx.onmessage = function(e: MessageEvent): void {
  const messageData = e.data as AppToWorkerMessage;
  console.log("Worker: Message received from app script", messageData);
  switch (messageData.type) {
    case "INIT_STORE":
      fetch(messageData.payloadUrl)
        .then(r => r.json())
        .then(response => {
          console.log("got data", response);
          queryExecutor.setData(response);
          isInitialized = true;
          const message: InitStoreResponseMessage = {
            type: "STORE_LOADED"
          };
          ctx.postMessage(message);

          // Run query if we have a pending one
          if (pendingInitialQuery !== null) {
            ctx.postMessage(performQuery(pendingInitialQuery));
          }
        })
        .catch(e => {
          const message: InitStoreResponseErrorMessage = {
            type: "STORE_LOAD_ERROR",
            errorMessage: e.toString()
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
