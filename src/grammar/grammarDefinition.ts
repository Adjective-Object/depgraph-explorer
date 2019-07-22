export const filterGrammarText = `
BundleQuery {
  Exp
    = AndExp | OrExp | PrimExp

  AndExp
    = PrimExp _ ("&"|"&&") _ PrimExp

  OrExp
    = PrimExp _ ("|"|"||") _ PrimExp

  PrimExp
    = NotExp | InterpolateExp | IncludesExp | IncludedByExp | pathLiteral | specialCaseLiteral | ParenExp

  ParenExp = "(" _ Exp _ ")"

  InterpolateExp
    = "interpolate" ParenExp

  NotExp
    = "not" ParenExp

  IncludedByExp
    = ("included-by"|"included_by"|"includedby"|"includedBy") _ (pathLiteral | specialCaseLiteral | ParenExp)

  IncludesExp
    = ("includes") _ Exp

  pathLiteral
    = ("'" pathLiteralInternal "'" "!"? )
    | ("\\"" pathLiteralInternal "\\"" "!"? )

  pathLiteralInternal
    = (alnum|"\\\\"|"/"|"."|":"|"*"|"-"|"_")*
    
  specialCaseLiteral
    = "removed" | "added" | "changed"

    _ = space*
}
`;
