import * as React from "react";
import "./BundleLoaderView.css";

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
      const target = e.target;
      const files = e.target.files as FileList;

      if (!files || files.length != 0) {
        return;
      }

      setIsLoading(true);

      const fileReader = new FileReader();
      fileReader.readAsText(files[0]);
      fileReader.onload = e => {
        if (e.target && typeof e.target.result === "string") {
          setFileContent(e.target.result);
        }
      };
      fileReader.onerror = e => {
        setIsLoading(false);
        e.target && setLoadError(e.target.error);
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
