import * as React from "react";
import * as ReactDOM from "react-dom";

import { Provider } from "react-redux";
import { store } from "./store";

import App from "./App";
import {
  InitStoreFromUrlRequestMessage,
  WorkerToAppMessage
} from "./worker/messages";
import { markBundleDataInitialized } from "./actions/markBundleDataInitialized";
import { setQueryResult } from "./actions/setQueryResult";
import { setFilterText } from "./actions/setFilterText";
// eslint-disable-next-line import/no-webpack-loader-syntax
import AppWorker from "worker-loader!./worker";
import { setQueryError } from "./actions/setQueryError";
import { setGraphOptions } from "./actions/setGraphOptions";
import { setAppUIState } from "./actions/setAppUIState";

import "./observer/postToWorkerDebouncedOnQueryChange";
import "./observer/setQueryParametersOnStateChange";
import { setBundleSource } from "./actions/setBundleSource";
import { setTutorials } from "./actions/setTutorials";
import { markBundleDataLoadError } from "./actions/markBundleDataLoadError";
import { defaultTutorials } from "./defaultTutorials";

//////////////////////
// Spawn the worker //
//////////////////////
export const appWorker = new AppWorker();
appWorker.onmessage = function(e: MessageEvent): void {
  const messageData = e.data as WorkerToAppMessage;
  console.log("App: Message received from worker script", messageData);
  switch (messageData.type) {
    case "STORE_LOADED":
      markBundleDataInitialized();
      break;
    case "STORE_LOAD_ERROR":
      markBundleDataLoadError(messageData.errorMessage);
      break;
    case "QUERY_RESULT":
      setQueryResult(
        messageData.forQuery,
        messageData.result,
        messageData.summary
      );
      break;
    case "QUERY_ERROR":
      setQueryError(messageData.forQuery, messageData.errorMessage);
      break;
  }
};

//////////////////////////////////
// Initialize state from params //
//////////////////////////////////

const urlParams = new URLSearchParams(window.location.search);
const initialQueryString = urlParams.get("q") || "changed";
if (initialQueryString) {
  setFilterText(initialQueryString);
}
setGraphOptions({
  isHierarchical: !!urlParams.has("hi"),
  shouldStabilize: !!urlParams.has("stab")
});
setAppUIState({
  isLeftSidebarOpen: !(urlParams.has("lc") || window.innerWidth < 1000),
  isRightSidebarOpen: !urlParams.has("rc")
});
const bundleDataSource: string = urlParams.get("bundle") || "./stats.json";
const initStoreMessage: InitStoreFromUrlRequestMessage = {
  type: "INIT_STORE_FROM_URL",
  payloadUrl: bundleDataSource
};
setBundleSource(bundleDataSource);
appWorker.postMessage(initStoreMessage);
// fetch the tutorial
fetch("./tutorial_examples.json")
  .then(r => r.json())
  .then(tutorials => setTutorials(tutorials))
  .catch(e => setTutorials(defaultTutorials));

///////////////////
// Mount the app //
///////////////////

const rootElement = document.getElementById("root");
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
