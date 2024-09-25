export const defaultTutorials = [
  { exampleName: "Added Files", exampleBody: "added" },
  { exampleName: "Removed Files", exampleBody: "removed" },
  { exampleName: "Changed Files", exampleBody: "changed" },
  { exampleName: "Package 1", exampleBody: "'package1/lib'" },
  {
    exampleName: "Package 1 and Package 2",
    exampleBody: "'package1/lib'\n  | 'package2/lib' ",
  },
  {
    exampleName: "Json files in package 1",
    exampleBody: "'package1/*json'\n ",
  },
  {
    exampleName: "package1 files that include the current changes",
    exampleBody: "includes changed & 'package1'",
  },
  {
    exampleName: "packages indexes included by Package 1",
    exampleBody: "(included_by '*package1*') & '*index.js*'",
  },
  {
    exampleName: "packages included by package 1, tracing dependenices",
    exampleBody: "interpolate( (included_by '*package1*') & '*index.js*' )",
  },
];
