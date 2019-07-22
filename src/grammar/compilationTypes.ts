import { Query } from "../utils/Query";

export interface CompilationError {
  type: "CompilationError";
  message: string;
}
export interface CompilationSuccess {
  type: "CompilationSuccess";
  query: Query;
}

export type CompilationResult = CompilationError | CompilationSuccess;
