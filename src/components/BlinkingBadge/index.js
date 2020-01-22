import React from "react";
import "./style.scss";

const BlinkingBadge = ({ className = "", children = "beta" }) => (
  <div className={`BlinkingBadge ${className}`}>{children}</div>
);

export default BlinkingBadge;
