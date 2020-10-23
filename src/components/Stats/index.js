import { useEffect } from "react";
import { useFrame } from "react-three-fiber";
import StatsJS from "stats.js";

let stats;

const Stats = () => {
  useEffect(() => {
    stats = new StatsJS();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    return () => {
      stats.dom.remove();
    };
  }, []);

  useFrame(() => {
    stats.update();
  });

  return null;
};

export default Stats;
