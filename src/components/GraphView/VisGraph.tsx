import * as React from "react";
import "./VisGraph.css";
import * as vis from "vis";
import { useSelector } from "react-redux";
import { RootStore } from "../../reducers/schema";
import classNames from "classnames";
import useToggle from "../../hooks/useToggle";
import ToggleArrow from "../ToggleArrow/ToggleArrow";

const VisGraphLoadBar = ({ percent }: { percent: number }) => {
  return (
    <section className="VisGraph-loader">
      Stabilizing..
      <section className="VisGraph-loader-bar-wrapper">
        <span
          className="VisGraph-loader-bar"
          style={{ width: `${percent}%` }}
        />
      </section>
    </section>
  );
};
export const VisGraph = ({ graphData }: { graphData: vis.Data | null }) => {
  const containerRef = React.useRef<HTMLElement | null>(null);
  const configContainerRef = React.useRef<HTMLElement | null>(null);
  const { isHierarchical, shouldStabilize } = useSelector(
    (store: RootStore) => store.graphOptions
  );
  const [loadingPercent, setLoadingPercent] = React.useState(0);
  const [isLoaded, setIsLoaded] = React.useState(!shouldStabilize);
  const [isConfigOpen, setIsConfigOpen] = useToggle(false);

  React.useEffect(() => {
    if (graphData == null || containerRef.current == null) {
      return;
    }

    const numNodesAndEdges =
      ((graphData.nodes && graphData.nodes.length) || 0) +
      ((graphData.edges && graphData.edges.length) || 0);
    const updateInterval = Math.min(50, Math.ceil(500 / numNodesAndEdges));
    console.log("Stabilization updateInterval", updateInterval);

    const options = {
      configure: {
        enabled: true,
        showButton: true,
        container: configContainerRef.current
      },
      physics: {
        stabilization: {
          enabled: shouldStabilize,
          updateInterval
        }
      },
      layout: {
        randomSeed: 191006,
        improvedLayout: false,
        hierarchical: {
          enabled: isHierarchical,
          sortMethod: "directed"
        }
      },
      nodes: {
        shape: "diamond"
      },
      edges: {
        arrows: "to"
      }
    };
    console.log("mount vis network", containerRef.current, options);
    console.log("nodes:", graphData.nodes && graphData.nodes.length);
    console.log("edges:", graphData.edges && graphData.edges.length);

    const network = new vis.Network(containerRef.current, graphData, options);

    if (shouldStabilize) {
      setIsLoaded(false);
      network.on("stabilizationProgress", params => {
        const percent = (params.iterations / params.total) * 100;
        setLoadingPercent(percent);
      });
      network.on("stabilizationIterationsDone", () => {
        setIsLoaded(true);
      });
    }

    return () => {
      network.destroy();
    };
  }, [graphData, isHierarchical, containerRef, shouldStabilize]);

  return (
    <>
      <section className="VisGraph-vis-graph" ref={containerRef} />
      <button className="VisGraph-config-toggle" onClick={setIsConfigOpen}>
        graph config
        <ToggleArrow isClosed={!isConfigOpen} />
      </button>
      <section
        className={classNames("VisGraph-config-container", {
          "VisGraph-open": isConfigOpen
        })}
        ref={configContainerRef}
      />
      {isLoaded || !shouldStabilize ? null : (
        <VisGraphLoadBar percent={loadingPercent} />
      )}
    </>
  );
};

export default VisGraph;
