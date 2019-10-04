import * as React from "react";
import "./BundleLoaderView.css";
import { useSelector } from "react-redux";
import { RootStore } from "../../reducers/schema";
import { setBundleBlobs } from "../../actions/setBundleBlobs";

interface FileLoader {
  isLoading: boolean;
  fileContent: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loadError: Error | null;
}

const FileLoaderView = ({ fileLoader }: { fileLoader: FileLoader }) => {
  return (
    <>
      <input
        type="file"
        accept="application/json"
        onChange={fileLoader.onChange}
      />
      {fileLoader.isLoading && (
        <span className="BundleLoaderView-loading">Loading...</span>
      )}
      {fileLoader.fileContent !== null && (
        <span className="BundleLoaderView-loaded">Loaded!</span>
      )}
      {fileLoader.loadError && (
        <span className="BundleLoaderView-error">
          {fileLoader.loadError.toString()}
        </span>
      )}
    </>
  );
};

const useFileLoader = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [fileContent, setFileContent] = React.useState<string | null>(null);
  const [loadError, setLoadError] = React.useState<Error | null>(null);

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files as FileList;

      if (!files || files.length !== 1) {
        return;
      }

      setIsLoading(true);

      const fileReader = new FileReader();
      fileReader.readAsText(files[0]);
      fileReader.onload = (e: ProgressEvent) => {
        setIsLoading(false);
        if (e.target && typeof fileReader.result === "string") {
          setFileContent(fileReader.result);
        }
      };
      fileReader.onerror = (e: ProgressEvent) => {
        setIsLoading(false);
        fileReader && setLoadError(fileReader.error);
      };
    },
    []
  );

  return {
    isLoading,
    fileContent,
    onChange,
    loadError
  };
};

const BundleLoaderView = () => {
  const baseline = useFileLoader();
  const pullRequest = useFileLoader();

  const isUninitialized = useSelector(
    (store: RootStore) =>
      store.bundleData.initializationState.type === "UNINITIALIZED"
  );

  React.useEffect(() => {
    if (isUninitialized && baseline.fileContent && pullRequest.fileContent) {
      setBundleBlobs(baseline.fileContent, pullRequest.fileContent);
    }
  }, [isUninitialized, baseline.fileContent, pullRequest.fileContent]);

  return (
    <section className="BundleLoaderView-wrapper">
      baseline:
      <FileLoaderView fileLoader={baseline} />
      pull request
      <FileLoaderView fileLoader={pullRequest} />
    </section>
  );
};

export default BundleLoaderView;
