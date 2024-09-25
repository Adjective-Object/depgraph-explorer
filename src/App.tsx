import React from "react";
import QueryEditor from "./components/QueryEditor/QueryEditor";
import GraphView from "./components/GraphView/GraphView";
import QuerySidebar from "./components/QueryEditor/QuerySidebar";
import QueryExamples from "./components/QueryEditor/QueryExamples";
import QueryTutorial from "./components/QueryEditor/QueryTutorial";
import GraphOptionsEditor from "./components/GraphOptionsEditor/GraphOptionsEditor";
import BundleSizeSummaryTable from "./components/GraphView/BundleSizeSummaryTable";
import ToggleArrow from "./components/ToggleArrow/ToggleArrow";
import BundleLoaderView from "./components/BundleLoaderView/BundleLoaderView";
import "./App.css";
import { useSelector } from "react-redux";
import { RootStore } from "./reducers/schema";
import { setAppUIState } from "./actions/setAppUIState";

const App: React.FC = () => {
  const { isLeftOpen, isRightOpen, hasBundleSource } = useSelector(
    (store: RootStore) => ({
      isLeftOpen: store.appUIState.isLeftSidebarOpen,
      isRightOpen: store.appUIState.isRightSidebarOpen,
      hasBundleSource:
        store.bundleData.initializationState.type !== "UNINITIALIZED",
    }),
  );
  const toggleLeftSidebar = React.useCallback(() => {
    setAppUIState({
      isLeftSidebarOpen: !isLeftOpen,
    });
  }, [isLeftOpen]);
  const toggleRightSidebar = React.useCallback(() => {
    setAppUIState({
      isRightSidebarOpen: !isRightOpen,
    });
  }, [isRightOpen]);

  return (
    <div className="App">
      <header className="App-header">
        <ToggleArrow
          className="App-toggle"
          isClosed={isLeftOpen}
          onClick={toggleLeftSidebar}
        />
        <h1>Bundle Size Explorer</h1>
        <ToggleArrow
          className="App-toggle"
          isClosed={isRightOpen}
          onClick={toggleRightSidebar}
        />
      </header>
      <section className="App-body">
        {hasBundleSource ? (
          <>
            {isLeftOpen && <BundleSizeSummaryTable />}
            <GraphView />
            {isRightOpen && (
              <QuerySidebar>
                <QueryEditor />
                <GraphOptionsEditor />
                <QueryExamples />
                <QueryTutorial />
              </QuerySidebar>
            )}
          </>
        ) : (
          <BundleLoaderView />
        )}
      </section>
    </div>
  );
};

export default App;
