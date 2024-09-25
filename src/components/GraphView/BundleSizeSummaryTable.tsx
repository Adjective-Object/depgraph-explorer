import * as React from "react";
import { useSelector } from "react-redux";
import { RootStore, SizeSummary } from "../../reducers/schema";
import { isQuerySuccess } from "../../utils/isQueryResultError";
import "./BundleSizeSummaryTable.css";
import {
  formatByteSize,
  formatByteSizeChange,
  formatCountChange
} from "../../utils/formatByteSize";
import { GOOD_COLOR, BAD_COLOR } from "../../utils/colors";

const BAD_BASELINE = 4096;
const styleForDeltaCell = (x: number): React.CSSProperties => {
  const percent = Math.max(-1, Math.min(1, x / BAD_BASELINE));
  const targetColor = percent < 0 ? GOOD_COLOR : BAD_COLOR;
  const color = targetColor.replace(
    /1\)$/,
    Math.abs(1 - Math.pow(1 - percent, 3)).toString()
  );
  return {
    backgroundColor: color
  };
};

const BundleSizeSummaryTableRow = ({
  name,
  size,
  className
}: {
  name: string;
  size: SizeSummary;
  className?: string;
}) => (
  <tr className={className}>
    <td>{name}</td>
    <td>{size.numFilesAfter}</td>
    <td style={styleForDeltaCell(size.numFilesDelta)}>
      {formatCountChange(size.numFilesDelta)}
    </td>
    <td>{formatByteSize(size.totalBytesAfter)}</td>
    <td style={styleForDeltaCell(size.totalBytesDelta)}>
      {formatByteSizeChange(size.totalBytesDelta)}
    </td>
  </tr>
);

export const BundleSizeSummaryTable = () => {
  const summary = useSelector((store: RootStore) =>
    isQuerySuccess(store.query.queryResult)
      ? store.query.queryResult.summary
      : null
  );
  return summary == null ? null : (
    <section className="BundleSizeSummary-container">
      <table className="BundleSizeSummary-table">
        <tbody>
          <tr className={"BundleSizeSummary-titleRow"}>
            <td>Name</td>
            <td># Files</td>
            <td>Δ Files</td>
            <td>Size</td>
            <td>Δ Size</td>
          </tr>
          <BundleSizeSummaryTableRow
            className="BundleSizeSummary-totalsRow"
            name={"Total"}
            size={summary.total}
          />
          {Object.entries(summary.packages)
            .sort(
              (
                [, size1]: [string, SizeSummary],
                [, size2]: [string, SizeSummary]
              ) => {
                return (
                  Math.abs(size2.totalBytesAfter) -
                  Math.abs(size1.totalBytesAfter)
                );
              }
            )
            .sort(
              (
                [, size1]: [string, SizeSummary],
                [, size2]: [string, SizeSummary]
              ) => {
                return (
                  Math.abs(size2.totalBytesAfter) -
                  Math.abs(size1.totalBytesAfter)
                );
              }
            )
            .sort(
              (
                [, size1]: [string, SizeSummary],
                [, size2]: [string, SizeSummary]
              ) => {
                return (
                  Math.abs(size2.totalBytesDelta) -
                  Math.abs(size1.totalBytesDelta)
                );
              }
            )
            .map(([name, size]: [string, SizeSummary]) => (
              <BundleSizeSummaryTableRow key={name} name={name} size={size} />
            ))}
        </tbody>
      </table>
    </section>
  );
};

export default BundleSizeSummaryTable;
