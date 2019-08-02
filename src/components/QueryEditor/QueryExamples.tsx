import * as React from "react";
import "./QueryExamples.css";
import { setFilterText } from "../../actions/setFilterText";
import useToggle from "../../hooks/useToggle";
import ToggleArrow from "../ToggleArrow/ToggleArrow";

// TODO get from the query string
const tutorialExamples = [
  { exampleName: "Added Files", exampleBody: "added" },
  { exampleName: "Removed Files", exampleBody: "removed" },
  { exampleName: "Changed Files", exampleBody: "changed" },
  { exampleName: "Package 1", exampleBody: "'package1/lib'" },
  {
    exampleName: "Package 1 and Package 2",
    exampleBody: "'package1/lib'\n  | 'package2/lib' "
  },
  {
    exampleName: "Json files in package 1",
    exampleBody: "'package1/*json'\n "
  },
  {
    exampleName: "package1 files that include the current changes",
    exampleBody: "includes changed & 'package1'"
  },
  {
    exampleName: "packages indexes included by Package 1",
    exampleBody: "(included_by '*package1*') & '*lib/lazyIndex*'!"
  },
  {
    exampleName: "packages included by reading pane, tracing dependenices",
    exampleBody:
      "interpolate( (included_by '*package1*') & '*lib/lazyIndex*'! )"
  }
];

const QueryExamplesExample = ({
  exampleName,
  exampleBody
}: {
  exampleName: string;
  exampleBody: string;
}) => {
  const setFilterTextCallback = React.useCallback(() => {
    setFilterText(exampleBody);
  }, [exampleBody]);

  return (
    <li className="QueryExamples-example" onClick={setFilterTextCallback}>
      {exampleName}
      {/* <td>{exampleBody}</td> */}
    </li>
  );
};

const QueryExamplesInner = () => {
  return (
    <>
      <p className="QueryExamples-helptext">
        Click an example to load it in the editor.
      </p>
      {tutorialExamples.map(example => (
        <QueryExamplesExample {...example} key={example.exampleName} />
      ))}
    </>
  );
};

const QueryExamples = () => {
  const [isClosed, toggleIsClosed] = useToggle();
  return (
    <ul className="QueryExamples-wrapper">
      <h2 className="QueryExamples-header" onClick={toggleIsClosed}>
        Examples: <ToggleArrow isClosed={isClosed} />
      </h2>
      {isClosed ? null : <QueryExamplesInner />}
    </ul>
  );
};

export default QueryExamples;
