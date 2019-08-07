import * as React from "react";
import { useSelector } from 'react-redux';
import "./QueryExamples.css";
import { setFilterText } from "../../actions/setFilterText";
import useToggle from "../../hooks/useToggle";
import ToggleArrow from "../ToggleArrow/ToggleArrow";
import { RootStore } from "../../reducers/schema";

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
  const tutorials = useSelector((store: RootStore) => 
    store.tutorials
  );
  return (
    <>
      <p className="QueryExamples-helptext">
        Click an example to load it in the editor.
      </p>
      {tutorials.map(example => (
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
