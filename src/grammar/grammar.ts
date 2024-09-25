import * as ohm from "ohm-js";
import { Query } from "../utils/Query";
import { CompilationResult } from "./compilationTypes";
import { filterGrammarText } from "./grammarDefinition";

const filterGrammar = ohm.grammar(filterGrammarText);

const semantics = filterGrammar.createSemantics().addOperation("getQueryTree", {
  Exp: (e: any): Query => {
    return e.getQueryTree();
  },
  AndExp: (
    left: any,
    _space1: any,
    _op: any,
    _space2: any,
    right: any,
  ): Query => {
    return {
      type: "AND",
      left: left.getQueryTree(),
      right: right.getQueryTree(),
    };
  },
  OrExp: (
    left: any,
    _space1: any,
    _op: any,
    _space2: any,
    right: any,
  ): Query => {
    return {
      type: "OR",
      left: left.getQueryTree(),
      right: right.getQueryTree(),
    };
  },
  PrimExp: (e: any): Query => {
    return e.getQueryTree();
  },
  ParenExp: (
    _lparen: any,
    _space1: any,
    inner: any,
    _space2: any,
    _rparn: any,
  ): Query => {
    return inner.getQueryTree();
  },
  IncludedByExp: (_includeToken: any, _space1: any, e: any): Query => {
    return {
      type: "INCLUDEDBY",
      target: e.getQueryTree(),
    };
  },
  IncludesExp: (_includeToken: any, _space1: any, e: any): Query => {
    return {
      type: "INCLUDES",
      target: e.getQueryTree(),
    };
  },
  InterpolateExp: (_interpolateToken: any, innerExpression: any): Query => {
    return {
      type: "INTERPOLATE",
      innerQuery: innerExpression.getQueryTree(),
    };
  },
  NotExp: (_interpolateToken: any, innerExpression: any): Query => {
    return {
      type: "NOT",
      innerQuery: innerExpression.getQueryTree(),
    };
  },
  pathLiteral: (
    _quoteOpen: any,
    body: any,
    _quoteClose: any,
    caseSensitiveToken: any,
  ): Query => {
    return {
      type: "FILENAME",
      caseSensitive: caseSensitiveToken.sourceString === "!",
      fileName: body.sourceString,
    };
  },
  specialCaseLiteral: (specialToken: any): Query => {
    const literalType: string = specialToken.sourceString.toUpperCase();
    if (
      literalType !== "ADDED" &&
      literalType !== "CHANGED" &&
      literalType !== "REMOVED"
    ) {
      throw new Error(
        `specialCaseLiteral had token "${literalType}", not one of ADDED/CHANGED/REMOVED`,
      );
    }
    return {
      type: literalType,
    };
  },
});

export const parseFilterStringToQuery = (input: string): CompilationResult => {
  const match = filterGrammar.match(input);
  console.log(match);
  console.log(match.succeeded() && semantics(match));
  return match.succeeded()
    ? {
        type: "CompilationSuccess",
        query: semantics(match).getQueryTree(),
      }
    : {
        type: "CompilationError",
        message: match.message || "",
      };
};
