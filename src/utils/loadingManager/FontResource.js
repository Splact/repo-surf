import loadFont from "load-bmfont";
import { TextureLoader } from "three";

import clamp from "utils/clamp";
import Resource from "./Resource";

let textureLoader;

export default class FontResource extends Resource {
  constructor(...args) {
    super(...args);

    if (!textureLoader) {
      textureLoader = new TextureLoader(this.manager);
    }
    this.textureLoader = textureLoader;
  }
  load(onProgress) {
    const { font, image } = this.request;

    loadFont(font, (e, definition) => {
      if (e) {
        console.log("Error loading font.", { font }, e);
        throw new Error(e);
      }

      this.textureLoader.load(
        image,
        atlas => {
          this.setResponse({ definition, atlas });
          onProgress();
        },
        ({ loaded, total }) => {
          this.progress = !total
            ? 1
            : clamp(loaded / total, { min: 0, max: 1 });
          console.log("progress font", this.progress);

          onProgress();
        },
        e => {
          console.log("Error loading font atlas.", { font, image }, e);
          throw new Error(e);
        }
      );
    });
  }
}
