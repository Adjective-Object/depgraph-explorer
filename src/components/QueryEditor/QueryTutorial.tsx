import * as React from "react";
import "./QueryTutorial.css";
import useToggle from "../../hooks/useToggle";
import ToggleArrow from "../ToggleArrow/ToggleArrow";

const QueryTutorialOperatorList = () => (
  <ul>
    <li className="QueryTutorial-operator">
      <span className="QueryTutorial-operator-text">"*some/filename.js"</span>
      <span className="QueryTutorial-operator-explanation">
        Select files where part of the path matches the text inside the quotes.
        Case insensitive. Use '*' for a wildcard.
      </span>
    </li>
    <li className="QueryTutorial-operator">
      <span className="QueryTutorial-operator-text">"some*File.css"!</span>
      <span className="QueryTutorial-operator-explanation">
        Case sensitive alternate of the above
      </span>
    </li>
    <li className="QueryTutorial-operator">
      <span className="QueryTutorial-operator-text">
        includes {"<subquery>"}
      </span>
      <span className="QueryTutorial-operator-explanation">
        Select all files which directly or indirectly include any target of the
        subquery
      </span>
    </li>
    <li className="QueryTutorial-operator">
      <span className="QueryTutorial-operator-text">
        included_by {"<subquery>"}
      </span>
      <span className="QueryTutorial-operator-explanation">
        Select all files which are directly or indirectly included by any target
        of the subquery
      </span>
    </li>
    <li className="QueryTutorial-operator">
      <span className="QueryTutorial-operator-text">
        {"<A>"} &amp; {"<B>"}
      </span>
      <span className="QueryTutorial-operator-explanation">
        Select all files in selected by both A and B
      </span>
    </li>
    <li className="QueryTutorial-operator">
      <span className="QueryTutorial-operator-text">
        {"<A>"} | {"<B>"}
      </span>
      <span className="QueryTutorial-operator-explanation">
        Select all files in selected by either A or B
      </span>
    </li>
    <li className="QueryTutorial-operator">
      <span className="QueryTutorial-operator-text">removed</span>
      <span className="QueryTutorial-operator-explanation">
        Selects all files removed by the change
      </span>
    </li>
    <li className="QueryTutorial-operator">
      <span className="QueryTutorial-operator-text">added</span>
      <span className="QueryTutorial-operator-explanation">
        Selects all files added by the change
      </span>
    </li>
    <li className="QueryTutorial-operator">
      <span className="QueryTutorial-operator-text">changed</span>
      <span className="QueryTutorial-operator-explanation">
        Selects all files that were added, removed, or have size differences
      </span>
    </li>
    <li className="QueryTutorial-operator">
      <span className="QueryTutorial-operator-text">
        interpolate( {"<subexpression>"} )
      </span>
      <span className="QueryTutorial-operator-explanation">
        Selects nodes that form paths between nodes in the selected set.
      </span>
    </li>
    <li className="QueryTutorial-operator">
      <span className="QueryTutorial-operator-text">
        ( {"<subexpression>"} )
      </span>
      <span className="QueryTutorial-operator-explanation">
        Selects the results as the subexpression
      </span>
    </li>
  </ul>
);

const QueryTutorial = () => {
  const [isClosed, toggleIsClosed] = useToggle();

  return (
    <section className="QueryTutorial-body">
      <h2 className="QueryTutorial-header" onClick={toggleIsClosed}>
        Operators <ToggleArrow isClosed={isClosed} />
      </h2>
      {isClosed ? null : <QueryTutorialOperatorList />}
    </section>
  );
};

export default QueryTutorial;
