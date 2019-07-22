import * as React from "react";
import { useSelector } from "react-redux";
import { RootStore } from "../../reducers/schema";
import { isCompilationError } from "../../grammar/isCompilationError";
import "./QueryEditor.css";
import { setFilterText } from "../../actions/setFilterText";

const CompilationError = ({ message }: { message: string }) => (
  <aside className="CompilationError-aside">{message}</aside>
);

const QueryPermalink = () => {
  const { text } = useSelector((store: RootStore) => ({
    text: store.query.currentFilterText
  }));

  const location =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname +
    "?q=" +
    encodeURIComponent(text);

  return (
    <a className="QueryEditor-permalink" href={location}>
      permalink
    </a>
  );
};

const QueryEditor = () => {
  const { text, compilationResult } = useSelector((store: RootStore) => ({
    text: store.query.currentFilterText,
    compilationResult: store.query.compilationResult
  }));

  const writeOnChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setFilterText(e.target.value);
    },
    []
  );

  return (
    <>
      <textarea
        className="QueryEditor-body"
        value={text}
        onChange={writeOnChange}
      />
      {<QueryPermalink />}
      {isCompilationError(compilationResult) ? (
        <CompilationError message={compilationResult.message} />
      ) : null}
    </>
  );
};

export default QueryEditor;
