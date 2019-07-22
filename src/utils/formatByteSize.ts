export const formatByteSize = (size: number) => {
  if (size === 0) {
    return "0";
  }
  const unitIndex = Math.floor(Math.log(size) / Math.log(1024));
  const num = size / Math.pow(1024, unitIndex);
  return (
    (unitIndex === 0 ? num.toString() : num.toFixed(2)) +
    ["B", "kB", "MB", "GB", "TB"][unitIndex]
  );
};

export const formatByteSizeChange = (size: number) =>
  size > 0 ? `+${formatByteSize(size)}` : `-${formatByteSize(Math.abs(size))}`;

export const formatCountChange = (size: number) =>
  size > 0 ? `+${size}` : `-${Math.abs(size)}`;
