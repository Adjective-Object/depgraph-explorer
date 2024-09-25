import * as React from "react";
import { createRoot } from "react-dom/client";

import { Provider } from "react-redux";
import { store } from "./store";

import App from "./App";
import {
  InitStoreFromUrlRequestMessage,
  WorkerToAppMessage,
  InitStoreFromMultiUrlRequestMessage
} from "./worker/messages";
import { markBundleDataInitialized } from "./actions/markBundleDataInitialized";
import { setQueryResult } from "./actions/setQueryResult";
import { setFilterText } from "./actions/setFilterText";
import AppWorker from "./worker?worker";
import { setQueryError } from "./actions/setQueryError";
import { setGraphOptions } from "./actions/setGraphOptions";
import { setAppUIState } from "./actions/setAppUIState";

import "./observer/postToWorkerDebouncedOnQueryChange";
import "./observer/setQueryParametersOnStateChange";
import "./observer/loadBundleOnSourceSet";

import { setBundleSource } from "./actions/setBundleSource";
import { setTutorials } from "./actions/setTutorials";
import { markBundleDataLoadError } from "./actions/markBundleDataLoadError";
import { defaultTutorials } from "./defaultTutorials";
import { setBundleMultipleSources } from "./actions/setBundleMultipleSources";

//////////////////////
// Spawn the worker //
//////////////////////
export const appWorker = new AppWorker();
appWorker.onmessage = function (e: MessageEvent): void {
  const messageData = e.data as WorkerToAppMessage;
  console.log("App: Message received from worker script", messageData);
  switch (messageData.type) {
    case "STORE_LOADED":
      markBundleDataInitialized();
      // handle load / compilation message race
      const compResult = store.getState().query.compilationResult;
      if (compResult && compResult.type === "CompilationSuccess") {
        appWorker.postMessage({
          type: "QUERY_REQUEST",
          query: compResult.query
        });
      }
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

// Init bundle data form URL params
const bundleDataSingleUrl: string | null = urlParams.get("bundle");
const bundleDataPrUrl: string | null = urlParams.get("pr_bundle");
const bundleDataBaselineUrl: string | null = urlParams.get("baseline_bundle");

if (bundleDataSingleUrl) {
  setBundleSource(bundleDataSingleUrl);
  const initStoreMessage: InitStoreFromUrlRequestMessage = {
    type: "INIT_STORE_FROM_URL",
    payloadUrl: bundleDataSingleUrl
  };
  appWorker.postMessage(initStoreMessage);
} else if (bundleDataPrUrl && bundleDataBaselineUrl) {
  setBundleMultipleSources(bundleDataPrUrl, bundleDataBaselineUrl);
  const initStoreMessage: InitStoreFromMultiUrlRequestMessage = {
    type: "INIT_STORE_FROM_MULTI_URL",
    prUrl: bundleDataPrUrl,
    baselineUrl: bundleDataBaselineUrl
  };
  appWorker.postMessage(initStoreMessage);
}

// fetch the tutorial
fetch("./tutorial_examples.json")
  .then(r => r.json())
  .then(tutorials => setTutorials(tutorials))
  .catch(e => setTutorials(defaultTutorials));

///////////////////
// Mount the app //
///////////////////
const rootContainer = createRoot(document.getElementById("root")!);
rootContainer.render(<Provider store={store} >
  <App />
</Provider >,
);
