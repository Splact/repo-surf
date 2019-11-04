import React from "react";
import ReactDatGui, {
  DatFolder,
  DatNumber,
  DatColor,
  DatBoolean
} from "react-dat-gui";
import "react-dat-gui/dist/index.css";
import create from "zustand";

export const [useConfig] = create(set => ({
  commit: {
    radius: 5,
    color: "#8ACB67",
    emissiveIntensity: 1
  },
  track: {
    width: 6,
    length: 32,
    color: "#8ACB67",
    emissiveIntensity: 1
  },
  camera: {
    xVariation: 1,
    yVariation: 4,
    zVariation: 12,
    variationDuration: 15
  },
  speed: 0.5,
  isOrbitControlsEnabled: false,
  set
}));

export const DatGui = () => {
  const data = useConfig();
  const handleUpdate = useConfig(config => config.set);

  return (
    <ReactDatGui data={data} onUpdate={handleUpdate}>
      <DatNumber path="speed" label="Speed" min={0} max={2} step={0.001} />
      <DatBoolean path="isOrbitControlsEnabled" label="Orbit Controls" />

      <DatFolder title="Camera">
        <DatNumber
          path="camera.xVariation"
          label="Variation on X"
          min={0}
          max={25}
          step={0.1}
        />
        <DatNumber
          path="camera.yVariation"
          label="Variation on Y"
          min={0}
          max={25}
          step={0.1}
        />
        <DatNumber
          path="camera.zVariation"
          label="Variation on Z"
          min={0}
          max={25}
          step={0.1}
        />
        <DatNumber
          path="camera.variationDuration"
          label="Duration of variation (s)"
          min={0.5}
          max={100}
          step={0.1}
        />
      </DatFolder>

      <DatFolder title="Commit">
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

      <DatFolder title="Track">
        <DatNumber
          path="track.width"
          label="Width"
          min={1}
          max={50}
          step={0.1}
        />
        <DatNumber
          path="track.length"
          label="Length"
          min={1}
          max={72}
          step={0.1}
        />
        <DatColor path="track.color" label="Color" />
        <DatNumber
          path="track.emissiveIntensity"
          label="Emissive Intensity"
          min={0}
          max={2}
          step={0.1}
        />
      </DatFolder>
    </ReactDatGui>
  );
};
