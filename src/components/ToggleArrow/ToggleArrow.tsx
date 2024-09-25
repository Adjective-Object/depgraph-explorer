import * as React from "react";
import "./ToggleArrow.css";
import { default as classNames } from "classnames";

type ArgsOf<T> = T extends (...args: (infer A)[]) => any ? A : never;

const ToggleArrow = ({
  isClosed,
  onClick,
  className,
  children
}: React.PropsWithChildren<{
  isClosed: boolean;
  onClick?: () => void;
  className?: ArgsOf<typeof classNames>;
}>) => (
  <button className={classNames("ToggleArrow", className)} onClick={onClick}>
    {isClosed ? "▲" : "▼"}{children}
  </button>
);
export default ToggleArrow;
