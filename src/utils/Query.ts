export interface IdentifierQuery {
  type: "FILENAME";
  fileName: string;
  caseSensitive: boolean;
}

export interface IncludesQuery {
  type: "INCLUDES";
  target: IdentifierQuery;
}

export interface IncludedByQuery {
  type: "INCLUDEDBY";
  target: IdentifierQuery;
}

export interface ORQuery {
  type: "OR";
  left: Query;
  right: Query;
}

export interface AndQuery {
  type: "AND";
  left: Query;
  right: Query;
}

export interface AddedQuery {
  type: "ADDED";
}

export interface RemovedQuery {
  type: "REMOVED";
}

export interface ChangedQuery {
  type: "CHANGED";
}

export interface InterpolateQuery {
  type: "INTERPOLATE";
  innerQuery: Query;
}

export interface NotQuery {
  type: "NOT";
  innerQuery: Query;
}

export type Query =
  | IdentifierQuery
  | IncludedByQuery
  | IncludesQuery
  | ORQuery
  | AndQuery
  | AddedQuery
  | RemovedQuery
  | ChangedQuery
  | InterpolateQuery
  | NotQuery;
