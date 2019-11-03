import { useEffect } from "react";
import { useFrame } from "react-three-fiber";
import Stats from "stats.js";

let stats;

export default () => {
  useEffect(() => {
    stats = new Stats();
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
