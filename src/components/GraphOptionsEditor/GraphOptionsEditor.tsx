import * as React from "react";
import "./GraphOptionsEditor.css";
import { useSelector } from "react-redux";
import { RootStore } from "../../reducers/schema";
import { setGraphOptions } from "../../actions/setGraphOptions";

const GraphOptionsEditor = () => {
  const { isHierarchical, shouldStabilize } = useSelector(
    (store: RootStore) => store.graphOptions
  );
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
    </section>
  );
};

export default GraphOptionsEditor;
