import React, { useRef, useEffect, useState, useMemo } from "react";
import { useSpring, a } from "react-spring/three";
import { Color, Texture } from "three";
import createMSDFShader from "three-bmfont-text/shaders/msdf";
import createTextGeometry from "three-bmfont-text";

import ptMonoFont from "assets/fonts/pt-mono/ptm55ft.fnt";
import ptMonoImage from "assets/fonts/pt-mono/ptm55ft.png";
import loadingManager, { RESOURCE_TYPE_FONT } from "utils/loadingManager";

const ptMono = loadingManager.registerResource(
  {
    font: ptMonoFont,
    image: ptMonoImage
  },
  RESOURCE_TYPE_FONT
);

const DEFAULT_ATLAS = new Texture();
const DEFAULT_COLOR = "#FFFFFF";

const FlatText = props => {
  const { active: isActive, children, color, width, ...meshProps } = props;

  const ref = useRef(null);
  const [font, setFont] = useState(null);

  const colorObject = useMemo(() => new Color(color), [color]);
  const text = useMemo(() => children.join("\n"), [children]);
  const MSDFShader = useMemo(
    () =>
      createMSDFShader({
        transparent: true,
        color: "#FFFFFF",
        opacity: 0
      }),
    []
  );

  useEffect(() => {
    const f = async () => {
      const { definition, atlas } = await ptMono.get();

      // create text geometry
      const geometry = createTextGeometry({
        text,
        font: definition, // the bitmap font definition
        width, // width for word-wrap
        lineHeight: 48
      });

      setFont({ definition, atlas, geometry });
    };

    f();
  }, [text, setFont, width]);

  const [spring, set] = useSpring(() => ({ "uniforms-opacity-value": 0 }));
  useEffect(() => {
    if (isActive) {
      // show
      set({ "uniforms-opacity-value": 1 });
    } else {
      // hide
      set({ "uniforms-opacity-value": 0 });
    }
  }, [isActive, set]);

  if (!font || !font.geometry) {
    return null;
  }

  return (
    <group {...meshProps}>
      <mesh ref={ref} scale={[0.05, 0.05, 1]} geometry={font.geometry}>
        <a.rawShaderMaterial
          attach="material"
          args={[MSDFShader]}
          {...spring}
          uniforms-color-value={colorObject}
          uniforms-map-value={(font && font.atlas) || DEFAULT_ATLAS}
        />
      </mesh>
    </group>
  );
};

FlatText.defaultProps = {
  color: DEFAULT_COLOR,
  width: 960
};

export default FlatText;
