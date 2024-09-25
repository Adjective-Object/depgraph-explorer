import { CompilationError, CompilationSuccess } from "./compilationTypes";

export const isCompilationError = (
  v: CompilationError | CompilationSuccess | null,
): v is CompilationError => {
  return v !== null && v.type === "CompilationError";
};
