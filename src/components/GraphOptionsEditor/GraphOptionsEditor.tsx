import * as React from "react";
import "./GraphOptionsEditor.css";
import { useSelector } from "react-redux";
import { RootStore } from "../../reducers/schema";
import { setGraphOptions } from "../../actions/setGraphOptions";

const GraphOptionsEditor = () => {
  const {
    isHierarchical,
    shouldStabilize,
    shouldShowReasonEdges
  } = useSelector((store: RootStore) => store.graphOptions);
  const setIsHierarchicalFromCheckbox = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setGraphOptions({
        isHierarchical: !!e.currentTarget.checked
      });
    },
    []
  );
  const setShouldStabilizeFromCheckbox = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setGraphOptions({
        shouldStabilize: !!e.currentTarget.checked
      });
    },
    []
  );
  const setShouldShowReasonEdgesFromCheckbox = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setGraphOptions({
        shouldShowReasonEdges: !!e.currentTarget.checked
      });
    },
    []
  );

  return (
    <section className="GraphViewOptions-wrapper">
      <h2>Options:</h2>
      <label className="GraphViewOptions-label">
        <input
          type="checkbox"
          name="isHierarchical"
          onChange={setIsHierarchicalFromCheckbox}
          checked={isHierarchical}
        />
        Force Hierarchical Nodes (better for small graphs)
      </label>
      <label className="GraphViewOptions-label">
        <input
          type="checkbox"
          name="shouldStabilize"
          onChange={setShouldStabilizeFromCheckbox}
          checked={shouldStabilize}
        />
        pre-stabilize the network
      </label>
      <label className="GraphViewOptions-label">
        <input
          type="checkbox"
          name="shouldShowReasonEdges"
          onChange={setShouldShowReasonEdgesFromCheckbox}
          checked={shouldShowReasonEdges}
        />
        <p>
          show reason edges (instead of module parentage). <br />
          This visualzies actual import dependencies instead of hoisted
          dependencies. <br />
          <b>
            This will not work unless you build this into your bundlestats.json
            ahead of time. see{" "}
            <a href="https://github.com/Adjective-Object/webpack-bundle-diff-add-reasons">
              webpack-bundle-diff-add-reasons
            </a>
          </b>
        </p>
      </label>
    </section>
  );
};

export default GraphOptionsEditor;
