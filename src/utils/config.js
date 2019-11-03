import React from "react";
import ReactDatGui, { DatFolder, DatNumber, DatColor } from "react-dat-gui";
import "react-dat-gui/dist/index.css";
import create from "zustand";

export const [useConfig] = create(set => ({
  commit: {
    radius: 5,
    color: "#7000FF",
    emissiveIntensity: 1
  },
  speed: 1,
  set
}));

export const DatGui = () => {
  const data = useConfig();
  const handleUpdate = useConfig(config => config.set);

  return (
    <ReactDatGui data={data} onUpdate={handleUpdate}>
      <DatNumber path="speed" label="Speed" min={0} max={2} step={0.001} />
      <DatFolder title="Commit" closed={false}>
        <DatNumber
          path="commit.radius"
          label="Radius"
          min={1}
          max={10}
          step={0.01}
        />
        <DatColor path="commit.color" label="Color" />
        <DatNumber
          path="commit.emissiveIntensity"
          label="Emissive Intensity"
          min={0}
          max={2}
          step={0.1}
        />
      </DatFolder>
    </ReactDatGui>
  );
};
