export function getPackageFromFilePath(filePath: string): [string, string] {
  // catch namespaced modules.
  let nm_idx = filePath.lastIndexOf("/node_modules/")
  if (nm_idx == -1 && filePath.startsWith("node_modules/")) {
    nm_idx = 0
  }

  if (nm_idx != -1) {
    let nm_scan_head = filePath.slice(nm_idx + "/node_modules/".length)

    if (nm_scan_head.startsWith("@")) {
      // console.log("@", "nm_scan_head", nm_scan_head)
      // get index of 2nd slice
      let secondSlice = nm_scan_head.indexOf("/", nm_scan_head.indexOf("/") + 1)
      if (secondSlice == -1) {
        return [nm_scan_head, ""]
      } else {
        return [nm_scan_head.slice(0, secondSlice), nm_scan_head.slice(secondSlice + 1)]
      }
    } else {
      // console.log("no @", "nm_scan_head", nm_scan_head)
      // Split on first slice
      const idx = nm_scan_head.indexOf("/")
      if (idx == -1) {
        return [nm_scan_head, ""]
      } else {
        return [nm_scan_head.slice(0, idx), nm_scan_head.slice(idx + 1)]
      }
    }
  }

  let match: RegExpExecArray | string[] | null;
  if ((match = /\/([^/]*)\/(lib|src)\/([^!]*)$/g.exec(filePath))) {
    return [match[1], match[1] + "/" + match[2] + "/" + match[3]];
  }
  return [filePath, filePath];
}
