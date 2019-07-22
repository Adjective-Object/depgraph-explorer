export function getPackageFromFilePath(filePath: string): [string, string] {
  let match: RegExpExecArray | string[] | null;
  if (
    (match = /\/node_modules\/([^/]*)\/(.*)$/g.exec(filePath)) &&
    filePath.indexOf("css-loader") == -1
  ) {
    return [match[1], match[1] + "/" + match[2]];
  }
  if ((match = /\/([^/]*)\/(lib|src)\/([^!]*)$/g.exec(filePath))) {
    return [match[1], match[1] + "/" + match[2] + "/" + match[3]];
  }
  return [filePath, filePath];
}
