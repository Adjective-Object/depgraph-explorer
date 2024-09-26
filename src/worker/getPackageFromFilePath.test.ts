import { getPackageFromFilePath } from "./getPackageFromFilePath"

describe("getPackageFromFilePath", () => {
  it("for namespaced package in node_modules", () => {
    expect(getPackageFromFilePath("./node_modules/@gamer/foo/bar")).toEqual([
      "@gamer/foo",
      "bar"
    ])

    expect(getPackageFromFilePath("./node_modules/@gamer/foo")).toEqual([
      "@gamer/foo",
      ""
    ])

    expect(getPackageFromFilePath("./node_modules/@gamer/foo/")).toEqual([
      "@gamer/foo",
      ""
    ])
  })

  it("for package in node_modules", () => {
    expect(getPackageFromFilePath("./node_modules/foo/bar/lib/index.js")).toEqual([
      "foo",
      "bar/lib/index.js"
    ])

    expect(getPackageFromFilePath("./node_modules/foo")).toEqual([
      "foo",
      ""
    ])

    expect(getPackageFromFilePath("./node_modules/foo/")).toEqual([
      "foo",
      ""
    ])
  })

  it("for package in nested node_modules", () => {
    expect(getPackageFromFilePath("./node_modules/subbpackage/node_modules/foo/bar")).toEqual([
      "foo",
      "bar"
    ])

    expect(getPackageFromFilePath("./node_modules/subbpackage/node_modules/foo")).toEqual([
      "foo",
      ""
    ])

    expect(getPackageFromFilePath("./node_modules/subbpackage/node_modules/foo/")).toEqual([
      "foo",
      ""
    ])
  })



  it("importing path with no leading slash on nm", () => {
    expect(getPackageFromFilePath("node_modules/subbpackage/node_modules/foo/bar")).toEqual([
      "foo",
      "bar"
    ])

    expect(getPackageFromFilePath("node_modules/subbpackage/node_modules/foo")).toEqual([
      "foo",
      ""
    ])

    expect(getPackageFromFilePath("node_modules/subbpackage/node_modules/foo/")).toEqual([
      "foo",
      ""
    ])
  })

})