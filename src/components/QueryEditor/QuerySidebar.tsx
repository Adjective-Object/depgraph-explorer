import * as React from "react";
import "./QuerySidebar.css";

const QuerySidebar = ({
  children
}: {
  children: React.ReactElement | React.ReactElement[];
}) => <section className="QuerySidebar-host">{children}</section>;

export default QuerySidebar;
