import { store } from "../store";
import { RootStore } from "../reducers/schema";

const getQueryParams = (store: RootStore): URLSearchParams => {
  const params: URLSearchParams = new URLSearchParams();
  if (!store.appUIState.isLeftSidebarOpen) {
    params.set("lc", "");
  }
  if (!store.appUIState.isRightSidebarOpen) {
    params.set("rc", "");
  }
  params.set("q", store.query.currentFilterText);
  if (store.graphOptions.isHierarchical) {
    params.set("hi", "");
  }
  if (store.graphOptions.shouldStabilize) {
    params.set("stab", "");
  }
  if (store.bundleData.bundleSource) {
    const source = store.bundleData.bundleSource;
    switch (source.type) {
      case "SINGLE_URL":
        params.set("bundle", source.bundleSourceUrl);
        break;
      case "MULTIPLE_URLS":
        params.set("pr_bundle", source.prUrl);
        params.set("base_bundle", source.baselineUrl);
        break;
      case "MULTIPLE_BLOBS":
    }
  }
  params.sort();
  return params;
};

/**
 * Post the message, debounced.
 */

let lastQueryParams: URLSearchParams = new URLSearchParams(
  window.location.search
);
lastQueryParams.sort();
store.subscribe(() => {
  const currentParams = getQueryParams(store.getState());
  if (currentParams.toString() !== lastQueryParams.toString()) {
    lastQueryParams = currentParams;
    const newLocation =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "?" +
      currentParams
        .toString()
        .replace(/=&/g, "&")
        .replace(/=$/g, "");
    window.history.pushState(null, document.title, newLocation);
  }
});
