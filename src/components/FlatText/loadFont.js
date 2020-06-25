import { TextureLoader } from "three";
import loadFont from "load-bmfont";
import loadingManager from "utils/loadingManager";

export default ({ font, image }) =>
  new Promise((resolve, reject) => {
    loadFont(font, (e, definition) => {
      if (e) {
        reject(e);
      } else {
        const loader = new TextureLoader(loadingManager);
        loader.load(
          image,
          atlas => {
            resolve({ definition, atlas });
          },
          undefined,
          e => {
            reject(e);
          }
        );
      }
    });
  });
