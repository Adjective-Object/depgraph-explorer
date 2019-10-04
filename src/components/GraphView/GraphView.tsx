import * as React from "react";
import { useSelector } from "react-redux";
import { RootStore, InitializedBundleDataState } from "../../reducers/schema";
import "./GraphView.css";
import { isQueryError, isQuerySuccess } from "../../utils/isQueryResultError";
import VisGraph from "./VisGraph";

const PendingInitialLoad = () => (
  <section className="GraphView-initial-load">
    Fetching and parsing bundle data..
  </section>
);

const InitialLoadFailed = ({
  bundleData,
  errorMessage
}: {
  bundleData: InitializedBundleDataState;
  errorMessage: string;
}) => {
  let errVis = (() => {
    const bundleSource = bundleData.bundleSource;
    switch (bundleSource.type) {
      case "SINGLE_URL":
        return (
          <p>
            Url: <code>"{bundleSource.bundleSourceUrl}"</code>
          </p>
        );
      case "MULTIPLE_URLS":
        return (
          <p>
            Bundle url: <code>"{bundleSource.baselineUrl}"</code> <br></br>
            PR url: <code>"{bundleSource.prUrl}"</code>
          </p>
        );
      case "MULTIPLE_BLOBS":
        return <p>Local blobs.</p>;
    }
  })();
  return (
    <section className="GraphView-error">
      <h2>Error Loading bundle</h2>
      {errVis}
      <pre>{errorMessage}</pre>
    </section>
  );
};

const GraphViewPending = () => (
  <section className="GraphView-pending">Running Query..</section>
);

const GraphViewEmpty = () => (
  <section className="GraphView-empty">No Results</section>
);

const QueryErrorMessage = ({ message }: { message: string }) => (
  <section className="GraphView-error">
    <h2>Error while running query</h2>
    <pre>{message}</pre>
  </section>
);

const GraphViewTooLarge = ({
  limit,
  size,
  showAnywayCallback
}: {
  limit: number;
  size: number;
  showAnywayCallback: () => void;
}) => (
  <section className="Graphview-over-limit">
    <p>
      {size} nodes is greater than default maximum of {limit} nodes.
    </p>
    <button
      className="Graphview-show-anyway-button"
      onClick={showAnywayCallback}
    >
      Show Anyway
    </button>
  </section>
);

const STATIC_LIMIT = 1000;

const GraphView = () => {
  const { bundleData, isPending, numNodes, queryResult } = useSelector(
    (store: RootStore) => ({
      bundleData: store.bundleData,
      isPending:
        store.query.queryResult === null &&
        store.query.lastSucessfulCompilation !== null,
      numNodes: Number(
        isQuerySuccess(store.query.queryResult) &&
          store.query.queryResult.data.nodes &&
          store.query.queryResult.data.nodes.length
      ),
      queryResult: store.query.queryResult
    })
  );

  const [showAnyway, setShowAnyway] = React.useState(false);
  const onShowAnyway = React.useCallback(() => {
    setShowAnyway(true);
  }, []);
  React.useEffect(() => {
    if (showAnyway && isPending) {
      setShowAnyway(false);
    }
  }, [showAnyway, isPending]);

  return (
    <section className="GraphView-host">
      {bundleData.initializationState.type === "UNINITIALIZED" ? (
        <PendingInitialLoad />
      ) : bundleData.initializationState.type === "INITIALIZATION_FAILURE" ? (
        <InitialLoadFailed
          bundleData={bundleData as InitializedBundleDataState}
          errorMessage={bundleData.initializationState.errorMessage}
        />
      ) : isPending || queryResult == null ? (
        <GraphViewPending />
      ) : !showAnyway && numNodes > STATIC_LIMIT ? (
        <GraphViewTooLarge
          limit={STATIC_LIMIT}
          size={numNodes}
          showAnywayCallback={onShowAnyway}
        />
      ) : isQueryError(queryResult) ? (
        <QueryErrorMessage message={queryResult.errorMessage} />
      ) : numNodes === 0 ? (
        <GraphViewEmpty />
      ) : (
        <VisGraph graphData={queryResult.data} />
      )}
    </section>
  );
};

export default GraphView;
