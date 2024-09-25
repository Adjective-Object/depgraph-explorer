import { PerformQueryRequestMessage } from "../worker/messages";
import { store } from "../store";
import { CompilationSuccess } from "../grammar/compilationTypes";
import debounce from "lodash/debounce";
import { isCompilationError } from "../grammar/isCompilationError";
import { appWorker } from "..";

/**
 * Post the message, debounced.
 */

let previousLastSucessfulCompilation: CompilationSuccess | null = null;
store.subscribe(() => {
  const currentCompilation = store.getState().query.lastSucessfulCompilation;
  if (previousLastSucessfulCompilation !== currentCompilation) {
    previousLastSucessfulCompilation = currentCompilation;
    if (currentCompilation && !isCompilationError(currentCompilation)) {
      debouncedPostMessage({
        type: "QUERY_REQUEST",
        query: currentCompilation.query,
      });
    }
  }
});

const debouncedPostMessage = debounce(
  (message: PerformQueryRequestMessage) => appWorker.postMessage(message),
  300,
);
